import type { NodeProps } from 'reactflow';
import type { LaneNodeData } from '../flow/types';

const ACCENT_BG: Record<LaneNodeData['accent'], string> = {
  violet:
    'linear-gradient(90deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 55%, rgba(139,92,246,0) 100%)',
  teal: 'linear-gradient(90deg, rgba(45,212,191,0.12) 0%, rgba(45,212,191,0.03) 55%, rgba(45,212,191,0) 100%)',
};

const ACCENT_TEXT: Record<LaneNodeData['accent'], string> = {
  violet: 'text-violet-200/70',
  teal: 'text-teal-200/70',
};

export function LaneNode({ data }: NodeProps<LaneNodeData>) {
  return (
    <div className="relative h-full w-full rounded-3xl border border-white/[0.06]">
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ background: ACCENT_BG[data.accent] }}
      />
      <div
        className={`absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-semibold uppercase tracking-[0.42em] ${ACCENT_TEXT[data.accent]}`}
      >
        {data.label}
      </div>
    </div>
  );
}
