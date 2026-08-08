import { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
} from 'reactflow';
import { dividerNode, flowEdges, laneNodes, stageNodes } from '../flow/sampleService';
import { GlowEdge } from './GlowEdge';
import { LaneNode } from './LaneNode';
import { StageNode } from './StageNode';

function LaneDivider() {
  return (
    <div className="h-px w-full border-t border-dashed border-white/[0.14]" />
  );
}

const nodeTypes = { stage: StageNode, lane: LaneNode, divider: LaneDivider };
const edgeTypes = { glow: GlowEdge };

function minimapNodeColor(node: Node) {
  if (node.type === 'stage') {
    return 'rgba(148,180,255,0.55)';
  }
  return 'rgba(139,92,246,0.12)';
}

export function FlowCanvas() {
  const nodes = useMemo<Node[]>(() => [...laneNodes, dividerNode, ...stageNodes], []);
  const edges = useMemo<Edge[]>(() => flowEdges, []);

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      minZoom={0.3}
      maxZoom={1.8}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={36}
        size={1}
        color="rgba(255,255,255,0.05)"
      />
      <MiniMap
        pannable
        zoomable
        nodeColor={minimapNodeColor}
        nodeStrokeWidth={0}
        maskColor="rgba(10,10,18,0.78)"
        style={{ background: 'rgba(14,14,24,0.9)' }}
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
