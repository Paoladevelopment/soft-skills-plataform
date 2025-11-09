import ReactFlow, {
  Background,
  Controls,
  Node,
} from "reactflow"
import "reactflow/dist/style.css"
import { useCallback } from "react"

import { nodeTypes } from "../../types/roadmap/roadmap.nodetypes"
import { useRoadmapStore } from "../../store/useRoadmapStore"

interface RoadmapFlowProps {
  onNodeClick?: (nodeId: string) => void
  onPaneClick?: () => void
}

const RoadmapFlow = ({ onNodeClick, onPaneClick }: RoadmapFlowProps) => {
  const { editorNodes, editorEdges } = useRoadmapStore()

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id)
    }
  }, [onNodeClick])

  const handlePaneClick = useCallback(() => {
    if (onPaneClick) {
      onPaneClick()
    }
  }, [onPaneClick])

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={editorNodes}
        edges={editorEdges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default RoadmapFlow