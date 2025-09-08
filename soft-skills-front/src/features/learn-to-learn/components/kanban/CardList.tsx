import { Box } from '@mui/material'
import { SubTask } from '../../types/kanban/board.types'
import TaskCard from './TaskCard'

interface CardListProps {
  tasks: SubTask[]
}

const CardList = ({ tasks }: CardListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: 100,
        p: 1
      }}
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Box>
  )
}

export default CardList
