import { motion } from 'framer-motion';
import {
  BadgeCheck,
  ClipboardList,
  Clock,
  Layers,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { Chip, StageKind, StageNodeData } from '../flow/types';

const ICONS: Record<StageKind, LucideIcon> = {
  subservice: Layers,
  entitlement: ShieldCheck,
  approval: BadgeCheck,
  fulfillment: ClipboardList,
  supportGroup: Users,
  sla: Clock,
};

const ACCENTS: Record<StageKind, string> = {
  subservice: 'from-violet-400/80 to-fuchsia-400/60',
  entitlement: 'from-sky-400/80 to-indigo-400/60',
  approval: 'from-violet-400/80 to-sky-400/60',
  fulfillment: 'from-teal-300/80 to-sky-400/60',
  supportGroup: 'from-cyan-300/80 to-teal-400/60',
  sla: 'from-emerald-300/80 to-teal-400/60',
};

function chipClasses(tone: Chip['tone']) {
  if (tone === 'green') {
    return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200';
  }
  if (tone === 'red') {
    return 'border-red-300/30 bg-red-400/10 text-red-200';
  }
  return 'border-white/10 bg-white/[0.06] text-slate-300';
}

export function StageNode({ data, selected }: NodeProps<StageNodeData>) {
  const Icon = ICONS[data.kind];
  const isSla = data.kind === 'sla';
  const slaTimed = data.slaRisk !== 'none';

  const glow = isSla
    ? slaTimed
      ? 'shadow-glow-green group-hover:shadow-glow-green'
      : 'shadow-glow-red group-hover:shadow-glow-red'
    : 'shadow-glow group-hover:shadow-glow-strong';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.035 }}
      className="group"
    >
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />

      <div
        className={`relative w-[220px] rounded-2xl border border-hairline bg-glass px-5 py-4 backdrop-blur-[18px] transition-shadow duration-300 ${glow} ${
          selected ? 'ring-1 ring-white/25' : ''
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 45%)',
          }}
        />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${ACCENTS[data.kind]} bg-opacity-20`}
          >
            <Icon className="h-5 w-5 text-white/90" strokeWidth={1.5} />
          </div>

          <div>
            <div className="text-[13px] font-semibold tracking-wide text-white">
              {data.title}
            </div>
            {data.subtitle ? (
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                {data.subtitle}
              </div>
            ) : null}
          </div>

          {data.chips?.length ? (
            <div className="flex flex-wrap justify-center gap-1.5">
              {data.chips.map((chip) => (
                <span
                  key={chip.label}
                  className={`rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${chipClasses(chip.tone)}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
