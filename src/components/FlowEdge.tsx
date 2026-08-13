import { EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from 'reactflow';
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
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
    offset: data?.dashed ? 54 : 18,
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
      {data?.label ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan max-w-[150px] rounded-full border px-2 py-[3px] text-center text-[9px] font-semibold leading-tight"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
