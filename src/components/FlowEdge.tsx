import { getSmoothStepPath, type EdgeProps } from 'reactflow';
import type { FlowEdgeData } from '../flow/types';

export function FlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<FlowEdgeData>) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
    offset: 18,
  });

  const hero = Boolean(data?.hero);
  const muted = Boolean(data?.muted);

  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={hero ? 'var(--edge-active)' : 'var(--edge)'}
        strokeWidth={hero ? 2 : 1.25}
        strokeOpacity={muted ? 0.4 : 1}
        strokeDasharray={muted ? '4 4' : undefined}
        markerEnd={markerEnd}
        shapeRendering="crispEdges"
      />
      {hero ? (
        <path
          className="edge-flow"
          d={path}
          fill="none"
          stroke="var(--edge-active)"
          strokeWidth={2.5}
          strokeOpacity={0.75}
        />
      ) : null}
    </>
  );
}
