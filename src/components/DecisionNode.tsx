import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { StageNodeData } from '../flow/types';

export function DecisionNode({ data }: NodeProps<StageNodeData>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />

      <div
        className="absolute inset-[14%] rotate-45 rounded-[12px]"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--accent)',
          boxShadow: 'var(--shadow-card)',
        }}
      />

      <div className="relative z-10 flex max-w-[80%] flex-col items-center gap-1 text-center">
        <GitBranch className="h-4 w-4" strokeWidth={2} style={{ color: 'var(--accent)' }} />
        <div
          className="break-words text-[10px] font-semibold leading-tight"
          style={{ color: 'var(--text)' }}
        >
          {data.title}
        </div>
        {data.subtitle ? (
          <div
            className="text-[8.5px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: 'var(--text-subtle)' }}
          >
            {data.subtitle}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
