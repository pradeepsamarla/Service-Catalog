export type StageKind =
  | 'subservice'
  | 'entitlement'
  | 'approval'
  | 'fulfillment'
  | 'supportGroup'
  | 'sla';

export type SlaRisk = 'timed' | 'none';

export type Chip = {
  label: string;
  tone?: 'default' | 'green' | 'red';
};

export type StageNodeData = {
  kind: StageKind;
  title: string;
  subtitle?: string;
  chips?: Chip[];
  slaRisk?: SlaRisk;
};

export type LaneNodeData = {
  label: string;
  accent: 'violet' | 'teal';
};

export type GlowEdgeData = {
  hero?: boolean;
};
