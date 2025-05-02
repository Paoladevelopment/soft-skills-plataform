import { useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
} from "reactflow"
import "reactflow/dist/style.css"


import { Roadmap } from "../../types/roadmap/roadmap.models"
import { nodeTypes } from "../../types/roadmap/roadmap.nodetypes"
import { buildRoadmapLayout } from "../../utils/roadmap_layout_generator"

interface RoadmapProps {
  roadmap: Roadmap
}

const RoadmapFlow = ({ roadmap }: RoadmapProps) => {
  const { nodes: initialNodes, edges: initialEdges } = 
    useMemo(
      () => buildRoadmapLayout(roadmap), 
      [roadmap]
    )

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
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