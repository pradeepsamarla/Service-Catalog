import { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { buildLayout } from '../flow/layout';
import type { SubService } from '../flow/types';
import { ColumnHeader } from './ColumnHeader';
import { DecisionNode } from './DecisionNode';
import { FlowEdge } from './FlowEdge';
import { Legend } from './Legend';
import { PhaseBand } from './PhaseBand';
import { StageNode } from './StageNode';

const nodeTypes = {
  stage: StageNode,
  decision: DecisionNode,
  phaseBand: PhaseBand,
  columnHeader: ColumnHeader,
};
const edgeTypes = { flow: FlowEdge };

function minimapNodeColor(node: Node) {
  if (node.type === 'stage' || node.type === 'decision') {
    return 'var(--text-subtle)';
  }
  if (node.type === 'phaseBand') {
    return 'var(--accent-soft)';
  }
  return 'transparent';
}

export function FlowCanvas({ subService }: { subService: SubService }) {
  const layout = useMemo(() => buildLayout(subService), [subService]);

  return (
    <ReactFlow
      key={subService.id}
      defaultNodes={layout.nodes}
      defaultEdges={layout.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.06 }}
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={28}
        size={1}
        color="var(--grid-dot)"
      />
      <MiniMap
        pannable
        zoomable
        nodeColor={minimapNodeColor}
        nodeStrokeWidth={0}
        maskColor="rgba(0,0,0,0.2)"
        style={{ background: 'var(--surface-raised)', width: 150, height: 96 }}
      />
      <Controls showInteractive={false} />
      <Panel position="bottom-center">
        <Legend />
      </Panel>
    </ReactFlow>
  );
}
