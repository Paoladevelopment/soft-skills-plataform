import { Box, Typography } from '@mui/material'
import { NodeProps, Position, useStore } from 'reactflow'
import CustomHandle from './CustomHandle'

interface TaskNodeData {
  title: string
}

const TaskNode = ({ id, data }: NodeProps<TaskNodeData>) => {
  const nodeInternals = useStore((store) => store.nodeInternals)
  const edges = useStore((store) => store.edges)

  const node = nodeInternals.get(id)
  const nodePosition = node?.position

  const parentEdge = Array.from(edges.values()).find((edge) => edge.target === id)
  const parentNode = parentEdge ? nodeInternals.get(parentEdge.source) : undefined

  const closestObjective = !parentNode
    ? Array.from(nodeInternals.values())
        .filter((n) => n.type === 'objectiveNode')
        .reduce((closest, n) => {
          if (!n.position || !nodePosition) return closest
          const distance = Math.abs(n.position.x - nodePosition.x)
          if (!closest || distance < Math.abs(closest.position.x - nodePosition.x)) {
            return n
          }
          return closest
        }, undefined as typeof node | undefined)
    : undefined

  const referenceNode = parentNode ?? closestObjective

  const isLeftSide = referenceNode 
    ? (nodePosition?.x ?? 0) < (referenceNode.position.x ?? 0) 
    : true

  return (
    <Box
      sx={{
        borderRadius: "8px",
        padding: "8px 16px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        width: 250,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        position: 'relative',
      }}
    >
      <CustomHandle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          opacity: isLeftSide ? 0 : 1,
          pointerEvents: 'auto',
          background: "#ccc",
          width: 8,
          height: 8,
        }}
      />
      <CustomHandle
        type="target"
        position={Position.Right}
        id="right"
        style={{
          opacity: isLeftSide ? 1 : 0,
          pointerEvents: 'auto',
          background: "#ccc",
          width: 8,
          height: 8,
        }}
      />

      <Typography
        variant="subtitle2"
        sx={{
          flexGrow: 1,
          textAlign: "center",
        }}
      >
        {data.title}
      </Typography>
    </Box>
  )
}

export default TaskNode



