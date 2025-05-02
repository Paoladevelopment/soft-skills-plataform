import { Box, Typography } from '@mui/material'
import { Position, NodeProps } from 'reactflow'
import CustomHandle from '../roadmap-editor/CustomHandle'

interface ObjectiveNodeData {
  title: string
  description?: string
  total_tasks: number
}

const ObjectiveNode = (
  {data}: NodeProps<ObjectiveNodeData>
) => {
  return (
    <Box
      sx={{
        borderRadius: '8px',
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        width: 250,
        backgroundColor: "white",
      }}
    >
      <CustomHandle type="target" position={Position.Top} id="top"/>
      <CustomHandle  type="source" position={Position.Right} id="right" />
      <CustomHandle  type="source" position={Position.Left} id="left" />
      <CustomHandle  type="source" position={Position.Bottom} id="bottom"/>

      <Box sx={{ width: "100%"}}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold" 
          gutterBottom
        >
          {data.title}
        </Typography>

        {data.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
          >
            {data.description}
          </Typography>
        )}
      </Box>  

      <Box display="flex" alignItems="center">
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'purple', 
            fontWeight: 500, 
            mr: 0.5 
          }}>
          Tasks:
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.total_tasks}
        </Typography>
      </Box>
    </Box>
  )
}

export default ObjectiveNode




