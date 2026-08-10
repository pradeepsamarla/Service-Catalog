import type { NodeProps } from 'reactflow';
import type { ColumnHeaderData } from '../flow/types';

export function ColumnHeader({ data }: NodeProps<ColumnHeaderData>) {
  return (
    <div
      className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
      style={{ background: 'var(--col-header-bg)', color: 'var(--col-header-text)' }}
    >
      {data.step ? (
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold tracking-normal"
          style={{
            background: 'rgba(255,255,255,0.22)',
            color: 'var(--col-header-text)',
          }}
        >
          {data.step}
        </span>
      ) : null}
      {data.label}
    </div>
  );
}
