import ReactFlow, {
  Background,
  Controls,
} from "reactflow"
import "reactflow/dist/style.css"


import { nodeTypes } from "../../types/roadmap/roadmap.nodetypes"
import { useRoadmapStore } from "../../store/useRoadmapStore"

const RoadmapFlow = () => {
  const { editorNodes, editorEdges } = useRoadmapStore()

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={editorNodes}
        edges={editorEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default RoadmapFlow