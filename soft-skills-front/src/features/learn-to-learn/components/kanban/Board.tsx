import { Box } from '@mui/material'
import { ObjectiveBoard } from '../../types/kanban/board.types'
import Column from './Column'

interface BoardProps {
  board: ObjectiveBoard
}

const Board = ({ board }: BoardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        px: 1,
        pb: 2,
        overflow: 'auto',
        minHeight: '400px',
        maxHeight: '600px',
        '&::-webkit-scrollbar': {
          height: 6
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: 3
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: '#a8a8a8'
          }
        },
        backgroundColor: '#ffffff',
      }}
    >
      {board.columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </Box>
  )
}

export default Board
