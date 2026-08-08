import {
  BadgeCheck,
  Boxes,
  FileText,
  Headset,
  ShieldCheck,
  Stamp,
  Ticket,
  Timer,
  TimerOff,
  UserCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { StageNodeData } from './types';

export function stageIcon(data: StageNodeData): LucideIcon {
  switch (data.kind) {
    case 'service':
      return Boxes;
    case 'subservice':
      return FileText;
    case 'entitlement':
      return data.muted ? ShieldCheck : UserCheck;
    case 'approval':
      return data.muted ? BadgeCheck : Stamp;
    case 'fulfillment':
      return data.icon === 'workOrder' ? Wrench : Ticket;
    case 'supportGroup':
      return Headset;
    case 'sla':
      return data.slaRisk === 'none' ? TimerOff : Timer;
    default:
      return FileText;
  }
}
