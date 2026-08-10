import { MarkerType, type Edge, type Node } from 'reactflow';
import type {
  ColumnHeaderData,
  FlowEdgeData,
  PhaseBandData,
  StageNodeData,
  SubService,
} from './types';

export const CARD_W = 216;
const CARD_H = 96;
const COL_GAP = 72;
const ROW_GAP = 26;
const X0 = 28;
const HEADER_Y = 66;
const CARD_TOP = 118;
const BAND_TOP = 16;

type Column = {
  label: string;
  phase: PhaseBandData['accent'];
  nodes: Array<{ id: string; data: StageNodeData }>;
};

type Layout = {
  nodes: Node[];
  edges: Edge<FlowEdgeData>[];
};

function buildColumns(sub: SubService): Column[] {
  const columns: Column[] = [];

  columns.push({
    label: sub.requestType,
    phase: 'request',
    nodes: [
      {
        id: 'request',
        data: {
          kind: 'request',
          subtitle: 'Parent request',
          title: sub.name,
          chips: [{ label: sub.id }],
          emphasis: true,
        },
      },
    ],
  });

  columns.push({
    label: 'Entitlement',
    phase: 'intake',
    nodes: sub.entitlements.length
      ? sub.entitlements.map((entitlement, index) => ({
          id: `ent-${index}`,
          data: {
            kind: 'entitlement',
            subtitle: entitlement.note ?? 'Entitled requesters',
            title: entitlement.entitlement,
          } satisfies StageNodeData,
        }))
      : [
          {
            id: 'ent-none',
            data: {
              kind: 'entitlement',
              subtitle: 'No restriction',
              title: 'All requesters',
              muted: true,
            },
          },
        ],
  });

  if (sub.approvals.length) {
    sub.approvals.forEach((approval, index) => {
      columns.push({
        label: `Approval L${approval.level}`,
        phase: 'intake',
        nodes: [
          {
            id: `appr-${index}`,
            data: {
              kind: 'approval',
              subtitle: approval.approverType,
              title: approval.approver,
              chips: [{ label: `Level ${approval.level}` }],
            },
          },
        ],
      });
    });
  } else {
    columns.push({
      label: 'Approval',
      phase: 'intake',
      nodes: [
        {
          id: 'appr-none',
          data: {
            kind: 'approval',
            subtitle: 'No approval',
            title: 'Auto-approved',
            muted: true,
          },
        },
      ],
    });
  }

  const sequential = sub.assignments.filter((item) => item.executionMode === 'SEQUENCE');
  const parallel = sub.assignments.filter((item) => item.executionMode !== 'SEQUENCE');

  if (parallel.length) {
    columns.push({
      label: parallel.length > 1 ? 'Child tickets · parallel' : 'Child ticket',
      phase: 'fulfillment',
      nodes: parallel.map((assignment, index) => ({
        id: `par-${index}`,
        data: {
          kind: 'ticket',
          subtitle: assignment.ticketType,
          title: assignment.supportGroup,
          ticketType: assignment.ticketType,
          chips: [
            { label: [assignment.tier, assignment.coverage].filter(Boolean).join(' · ') || 'Support group' },
          ],
        } satisfies StageNodeData,
      })),
    });
  }

  sequential.forEach((assignment, index) => {
    columns.push({
      label: `Child ticket · step ${index + 1}`,
      phase: 'fulfillment',
      nodes: [
        {
          id: `seq-${index}`,
          data: {
            kind: 'ticket',
            subtitle: assignment.ticketType,
            title: assignment.supportGroup,
            ticketType: assignment.ticketType,
            chips: [
              {
                label:
                  [assignment.tier, assignment.coverage].filter(Boolean).join(' · ') ||
                  'Support group',
              },
            ],
          },
        },
      ],
    });
  });

  if (!sub.assignments.length) {
    columns.push({
      label: 'Child ticket',
      phase: 'fulfillment',
      nodes: [
        {
          id: 'tkt-none',
          data: {
            kind: 'ticket',
            subtitle: 'No assignment',
            title: 'Unassigned',
            muted: true,
          },
        },
      ],
    });
  }

  columns.push({
    label: 'SLA',
    phase: 'fulfillment',
    nodes: [
      {
        id: 'sla',
        data: {
          kind: 'sla',
          subtitle: 'Resolution target',
          title: sub.sla.label,
          slaRisk: sub.sla.risk,
          chips: [
            sub.sla.risk === 'none'
              ? { label: 'At risk', tone: 'red' as const }
              : { label: 'SLA tracked', tone: 'green' as const },
          ],
        },
      },
    ],
  });

  return columns;
}

