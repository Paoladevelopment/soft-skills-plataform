import { Box, IconButton, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NodeProps, Position, useStore } from 'reactflow'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomHandle from './CustomHandle'
import { findClosestObjectiveNode } from '../../utils/roadmap/findClosestObjectiveNode'
import { useState } from 'react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { fontSizeMap } from '../../types/roadmap/roadmap.options'

interface TaskNodeData {
  title: string,
  isEditable?: boolean,
  backgroundColor?: string,
  width?: number,
  height?: number | 'auto',
  fontSize?: 'S' | 'M' | 'L' | 'XL'
}

const TaskNode = ({ id, data }: NodeProps<TaskNodeData>) => {
  const { t } = useTranslation('roadmap')
  const [hovered, setHovered] = useState(false)
  const removeTaskNode = useRoadmapStore((state) => state.removeTaskNode)

  const nodeInternals = useStore((store) => store.nodeInternals)
  const edges = useStore((store) => store.edges)

  const node = nodeInternals.get(id)
  const nodePosition = node?.position

  // Try to find a direct parent edge (i.e., which node this task is connected from)
  const parentEdge = Array.from(edges.values()).find((edge) => edge.target === id)

  const parentNode = parentEdge ? nodeInternals.get(parentEdge.source) : undefined

  // If there's no parent node (maybe it's disconnected), find the closest objective by x-axis
  const closestObjective = !parentNode ? findClosestObjectiveNode(nodeInternals, nodePosition) : undefined

  const referenceNode = parentNode ?? closestObjective

  const isLeftSide = referenceNode 
    ? (nodePosition?.x ?? 0) < (referenceNode.position.x ?? 0) 
    : true

  const shouldShowDeleteAction = data.isEditable && hovered

  const bgColor = data.backgroundColor ?? '#FFFFFF'
  const width = data.width ?? 250
  const height = data.height ?? 'auto'
  const fontSize = fontSizeMap[data.fontSize ?? 'M']

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    removeTaskNode(id)
  }

  return (
    <Box
      sx={{
        borderRadius: "8px",
        padding: "8px 12px 8px 16px",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width,
        height,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          flexShrink: 1,
          textAlign: "left",
          whiteSpace: "normal",
          wordBreak: "break-word",
          fontSize,
        }}
      >
        {data.title}
      </Typography>

      {shouldShowDeleteAction && (
        <Tooltip title={t('editor.topbar.tooltips.deleteNode')}>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{ padding: 0, ml: 1, alignSelf: "flex-start" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default TaskNode



