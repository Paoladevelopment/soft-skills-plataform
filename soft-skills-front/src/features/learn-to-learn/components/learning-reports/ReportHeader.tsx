import { Box, Typography, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { formatDateString } from '../../../../utils/formatDate'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface ReportHeaderProps {
  report: SelfEvaluationRead
}

const ReportHeader = ({ report }: ReportHeaderProps) => {
  const { t } = useTranslation('reports')
  const taskTitle = report.taskTitle || t('learningReport')

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        mb={1}
      >
        {taskTitle}
      </Typography>
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={0.5}
      >
        <CalendarTodayIcon 
          fontSize="small" 
          sx={{ 
            color: 'text.secondary' 
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          {formatDateString(report.createdAt, t('notSubmittedYet'), t('submittedOn'))}
        </Typography>
      </Stack>
    </Box>
  )
}

export default ReportHeader

