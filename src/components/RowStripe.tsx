import type { NodeProps } from 'reactflow';
import type { RowStripeData } from '../flow/types';

export function RowStripe({ data }: NodeProps<RowStripeData>) {
  return (
    <div
      className="h-full w-full rounded-md"
      style={{
        background: data.index % 2 === 0 ? 'var(--row-stripe)' : 'transparent',
        borderTop: '1px solid var(--border)',
      }}
    />
  );
}
