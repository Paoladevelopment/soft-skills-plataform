import { Box, Typography, Paper } from '@mui/material'
import { Circle, CircleDashed } from 'lucide-react'
import { LayoutNodeType } from '../../types/roadmap/roadmap.enums'
import { ReactNode } from 'react'

type SidebarComponent = {
  label: string
  type: LayoutNodeType
  icon?: ReactNode
}

const components: SidebarComponent[] = [
  { label: 'Objective', type: LayoutNodeType.Objective, icon: <Circle size={18} /> },
  { label: 'Task', type: LayoutNodeType.Task, icon: <CircleDashed size={18} />},
]

const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Box
      sx={{
        width: 220,
        padding: 2,
        borderRight: '1px solid #ddd',
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Components
      </Typography>

      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        Drag & drop onto the canvas
      </Typography>

      {components.map((item) => (
        <Paper
          key={item.type}
          variant="outlined"
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          sx={{
            padding: 1.5,
            marginBottom: 1,
            cursor: "grab",
            backgroundColor: "#fff",
            boxShadow: "none",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap:1,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          {item.icon}
          {item.label}
        </Paper>
      ))}
    </Box>
  )
}

export default Sidebar