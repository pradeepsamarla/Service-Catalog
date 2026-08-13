import { MarkerType, type Edge, type Node } from 'reactflow';
import type {
  ColumnHeaderData,
  FlowEdgeData,
  PhaseBandData,
  StageNodeData,
  SubService,
} from './types';

export const CARD_W = 216;
const CARD_MIN_H = 96;
const COL_GAP = 72;
const ROW_GAP = 26;
const TITLE_CHARS = 24;
const SUBTITLE_CHARS = 30;
const META_CHARS = 26;
const DECISION_W = 128;
const X0 = 28;
const HEADER_Y = 66;
const CARD_TOP = 118;
const BAND_TOP = 16;

type Column = {
  label: string;
  phase: PhaseBandData['accent'];
  nodes: Array<{ id: string; data: StageNodeData }>;
};

type Placed = {
  id: string;
  data: StageNodeData;
  height: number;
  y: number;
};

function lines(text: string | undefined, perLine: number) {
  if (!text) {
    return 0;
  }
  return Math.max(1, Math.ceil(text.length / perLine));
}

function cardHeight(data: StageNodeData) {
  if (data.kind === 'decision') {
    return Math.max(DECISION_W, 40 + lines(data.title, 22) * 14);
  }
  const content =
    24 +
    lines(data.subtitle, SUBTITLE_CHARS) * 13 +
    lines(data.title, TITLE_CHARS) * 17 +
    (data.meta?.reduce((total, entry) => total + lines(entry.value, META_CHARS) * 13 + 11, 0) ??
      0) +
    (data.meta?.length ? 8 : 0) +
    (data.chips?.length ? 26 : 0);
  return Math.max(CARD_MIN_H, content);
}

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
          meta: [
            ...(sub.ownerName ? [{ label: 'Owner', value: sub.ownerName }] : []),
            ...(sub.ownerEmail ? [{ label: 'Email', value: sub.ownerEmail }] : []),
          ],
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

  if (parallel.length > 1) {
    const conditions = parallel
      .map((assignment) => assignment.condition)
      .filter((value): value is string => Boolean(value));
    columns.push({
      label: 'Split condition',
      phase: 'fulfillment',
      nodes: [
        {
          id: 'split',
          data: {
            kind: 'decision',
            title: conditions.length === 1 ? conditions[0] : 'Create all branches',
            subtitle: `${parallel.length} parallel branches`,
          },
        },
      ],
    });
  }

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
          meta: assignment.condition
            ? [{ label: 'Condition', value: assignment.condition }]
            : undefined,
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

  const columnHeights = columns.map((column) =>
    column.nodes.reduce(
      (total, entry, row) => total + cardHeight(entry.data) + (row ? ROW_GAP : 0),
      0,
    ),
  );
  const gridHeight = Math.max(...columnHeights);
  const centerY = CARD_TOP + gridHeight / 2;
  const bandHeight = gridHeight + (CARD_TOP - BAND_TOP) + 24;

  const columnX = columns.map((_, index) => X0 + index * (CARD_W + COL_GAP));

  const branchLabels = new Map<string, string>();
  sub.assignments
    .filter((assignment) => assignment.executionMode !== 'SEQUENCE')
    .forEach((assignment, index) => {
      if (assignment.condition) {
        branchLabels.set(`par-${index}`, assignment.condition);
      }
    });

  const placed = new Map<string, Placed>();
  columns.forEach((column, index) => {
    let y = centerY - columnHeights[index] / 2;
    column.nodes.forEach((entry) => {
      const height = cardHeight(entry.data);
      placed.set(entry.id, { id: entry.id, data: entry.data, height, y });
      y += height + ROW_GAP;
    });
  });

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

    column.nodes.forEach((entry) => {
      const box = placed.get(entry.id);
      if (!box) {
        return;
      }
      const isDecision = entry.data.kind === 'decision';
      nodes.push({
        id: entry.id,
        type: isDecision ? 'decision' : 'stage',
        position: {
          x: isDecision ? columnX[index] + (CARD_W - DECISION_W) / 2 : columnX[index],
          y: box.y,
        },
        style: { width: isDecision ? DECISION_W : CARD_W, height: box.height },
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
      const branchLabel = source === 'split' ? branchLabels.get(target) : undefined;
      edges.push({
        id: `e-${source}-${target}`,
        source,
        sourceHandle: 'r',
        target,
        targetHandle: 'l',
        type: 'flow',
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        data: {
          label: branchLabel,
          muted:
            columns[index].nodes.some((entry) => entry.id === source && entry.data.muted) ||
            columns[index + 1].nodes.some((entry) => entry.id === target && entry.data.muted),
        },
      });
    }
  }

  return { nodes, edges };
}
