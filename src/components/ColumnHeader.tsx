import type { NodeProps } from 'reactflow';
import type { ColumnHeaderData } from '../flow/types';

export function ColumnHeader({ data }: NodeProps<ColumnHeaderData>) {
  return (
    <div
      className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: 'var(--text-muted)' }}
    >
      {data.label}
    </div>
  );
}
