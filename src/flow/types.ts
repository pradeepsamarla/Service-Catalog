export type StageKind =
  | 'service'
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
  muted?: boolean;
  emphasis?: boolean;
  icon?: 'workOrder' | 'serviceRequest';
};

export type PhaseBandData = {
  label: string;
  accent: 'request' | 'intake' | 'fulfillment';
};

export type RowStripeData = {
  index: number;
};

export type ColumnHeaderData = {
  label: string;
  step?: number;
};

export type FlowEdgeData = {
  hero?: boolean;
  muted?: boolean;
  label?: string;
};

export type SubService = {
  id: string;
  name: string;
  requestType: string;
  entitlement: string;
  entitlementNote?: string;
  approvals: string[];
  fulfillmentType: string;
  fulfillmentCode: string;
  supportGroup: string;
  supportNote?: string;
  sla: { label: string; risk: SlaRisk };
};

export type Service = {
  name: string;
  domain: string;
  subServices: SubService[];
};
