import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  IconButton,
  Paper
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteIcon from '@mui/icons-material/Delete'
import { LearningGoal } from '../../types/planner.models' 
import { useState } from 'react'

interface GoalCardProps {
  goal: LearningGoal
  onDeleteClick?: () => void
}

const GoalCard = ({ goal, onDeleteClick }: GoalCardProps) => {
  const [hovered, setHovered] = useState(false)

  const total = goal.totalObjectives || 0
  const completed = goal.completedObjectives|| 0

  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0

  const hasObjectives = total > 0

  const formatDate = (date: Date | null) => {
    if (!date) return "Not started yet"
    return `Started: ${new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}`
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderColor: hovered ? "#a9a9a9": "divider",
        cursor: hovered ? "pointer" : "default",
        transition: "border-color 0.2s ease-in-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {goal.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {goal.description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
            <CalendarTodayIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              {formatDate(goal.startedAt)}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          {hovered && (
            <IconButton size="small" onClick={onDeleteClick}>
              <DeleteIcon fontSize="small"/>
            </IconButton>
          )

          }
          <IconButton size="small">
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {hasObjectives ? (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={percentComplete} sx={{ height: 6, borderRadius: 3 }} />
          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Typography variant="caption">{`${completed}/${total} objectives`}</Typography>
            <Typography variant="caption" color="text.secondary">
              {percentComplete}% complete
            </Typography>
          </Stack>
        </Box>
      ): (
        <Box
          mt={2}
          py={1.5}
          px={2}
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            border: "1px dashed #ccc",
            textAlign: "center"
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No objectives yet. Start breaking down this goal!
          </Typography>
        </Box>
      )
      }
    </Paper>
  )
}

export default GoalCard
