import { MarkerType, type Edge, type Node } from 'reactflow';
import type {
  ColumnHeaderData,
  FlowEdgeData,
  PhaseBandData,
  RowStripeData,
  Service,
  StageNodeData,
} from './types';

export const CARD_W = 200;
const COL_X = [24, 292, 560, 828, 1096, 1364, 1632];
const CANVAS_W = COL_X[6] + CARD_W + 24;

const ROW_TOP = 116;
const ROW_H = 168;
const CARD_OFFSET_Y = 24;
const HEADER_Y = 74;
const BAND_TOP = 16;

const COLUMNS = [
  'Service',
  'Sub-service',
  'Entitlement',
  'Approval flow',
  'Fulfillment',
  'Support group',
  'SLA',
];

const ordinals = ['1', '2', '3', '4', '5', '6'];

type Layout = {
  nodes: Node[];
  edges: Edge<FlowEdgeData>[];
};

export function buildLayout(service: Service): Layout {
  const rows = service.subServices.length;
  const gridHeight = rows * ROW_H;
  const bandHeight = ROW_TOP - BAND_TOP + gridHeight + 8;

  const nodes: Node[] = [];
  const edges: Edge<FlowEdgeData>[] = [];

  const bands: Array<{
    id: string;
    from: number;
    to: number;
    label: string;
    accent: PhaseBandData['accent'];
  }> = [
    { id: 'band-request', from: 1, to: 1, label: 'Request', accent: 'request' },
    { id: 'band-intake', from: 2, to: 3, label: 'Intake · qualification', accent: 'intake' },
    {
      id: 'band-fulfillment',
      from: 4,
      to: 6,
      label: 'Fulfillment · resolution',
      accent: 'fulfillment',
    },
  ];

  for (const band of bands) {
    const x = COL_X[band.from] - 22;
    const width = COL_X[band.to] + CARD_W + 22 - x;
    nodes.push({
      id: band.id,
      type: 'phaseBand',
      position: { x, y: BAND_TOP },
      data: { label: band.label, accent: band.accent } satisfies PhaseBandData,
      style: { width, height: bandHeight },
      draggable: false,
      selectable: false,
      connectable: false,
      zIndex: -3,
    });
  }

  COLUMNS.forEach((label, index) => {
    nodes.push({
      id: `col-${index}`,
      type: 'columnHeader',
      position: { x: COL_X[index], y: HEADER_Y },
      data: { label } satisfies ColumnHeaderData,
      style: { width: CARD_W },
      draggable: false,
      selectable: false,
      connectable: false,
      zIndex: -2,
    });
  });

  service.subServices.forEach((_, index) => {
    nodes.push({
      id: `row-${index}`,
      type: 'rowStripe',
      position: { x: COL_X[1] - 22, y: ROW_TOP + index * ROW_H - 6 },
      data: { index } satisfies RowStripeData,
      style: { width: CANVAS_W - COL_X[1] + 22 - 24, height: ROW_H - 8 },
      draggable: false,
      selectable: false,
      connectable: false,
      zIndex: -2,
    });
  });

  nodes.push({
    id: 'service',
    type: 'stage',
    position: { x: COL_X[0], y: ROW_TOP + gridHeight / 2 - 64 },
    data: {
      kind: 'service',
      title: service.name,
      subtitle: 'Parent service',
      chips: [
        { label: service.domain },
        { label: `${rows} sub-service${rows > 1 ? 's' : ''}` },
      ],
      emphasis: true,
    } satisfies StageNodeData,
  });

  service.subServices.forEach((sub, index) => {
    const y = ROW_TOP + index * ROW_H + CARD_OFFSET_Y;
    const hasApproval = sub.approvals.length > 0;

    const stages: Array<{ id: string; column: number; data: StageNodeData }> = [
      {
        id: `${sub.id}-sub`,
        column: 1,
        data: {
          kind: 'subservice',
          title: sub.name,
          subtitle: sub.requestType,
        },
      },
      {
        id: `${sub.id}-ent`,
        column: 2,
        data: {
          kind: 'entitlement',
          title: sub.entitlement,
          subtitle: sub.entitlementNote ?? 'Entitled requesters',
        },
      },
      {
        id: `${sub.id}-appr`,
        column: 3,
        data: hasApproval
          ? {
              kind: 'approval',
              subtitle: 'Approval flow',
              title: `${sub.approvals.length} level${sub.approvals.length > 1 ? 's' : ''}`,
              chips: sub.approvals.map((approver, level) => ({
                label: `${ordinals[level]}. ${approver}`,
              })),
            }
          : {
              kind: 'approval',
              subtitle: 'No approval',
              title: 'Auto-approved',
              muted: true,
            },
      },
      {
        id: `${sub.id}-ful`,
        column: 4,
        data: {
          kind: 'fulfillment',
          subtitle: 'Fulfillment type',
          title: sub.fulfillmentType,
          chips: [{ label: sub.fulfillmentCode }],
          icon: /work order/i.test(sub.fulfillmentType) ? 'workOrder' : 'serviceRequest',
        },
      },
      {
        id: `${sub.id}-sup`,
        column: 5,
        data: {
          kind: 'supportGroup',
          subtitle: sub.supportNote ?? 'Support group',
          title: sub.supportGroup,
        },
      },
      {
        id: `${sub.id}-sla`,
        column: 6,
        data: {
          kind: 'sla',
          subtitle: 'Resolution target',
          title: sub.sla.risk === 'none' ? 'No SLA defined' : sub.sla.label,
          slaRisk: sub.sla.risk,
          chips: [
            sub.sla.risk === 'none'
              ? { label: 'At risk', tone: 'red' as const }
              : { label: 'SLA tracked', tone: 'green' as const },
          ],
        },
      },
    ];

    for (const stage of stages) {
      nodes.push({
        id: stage.id,
        type: 'stage',
        position: { x: COL_X[stage.column], y },
        data: stage.data,
      });
    }

    edges.push({
      id: `e-service-${sub.id}`,
      source: 'service',
      sourceHandle: 'r',
      target: `${sub.id}-sub`,
      targetHandle: 'l',
      type: 'flow',
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
      data: {},
    });

    for (let i = 0; i < stages.length - 1; i += 1) {
      const from = stages[i];
      const to = stages[i + 1];
      edges.push({
        id: `e-${from.id}-${to.id}`,
        source: from.id,
        sourceHandle: 'r',
        target: to.id,
        targetHandle: 'l',
        type: 'flow',
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        data: { muted: Boolean(from.data.muted || to.data.muted) },
      });
    }
  });

  nodes.push({
    id: 'spacer',
    type: 'spacer',
    position: { x: CANVAS_W - 8, y: ROW_TOP + gridHeight - 12 },
    data: {},
    style: { width: 180, height: 120 },
    draggable: false,
    selectable: false,
    connectable: false,
    zIndex: -4,
  });

  return { nodes, edges };
}
