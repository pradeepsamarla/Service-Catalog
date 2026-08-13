export type StageKind =
  | 'request'
  | 'entitlement'
  | 'approval'
  | 'ticket'
  | 'sla'
  | 'decision';

export type SlaRisk = 'timed' | 'none';

export type ExecutionMode = 'PARALLEL' | 'SEQUENCE';

export type Chip = {
  label: string;
  tone?: 'default' | 'green' | 'red';
};

export type MetaEntry = {
  label: string;
  value: string;
};

export type StageNodeData = {
  kind: StageKind;
  title: string;
  subtitle?: string;
  meta?: MetaEntry[];
  chips?: Chip[];
  slaRisk?: SlaRisk;
  muted?: boolean;
  emphasis?: boolean;
  ticketType?: string;
};

export type PhaseBandData = {
  label: string;
  accent: 'request' | 'intake' | 'fulfillment';
};

export type ColumnHeaderData = {
  label: string;
  step?: number;
};

export type FlowEdgeData = {
  muted?: boolean;
  hero?: boolean;
  label?: string;
  dashed?: boolean;
};

export type Entitlement = {
  id: string;
  entitlement: string;
  note?: string;
};

export type ApprovalStep = {
  level: number;
  approverType: string;
  approver: string;
};

export type Assignment = {
  seq: number;
  supportGroup: string;
  ticketType: string;
  executionMode: ExecutionMode;
  condition?: string;
  tier?: string;
  coverage?: string;
};

export type Sla = {
  target: number | null;
  unit: string;
  label: string;
  risk: SlaRisk;
};

export type SubService = {
  id: string;
  name: string;
  requestType: string;
  active: boolean;
  ownerName?: string;
  ownerEmail?: string;
  entitlements: Entitlement[];
  approvals: ApprovalStep[];
  assignments: Assignment[];
  sla: Sla;
  attributes: Array<{ key: string; value: string }>;
};

export type Service = {
  id: string;
  name: string;
  domain: string;
  ownerName?: string;
  ownerPrId?: string;
  ownerEmail?: string;
  description?: string;
  subServices: SubService[];
};
