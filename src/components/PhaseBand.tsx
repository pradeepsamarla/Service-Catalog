import type { NodeProps } from 'reactflow';
import type { PhaseBandData } from '../flow/types';

export function PhaseBand({ data }: NodeProps<PhaseBandData>) {
  return (
    <div
      className="relative h-full w-full rounded-md"
      style={{
        background: `var(--band-${data.accent})`,
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 flex justify-center border-b py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em]"
        style={{
          color: `var(--band-${data.accent}-text)`,
          borderColor: 'var(--border)',
        }}
      >
        {data.label}
      </div>
    </div>
  );
}
