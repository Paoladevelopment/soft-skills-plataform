import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { CalendarToday, Flag } from '@mui/icons-material'
import { SubTask } from '../../types/kanban/board.types'
import { CardData } from '../../types/kanban/drag-drop.types'
import { getPriorityColor } from '../../utils/objectiveUtils'
import { formatDateString } from '../../../../utils/formatDate'
import { useEffect, useRef, useState } from 'react'
import { 
  draggable,
  dropTargetForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { 
  attachClosestEdge,
  extractClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import DropIndicator from './DropIndicator'

interface TaskCardProps {
  task: SubTask
}

const TaskCard = ({ task }: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null)

  useEffect(() => {
    const cardEl = cardRef.current
    if (!cardEl) return

    return combine(
      draggable({
        element: cardEl,
        getInitialData: () => ({ 
          type: 'card', 
          cardId: task.id, 
          columnId: '', 
          index: 0 
        } satisfies CardData)
      }),
      dropTargetForElements({
        element: cardEl,
        getData: ({ input, element }) => {
          const data = { type: 'card', cardId: task.id }
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom']
          })
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          const edge = extractClosestEdge(args.self.data)
          setClosestEdge(edge)
        },
        onDrag: (args) => {
          const edge = extractClosestEdge(args.self.data)
          setClosestEdge(edge)
        },
        onDragLeave: () => {
          setClosestEdge(null)
        },
        onDrop: () => {
          setClosestEdge(null)
        }
      })
    )
  }, [task.id])

  return (
    <Card
      ref={cardRef}
      elevation={0}
      sx={{
        mb: 2,
        cursor: 'grab',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #e0e0e0',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          borderColor: '#bdbdbd',
          transform: 'translateY(-1px)'
        },
        '&:last-child': {
          mb: 0
        },
        '&:active': {
          cursor: 'grabbing'
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
      {closestEdge && (closestEdge === 'top' || closestEdge === 'bottom') && (
        <DropIndicator edge={closestEdge} gap="4px" />
      )}
    </Card>
  )
}

export default TaskCard