export function buildLayout(sub: SubService): Layout {
  const columns = buildColumns(sub);
  const nodes: Node[] = [];
  const edges: Edge<FlowEdgeData>[] = [];

  const tallest = Math.max(...columns.map((column) => column.nodes.length));
  const gridHeight = tallest * CARD_H + (tallest - 1) * ROW_GAP;
  const centerY = CARD_TOP + gridHeight / 2;
  const bandHeight = gridHeight + (CARD_TOP - BAND_TOP) + 24;

  const columnX = columns.map((_, index) => X0 + index * (CARD_W + COL_GAP));

  let bandStart = 0;
  columns.forEach((column, index) => {
    const isLast = index === columns.length - 1;
    const next = columns[index + 1];
    if (isLast || next.phase !== column.phase) {
      const x = columnX[bandStart] - 22;
      const width = columnX[index] + CARD_W + 22 - x;
      nodes.push({
        id: `band-${column.phase}-${bandStart}`,
        type: 'phaseBand',
        position: { x, y: BAND_TOP },
        data: {
          label:
            column.phase === 'request'
              ? 'Request'
              : column.phase === 'intake'
                ? 'Intake · qualification'
                : 'Fulfillment · resolution',
          accent: column.phase,
        } satisfies PhaseBandData,
        style: { width, height: bandHeight },
        draggable: false,
        selectable: false,
        connectable: false,
        zIndex: -3,
      });
      bandStart = index + 1;
    }
  });

  columns.forEach((column, index) => {
    nodes.push({
      id: `col-${index}`,
      type: 'columnHeader',
      position: { x: columnX[index], y: HEADER_Y },
      data: { label: column.label, step: index + 1 } satisfies ColumnHeaderData,
      style: { width: CARD_W },
      draggable: false,
      selectable: false,
      connectable: false,
      zIndex: -2,
    });

    const count = column.nodes.length;
    const columnHeight = count * CARD_H + (count - 1) * ROW_GAP;
    const top = centerY - columnHeight / 2;

    column.nodes.forEach((entry, row) => {
      nodes.push({
        id: entry.id,
        type: 'stage',
        position: { x: columnX[index], y: top + row * (CARD_H + ROW_GAP) },
        data: entry.data,
      });
    });
  });

  for (let index = 0; index < columns.length - 1; index += 1) {
    const from = columns[index].nodes;
    const to = columns[index + 1].nodes;
    const pairs: Array<[string, string]> = [];

    if (from.length === 1 || to.length === 1) {
      for (const source of from) {
        for (const target of to) {
          pairs.push([source.id, target.id]);
        }
      }
    } else {
      const length = Math.max(from.length, to.length);
      for (let i = 0; i < length; i += 1) {
        pairs.push([
          from[Math.min(i, from.length - 1)].id,
          to[Math.min(i, to.length - 1)].id,
        ]);
      }
    }

    for (const [source, target] of pairs) {
      edges.push({
        id: `e-${source}-${target}`,
        source,
        sourceHandle: 'r',
        target,
        targetHandle: 'l',
        type: 'flow',
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        data: {
          muted:
            columns[index].nodes.some((entry) => entry.id === source && entry.data.muted) ||
            columns[index + 1].nodes.some((entry) => entry.id === target && entry.data.muted),
        },
      });
    }
  }

  return { nodes, edges };
}
