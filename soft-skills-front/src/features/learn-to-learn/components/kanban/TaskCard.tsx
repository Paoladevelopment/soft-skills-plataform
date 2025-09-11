import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { CalendarToday, Flag } from '@mui/icons-material'
import { SubTask } from '../../types/kanban/board.types'
import { getPriorityColor } from '../../utils/objectiveUtils'
import { formatDateString } from '../../../../utils/formatDate'

interface TaskCardProps {
  task: SubTask
}

const TaskCard = ({ task }: TaskCardProps) => {

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #e0e0e0',
        '&:hover': {
          borderColor: '#bdbdbd',
          transform: 'translateY(-1px)'
        },
        '&:last-child': {
          mb: 0
        }
      }}
    >
      <CardContent 
        sx={{ 
          p: 2, 
          '&:last-child': { 
            pb: 2 
          } 
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3
          }}
        >
          {task.title}
        </Typography>
        
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              fontSize: '0.75rem',
              lineHeight: 1.4
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Chip
            icon={
              <Flag 
                sx={{ fontSize: '0.75rem !important' }} 
              />
            }
            label={task.priority.toLowerCase()}
            size="small"
            color={getPriorityColor(task.priority)}
            sx={{ 
              height: 20,
              fontSize: '0.65rem',
              '& .MuiChip-icon': {
                fontSize: '0.75rem'
              }
            }}
          />
          
          {task.dueDate && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5 
              }}
            >
              <CalendarToday 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary' 
                }} 
              />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.65rem' }}
              >
                {formatDateString(task.dueDate, '', '')}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskCard
