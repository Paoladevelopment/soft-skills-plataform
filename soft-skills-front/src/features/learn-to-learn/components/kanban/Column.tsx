import { Box, Typography, Chip } from '@mui/material'
import { TaskColumn } from '../../types/kanban/board.types'
import { ColumnData } from '../../types/kanban/drag-drop.types'
import { getColumnColor } from '../../utils/columnColors'
import CardList from './CardList'
import { useEffect, useRef } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

interface ColumnProps {
  column: TaskColumn
  onDeleteTask?: (taskId: string) => void
  onViewTask?: (taskId: string) => void
}

const Column = ({ column, onDeleteTask, onViewTask }: ColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const columnEl = columnRef.current
    if (!columnEl) return

    return dropTargetForElements({
      element: columnEl,
      getData: () => ({ 
        type: 'column', 
        columnId: column.id 
      } satisfies ColumnData),
      getIsSticky: () => true
    })
  }, [column.id])

  const colors = getColumnColor(column.id)

  return (
    <Box
      ref={columnRef}
      sx={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          p: 2,
          pb: 1,
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {column.title}
          </Typography>
          <Chip
            label={column.tasks.length}
            size="small"
            color={colors.chipColor}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 0',
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3
          }
        }}
      >
        <CardList
          tasks={column.tasks}
          onDeleteTask={onDeleteTask}
          onViewTask={onViewTask}
        />
      </Box>
    </Box>
  )
}

export default Column
