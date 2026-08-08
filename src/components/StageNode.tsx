import { motion } from 'framer-motion';
import { Handle, Position, type NodeProps } from 'reactflow';
import { stageIcon } from '../flow/icons';
import type { Chip, StageNodeData } from '../flow/types';

function chipStyle(tone: Chip['tone']) {
  if (tone === 'green') {
    return { background: 'var(--ok-soft)', color: 'var(--ok)', borderColor: 'var(--ok)' };
  }
  if (tone === 'red') {
    return {
      background: 'var(--danger-soft)',
      color: 'var(--danger)',
      borderColor: 'var(--danger)',
    };
  }
  return {
    background: 'var(--chip-bg)',
    color: 'var(--chip-text)',
    borderColor: 'var(--border)',
  };
}

export function StageNode({ data, selected }: NodeProps<StageNodeData>) {
  const Icon = stageIcon(data);
  const isSla = data.kind === 'sla';
  const slaMissing = data.slaRisk === 'none';

  const accentBar = isSla
    ? slaMissing
      ? 'var(--danger)'
      : 'var(--ok)'
    : data.emphasis
      ? 'var(--accent)'
      : 'transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />

      <div
        className="relative w-[200px] overflow-hidden rounded-lg px-3.5 py-3 transition-shadow duration-200"
        style={{
          background: data.muted ? 'var(--surface-muted)' : 'var(--surface)',
          border: `1px solid ${
            selected || data.emphasis ? 'var(--border-strong)' : 'var(--border)'
          }`,
          borderStyle: data.muted ? 'dashed' : 'solid',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <span
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: accentBar }}
        />

        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{
              background: data.muted ? 'var(--chip-bg)' : 'var(--accent-soft)',
              color: data.muted ? 'var(--text-subtle)' : 'var(--accent)',
            }}
          >
            <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
          </span>

          <div className="min-w-0">
            {data.subtitle ? (
              <div
                className="text-[9.5px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: 'var(--text-subtle)' }}
              >
                {data.subtitle}
              </div>
            ) : null}
            <div
              className="mt-0.5 text-[12.5px] font-semibold leading-snug"
              style={{ color: data.muted ? 'var(--text-muted)' : 'var(--text)' }}
            >
              {data.title}
            </div>
          </div>
        </div>

        {data.chips?.length ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {data.chips.map((chip) => (
              <span
                key={chip.label}
                className="rounded border px-1.5 py-[2px] text-[9.5px] font-medium leading-none"
                style={chipStyle(chip.tone)}
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
