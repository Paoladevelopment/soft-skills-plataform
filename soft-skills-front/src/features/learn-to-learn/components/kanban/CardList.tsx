import { Box } from '@mui/material'
import { SubTask } from '../../types/kanban/board.types'
import TaskCard from './TaskCard'

interface CardListProps {
  tasks: SubTask[]
  onDeleteTask?: (taskId: string) => void
  onViewTask?: (taskId: string) => void
}

const CardList = ({ tasks, onDeleteTask, onViewTask }: CardListProps) => {
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
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onViewDetails={onViewTask}
        />
      ))}
    </Box>
  )
}

export default CardList
