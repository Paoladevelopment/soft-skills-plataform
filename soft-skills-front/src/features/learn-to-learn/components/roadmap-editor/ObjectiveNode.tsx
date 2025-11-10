import { Box, IconButton, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Position, NodeProps } from 'reactflow'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomHandle from '../roadmap-editor/CustomHandle'
import { useState } from 'react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { ObjectiveNodeData } from '../../types/roadmap/roadmap.models'
import { captionFontSizeMap, fontSizeMap } from '../../types/roadmap/roadmap.options'

const ObjectiveNode = (
  {data, id}: NodeProps<ObjectiveNodeData>
) => {
  const { t } = useTranslation('roadmap')
  const [hovered, setHovered] = useState(false)
  const removeObjectiveNode = useRoadmapStore((state) => state.removeObjectiveNode)

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    removeObjectiveNode(id)
  }

  const shouldShowDeleteAction = data.isEditable && hovered

  const bgColor = data.backgroundColor ?? '#FFFFFF'
  const width = data.width ?? 250
  const height = data.height ?? 'auto'
  const fontSize = fontSizeMap[data.fontSize ?? 'L']
  const captionSize = captionFontSizeMap[data.fontSize ?? 'L']

  return (
    <Box
      sx={{
        borderRadius: '8px',
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        width,
        height,
        backgroundColor: bgColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CustomHandle type="target" position={Position.Top} id="top"/>
      <CustomHandle  type="source" position={Position.Right} id="right" />
      <CustomHandle  type="source" position={Position.Left} id="left" />
      <CustomHandle  type="source" position={Position.Bottom} id="bottom"/>

      {shouldShowDeleteAction && (
        <Tooltip title={t('editor.topbar.tooltips.deleteNode')}>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: '#f2f2f2',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ width: "100%"}}>
        <Typography 
          sx={{
            fontWeight: 'bold',
            fontSize,
            marginBottom: 1,
          }}
        >
          {data.title}
        </Typography>
      </Box>  

      <Box display="flex" alignItems="center">
        <Typography 
          sx={{ 
            fontSize: captionSize,
            color: 'purple', 
            fontWeight: 500, 
            mr: 0.5 
          }}>
          {t('editor.node.tasks')}
        </Typography>
        <Typography
          sx={{ 
            fontSize: captionSize, 
            color: 'text.secondary' 
          }}
        >
          {data.totalTasks ?? 0}
        </Typography>
      </Box>
    </Box>
  )
}

export default ObjectiveNode




