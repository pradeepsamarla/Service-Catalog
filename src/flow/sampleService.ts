import type { Edge, Node } from 'reactflow';
import type { GlowEdgeData, LaneNodeData, StageNodeData } from './types';

export const sampleService = {
  name: 'Employee Onboarding Request',
  parentService: 'HR Services',
};

export const LANE_WIDTH = 1460;

export const laneNodes: Node<LaneNodeData>[] = [
  {
    id: 'lane-intake',
    type: 'lane',
    position: { x: 0, y: 0 },
    data: { label: 'Intake', accent: 'violet' },
    style: { width: LANE_WIDTH, height: 300 },
    draggable: false,
    selectable: false,
    connectable: false,
    zIndex: -1,
  },
  {
    id: 'lane-fulfillment',
    type: 'lane',
    position: { x: 0, y: 360 },
    data: { label: 'Fulfillment', accent: 'teal' },
    style: { width: LANE_WIDTH, height: 320 },
    draggable: false,
    selectable: false,
    connectable: false,
    zIndex: -1,
  },
];

export const dividerNode: Node = {
  id: 'lane-divider',
  type: 'divider',
  position: { x: 0, y: 330 },
  data: {},
  style: { width: LANE_WIDTH, height: 1 },
  draggable: false,
  selectable: false,
  connectable: false,
  zIndex: -1,
};

export const stageNodes: Node<StageNodeData>[] = [
  {
    id: 'subservice',
    type: 'stage',
    position: { x: 120, y: 80 },
    data: {
      kind: 'subservice',
      title: 'Onboarding Request',
      subtitle: 'Sub-service',
    },
  },
  {
    id: 'entitlement',
    type: 'stage',
    position: { x: 500, y: 80 },
    data: {
      kind: 'entitlement',
      title: 'All DEWA Users',
      subtitle: 'Entitlement',
    },
  },
  {
    id: 'approval',
    type: 'stage',
    position: { x: 880, y: 62 },
    data: {
      kind: 'approval',
      title: 'Approval Flow',
      subtitle: '2 levels',
      chips: [{ label: '① Direct Manager' }, { label: '② HR Head' }],
    },
  },
  {
    id: 'fulfillment',
    type: 'stage',
    position: { x: 300, y: 450 },
    data: {
      kind: 'fulfillment',
      title: 'Work Order',
      subtitle: 'Fulfillment type',
      chips: [{ label: 'WO' }],
    },
  },
  {
    id: 'support-group',
    type: 'stage',
    position: { x: 680, y: 450 },
    data: {
      kind: 'supportGroup',
      title: 'HR-Ops',
      subtitle: 'Support group',
    },
  },
  {
    id: 'sla',
    type: 'stage',
    position: { x: 1060, y: 450 },
    data: {
      kind: 'sla',
      title: 'SLA · 3 WD',
      subtitle: 'Target',
      slaRisk: 'timed',
      chips: [{ label: '3 working days', tone: 'green' }],
    },
  },
];

export const flowEdges: Edge<GlowEdgeData>[] = [
  {
    id: 'e-sub-ent',
    source: 'subservice',
    sourceHandle: 'r',
    target: 'entitlement',
    targetHandle: 'l',
    type: 'glow',
    data: {},
  },
  {
    id: 'e-ent-appr',
    source: 'entitlement',
    sourceHandle: 'r',
    target: 'approval',
    targetHandle: 'l',
    type: 'glow',
    data: {},
  },
  {
    id: 'e-appr-ful',
    source: 'approval',
    sourceHandle: 'b',
    target: 'fulfillment',
    targetHandle: 't',
    type: 'glow',
    data: { hero: true },
  },
  {
    id: 'e-ful-sup',
    source: 'fulfillment',
    sourceHandle: 'r',
    target: 'support-group',
    targetHandle: 'l',
    type: 'glow',
    data: {},
  },
  {
    id: 'e-sup-sla',
    source: 'support-group',
    sourceHandle: 'r',
    target: 'sla',
    targetHandle: 'l',
    type: 'glow',
    data: {},
  },
];
