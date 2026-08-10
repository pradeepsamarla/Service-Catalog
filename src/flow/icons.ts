import {
  AlertTriangle,
  BadgeCheck,
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
    case 'request':
      return FileText;
    case 'entitlement':
      return data.muted ? ShieldCheck : UserCheck;
    case 'approval':
      return data.muted ? BadgeCheck : Stamp;
    case 'ticket':
      if (data.muted) {
        return Headset;
      }
      if (data.ticketType === 'Incident') {
        return AlertTriangle;
      }
      return data.ticketType === 'Work Order' ? Wrench : Ticket;
    case 'sla':
      return data.slaRisk === 'none' ? TimerOff : Timer;
    default:
      return FileText;
  }
}
