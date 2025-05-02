import { Box } from '@mui/material'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

import type { Edge, Node } from 'reactflow'
import Sidebar from './Sidebar'
import { nodeTypes } from '../../types/roadmap/roadmap.nodetypes'
import Topbar from './TopbarProps'

type RoadmapEditorProps = {
  nodes: Node[]
  edges: Edge[]
  title: string
  mode: 'new' | 'edit'
  roadmapId?: string
};

const RoadmapEditor = ({ nodes, edges, title, mode, roadmapId }: RoadmapEditorProps) => {
  console.log(nodes, edges, mode, roadmapId)
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Topbar title={title} />

      <Box display="flex" flexGrow={1} overflow="hidden">
        <Sidebar />

        <Box flexGrow={1} position="relative">
          <ReactFlow
            fitView
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  )
}

export default RoadmapEditor