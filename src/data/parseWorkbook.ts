import readXlsxFile, { type Sheet } from 'read-excel-file/browser';
import type {
  ApprovalStep,
  Assignment,
  Entitlement,
  ExecutionMode,
  Service,
  Sla,
  SubService,
} from '../flow/types';

type Row = Record<string, string>;

const SHEETS = {
  services: 'services',
  subServices: 'subservices',
  entitlements: 'entitlements',
  slas: 'slas',
  approvals: 'approvals',
  assignments: 'assignments',
  supportGroups: 'supportgroups',
  attributes: 'attributes',
} as const;

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function cellToString(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).trim();
}

function toRows(data: unknown[][]): Row[] {
  if (!data || data.length < 2) {
    return [];
  }
  const headers = data[0].map((header) => normalizeKey(cellToString(header)));
  return data
    .slice(1)
    .map((values) => {
      const row: Row = {};
      headers.forEach((header, index) => {
        if (header) {
          row[header] = cellToString(values[index]);
        }
      });
      return row;
    })
    .filter((row) => Object.values(row).some((value) => value !== ''));
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const bucket = map.get(key(item));
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(key(item), [item]);
    }
  }
  return map;
}

function toNumber(value: string): number | null {
  const parsed = Number(value);
  return value !== '' && Number.isFinite(parsed) ? parsed : null;
}

function toSla(row: Row | undefined): Sla {
  const target = row ? toNumber(row.slatarget ?? '') : null;
  if (target === null) {
    return { target: null, unit: '', label: 'No SLA defined', risk: 'none' };
  }
  const unit = (row?.slaunit ?? '').replace(/_/g, ' ');
  const plural = target === 1 ? unit : `${unit}s`;
  return {
    target,
    unit,
    label: unit ? `${target} ${plural}` : String(target),
    risk: 'timed',
  };
}

function toExecutionMode(value: string): ExecutionMode {
  return /^seq/i.test(value) ? 'SEQUENCE' : 'PARALLEL';
}

function ticketTypeLabel(code: string) {
  if (/^wo$/i.test(code)) return 'Work Order';
  if (/^inc$/i.test(code)) return 'Incident';
  if (/^sr$/i.test(code)) return 'Service Request';
  if (/^chg$/i.test(code)) return 'Change';
  return code || 'Task';
}

export function buildCatalog(sheets: Map<string, unknown[][]>): Service[] {
  const read = (name: string) => toRows(sheets.get(name) ?? []);

  const serviceRows = read(SHEETS.services);
  const subServiceRows = read(SHEETS.subServices);

  if (serviceRows.length === 0 || subServiceRows.length === 0) {
    throw new Error(
      'Expected a workbook with at least the "Services" and "SubServices" sheets. Download the template to see the required tabs.',
    );
  }

  const entitlements = groupBy(read(SHEETS.entitlements), (row) => row.subserviceid);
  const slas = new Map(read(SHEETS.slas).map((row) => [row.subserviceid, row]));
  const approvals = groupBy(read(SHEETS.approvals), (row) => row.subserviceid);
  const assignments = groupBy(read(SHEETS.assignments), (row) => row.subserviceid);
  const attributes = groupBy(
    read(SHEETS.attributes).filter((row) => row.entitytype === 'SUB_SERVICE'),
    (row) => row.entityid,
  );
  const supportGroups = new Map(
    read(SHEETS.supportGroups).map((row) => [row.supportgroup, row]),
  );

  const subServicesByService = groupBy(subServiceRows, (row) => row.serviceid);

  const services = serviceRows.map<Service>((row) => ({
    id: row.serviceid,
    name: row.servicename,
    domain: row.domain,
    ownerName: row.ownername || undefined,
    ownerPrId: row.ownerprid || undefined,
    ownerEmail: row.owneremail || undefined,
    description: row.description || undefined,
    subServices: (subServicesByService.get(row.serviceid) ?? []).map<SubService>((sub) => {
      const id = sub.subserviceid;
      return {
        id,
        name: sub.subservicename,
        requestType: sub.requesttype || 'Service Request',
        active: !/^n(o)?$/i.test(sub.active || 'Y'),
        entitlements: (entitlements.get(id) ?? []).map<Entitlement>((entry) => ({
          id: entry.entitlementid,
          entitlement: entry.entitlement,
          note: entry.entitlementnote || undefined,
        })),
        approvals: (approvals.get(id) ?? [])
          .map<ApprovalStep>((entry) => ({
            level: toNumber(entry.level) ?? 0,
            approverType: entry.approvertype,
            approver: entry.approver,
          }))
          .sort((a, b) => a.level - b.level),
        assignments: (assignments.get(id) ?? [])
          .map<Assignment>((entry) => {
            const group = supportGroups.get(entry.supportgroup);
            return {
              seq: toNumber(entry.seq) ?? 0,
              supportGroup: entry.supportgroup,
              ticketType: ticketTypeLabel(entry.tickettype),
              executionMode: toExecutionMode(entry.executionmode),
              tier: group?.tier,
              coverage: group?.coverage,
            };
          })
          .sort((a, b) => a.seq - b.seq),
        sla: toSla(slas.get(id)),
        attributes: (attributes.get(id) ?? []).map((entry) => ({
          key: entry.key,
          value: entry.value,
        })),
      };
    }),
  }));

  const populated = services.filter((service) => service.subServices.length > 0);
  if (populated.length === 0) {
    throw new Error('No sub-services matched a service_id from the Services sheet.');
  }
  return populated;
}

export async function parseWorkbook(file: File): Promise<Service[]> {
  const workbook = (await readXlsxFile(file)) as Sheet[];
  const sheets = new Map<string, unknown[][]>(
    workbook.map((sheet) => [normalizeKey(sheet.sheet), sheet.data as unknown[][]]),
  );
  return buildCatalog(sheets);
}
