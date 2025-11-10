import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { SelfEvaluationReadRaw } from '../../types/self-evaluation/self-evaluation.api'
import { PerceivedDifficulty } from '../../types/self-evaluation/self-evaluation.enums'
import { formatDateString } from '../../../../utils/formatDate'
import { formatDifficulty } from '../../utils/selfEvaluationFormatters'
import { useState } from 'react'

interface LearningReportCardProps {
  report: SelfEvaluationReadRaw
}

const getDifficultyColor = (difficulty: PerceivedDifficulty): string => {
  switch (difficulty) {
    case PerceivedDifficulty.EASY:
      return '#4caf50'
    case PerceivedDifficulty.MODERATE:
      return '#ff9800'
    case PerceivedDifficulty.HARD:
      return '#f44336'
    default:
      return '#9e9e9e'
  }
}

const LearningReportCard = ({ report }: LearningReportCardProps) => {
  const { t } = useTranslation('reports')
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const taskTitle = report.taskTitle || t('completedTask')
  const difficultyColor = getDifficultyColor(report.perceivedDifficulty)
  const difficultyLabel = formatDifficulty(report.perceivedDifficulty)

  const handleViewClick = () => {
    navigate(`/learn/reports/${report.evaluationId}`)
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
        transition: "border-color 0.2s ease-in-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="start"
      >
        <Box 
          sx={{ 
            flex: 1 
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {taskTitle}
          </Typography>
          
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={0.5} 
            mt={1}
          >
            <CalendarTodayIcon 
              fontSize="small" 
              sx={{ 
                color: "text.secondary" 
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {formatDateString(report.createdAt, t('notSubmittedYet'), t('submittedOn'))}
            </Typography>
          </Stack>

          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            mt={1}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: difficultyColor,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {difficultyLabel}
            </Typography>
          </Stack>
        </Box>

        <IconButton 
          size="small" 
          onClick={handleViewClick}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            }
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default LearningReportCard

