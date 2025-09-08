import { Box, Typography, Chip } from '@mui/material'
import { TaskColumn } from '../../types/kanban/board.types'
import CardList from './CardList'

interface ColumnProps {
  column: TaskColumn
}

const Column = ({ column }: ColumnProps) => {
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return {
          bg: '#f8f9fa',
          border: '#e9ecef',
          chipColor: 'default' as const
        }
      case 'in-progress':
        return {
          bg: '#e3f2fd',
          border: '#bbdefb',
          chipColor: 'info' as const
        }
      case 'done':
        return {
          bg: '#e8f5e8',
          border: '#c8e6c9',
          chipColor: 'success' as const
        }
      case 'paused':
        return {
          bg: '#fff3e0',
          border: '#ffcc02',
          chipColor: 'warning' as const
        }
      default:
        return {
          bg: '#f8f9fa',
          border: '#e9ecef',
          chipColor: 'default' as const
        }
    }
  }

  const colors = getColumnColor(column.id)

  return (
    <Box
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
        <CardList tasks={column.tasks} />
      </Box>
    </Box>
  )
}

export default Column
