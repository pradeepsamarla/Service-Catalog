import { getBezierPath, type EdgeProps } from 'reactflow';
import type { GlowEdgeData } from '../flow/types';

export function GlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<GlowEdgeData>) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const hero = Boolean(data?.hero);
  const gradientId = `glow-gradient-${id}`;
  const blurId = `glow-blur-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="55%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={hero ? 6 : 3.5} />
        </filter>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={hero ? 10 : 6}
        strokeOpacity={hero ? 0.55 : 0.35}
        strokeLinecap="round"
        filter={`url(#${blurId})`}
      />
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={hero ? 3 : 1.6}
        strokeOpacity={0.85}
        strokeLinecap="round"
      />
      <path
        className="edge-flow"
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth={hero ? 2.2 : 1.4}
        strokeOpacity={hero ? 0.9 : 0.55}
        strokeLinecap="round"
      />
    </>
  );
}
