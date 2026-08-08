import readXlsxFile from 'read-excel-file/browser';
import type { Service, SlaRisk, SubService } from '../flow/types';

export const COLUMN_ALIASES: Record<string, string[]> = {
  service: ['service', 'parent service', 'service name', 'parent'],
  domain: ['domain', 'service domain', 'category', 'business unit'],
  subService: [
    'sub-service',
    'sub service',
    'subservice',
    'sub-service name',
    'service offering',
    'offering',
  ],
  entitlement: ['entitlement', 'entitled users', 'entitled to', 'audience'],
  entitlementNote: ['entitlement note', 'entitlement notes', 'entitlement detail'],
  approvals: [
    'approvals',
    'approval',
    'approval flow',
    'approval levels',
    'approvers',
    'approval chain',
  ],
  fulfillment: [
    'fulfillment type',
    'fulfilment type',
    'fulfillment',
    'fulfilment',
    'request type',
  ],
  supportGroup: ['support group', 'assignment group', 'resolver group', 'fulfillment group'],
  supportNote: ['support note', 'support tier', 'coverage', 'support hours'],
  sla: ['sla', 'sla target', 'resolution sla', 'target', 'resolution target'],
};

const APPROVAL_SPLIT = /\s*(?:;|\||>|→|,|\/|\n)\s*/;

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[_]+/g, ' ').replace(/\s+/g, ' ');
}

function resolveColumns(headers: string[]) {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (!map.has(key) && aliases.includes(normalized)) {
        map.set(key, index);
      }
    }
    if (/^approval\s*\d+$/.test(normalized)) {
      map.set(normalized, index);
    }
  });
  return map;
}

function cell(row: unknown[], index: number | undefined) {
  if (index === undefined) {
    return '';
  }
  const value = row[index];
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value).trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function detectSla(value: string): { label: string; risk: SlaRisk } {
  const normalized = value.trim();
  if (!normalized || /^(no sla|none|n\/a|na|not defined|-)$/i.test(normalized)) {
    return { label: 'No SLA', risk: 'none' };
  }
  return { label: normalized, risk: 'timed' };
}

function detectFulfillment(value: string): { type: string; code: string } {
  const normalized = value.trim();
  if (!normalized) {
    return { type: 'Not specified', code: '—' };
  }
  if (/^(wo|work ?order)$/i.test(normalized)) {
    return { type: 'Work Order', code: 'WO' };
  }
  if (/^(sr|service ?request)$/i.test(normalized)) {
    return { type: 'Service Request', code: 'SR' };
  }
  if (/^(inc|incident)$/i.test(normalized)) {
    return { type: 'Incident', code: 'INC' };
  }
  if (/^(chg|change)$/i.test(normalized)) {
    return { type: 'Change', code: 'CHG' };
  }
  return {
    type: normalized,
    code: normalized
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 3),
  };
}

export function rowsToServices(rows: unknown[][]): Service[] {
  if (rows.length < 2) {
    throw new Error('The sheet needs a header row and at least one data row.');
  }

  const headers = rows[0].map((header) => String(header ?? ''));
  const columns = resolveColumns(headers);

  if (!columns.has('service') || !columns.has('subService')) {
    throw new Error(
      'Could not find the "Service" and "Sub-service" columns. Expected headers like: Service, Sub-service, Entitlement, Approvals, Fulfillment Type, Support Group, SLA.',
    );
  }

  const numberedApprovalKeys = [...columns.keys()]
    .filter((key) => /^approval\s*\d+$/.test(key))
    .sort();

  const byService = new Map<string, Service>();

  for (const row of rows.slice(1)) {
    const serviceName = cell(row, columns.get('service'));
    const subServiceName = cell(row, columns.get('subService'));
    if (!serviceName || !subServiceName) {
      continue;
    }

    const approvalsCell = cell(row, columns.get('approvals'));
    const numberedApprovals = numberedApprovalKeys
      .map((key) => cell(row, columns.get(key)))
      .filter(Boolean);
    const approvals = numberedApprovals.length
      ? numberedApprovals
      : approvalsCell
              .split(APPROVAL_SPLIT)
              .map((entry) => entry.replace(/^[①②③④⑤\d.)\s-]+/, '').trim())
              .filter((entry) => entry.length > 0 && !/^(none|no approval|n\/a|na)$/i.test(entry));

    const fulfillment = detectFulfillment(cell(row, columns.get('fulfillment')));

    const subService: SubService = {
      id: `${slugify(serviceName)}--${slugify(subServiceName)}`,
      name: subServiceName,
      requestType: 'Sub-service',
      entitlement: cell(row, columns.get('entitlement')) || 'Not specified',
      entitlementNote: cell(row, columns.get('entitlementNote')) || undefined,
      approvals,
      fulfillmentType: fulfillment.type,
      fulfillmentCode: fulfillment.code,
      supportGroup: cell(row, columns.get('supportGroup')) || 'Unassigned',
      supportNote: cell(row, columns.get('supportNote')) || undefined,
      sla: detectSla(cell(row, columns.get('sla'))),
    };

    const existing = byService.get(serviceName);
    if (existing) {
      existing.subServices.push(subService);
      if (!existing.domain) {
        existing.domain = cell(row, columns.get('domain'));
      }
    } else {
      byService.set(serviceName, {
        name: serviceName,
        domain: cell(row, columns.get('domain')) || 'Service catalog',
        subServices: [subService],
      });
    }
  }

  const services = [...byService.values()];
  if (services.length === 0) {
    throw new Error('No rows with both a service and a sub-service were found.');
  }
  return services;
}

function parseCsv(text: string): unknown[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);

  return rows.filter((entry) => entry.some((value) => value.trim() !== ''));
}

/** read-excel-file returns either rows, or a list of `{ sheet, data }` entries. */
function extractRows(result: unknown): unknown[][] {
  if (!Array.isArray(result) || result.length === 0) {
    return [];
  }
  const first = result[0];
  if (Array.isArray(first)) {
    return result as unknown[][];
  }
  if (first && typeof first === 'object' && 'data' in first) {
    const sheets = result as Array<{ sheet: string; data: unknown[][] }>;
    const populated = sheets.find((sheet) => sheet.data && sheet.data.length > 1);
    return populated?.data ?? sheets[0].data ?? [];
  }
  return [];
}

export async function parseServiceFile(file: File): Promise<Service[]> {
  if (/\.csv$/i.test(file.name)) {
    return rowsToServices(parseCsv(await file.text()));
  }
  const result = (await readXlsxFile(file)) as unknown;
  return rowsToServices(extractRows(result));
}

export const TEMPLATE_HEADERS = [
  'Service',
  'Domain',
  'Sub-service',
  'Entitlement',
  'Approvals',
  'Fulfillment Type',
  'Support Group',
  'Support Note',
  'SLA',
];

export function buildTemplateCsv(services: Service[]) {
  const lines = [TEMPLATE_HEADERS.join(',')];
  for (const service of services) {
    for (const sub of service.subServices) {
      lines.push(
        [
          service.name,
          service.domain,
          sub.name,
          sub.entitlement,
          sub.approvals.join(' > '),
          sub.fulfillmentType,
          sub.supportGroup,
          sub.supportNote ?? '',
          sub.sla.risk === 'none' ? 'No SLA' : sub.sla.label,
        ]
          .map((value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value))
          .join(','),
      );
    }
  }
  return lines.join('\n');
}
