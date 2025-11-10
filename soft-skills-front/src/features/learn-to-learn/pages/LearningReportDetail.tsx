import { Box, CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useSelfEvaluation } from '../hooks/useSelfEvaluations'
import BackToReportsButton from '../components/learning-reports/BackToReportsButton'
import ReportHeader from '../components/learning-reports/ReportHeader'
import KeyInsightSection from '../components/learning-reports/KeyInsightSection'
import LearningEnvironmentSection from '../components/learning-reports/LearningEnvironmentSection'
import LearningPurposeSection from '../components/learning-reports/LearningPurposeSection'
import TaskExperienceSection from '../components/learning-reports/TaskExperienceSection'
import FocusFeelingsSection from '../components/learning-reports/FocusFeelingsSection'
import LearningMethodsSection from '../components/learning-reports/LearningMethodsSection'
import ErrorState from '../components/learning-reports/ErrorState'

const LearningReportDetail = () => {
  const { evaluationId } = useParams()
  const { data: report, isLoading, error } = useSelfEvaluation(evaluationId || null)

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error || !report) {
    return (
      <Box 
        sx={{ 
          maxWidth: '900px', 
          mx: 'auto', 
          px: 2, 
          py: 4 
        }}
      >
        <ErrorState error={error || new Error('Report not found')} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <BackToReportsButton />
      <ReportHeader report={report} />
      <KeyInsightSection report={report} />
      <LearningEnvironmentSection report={report} />
      <LearningPurposeSection report={report} />
      <TaskExperienceSection report={report} />
      <FocusFeelingsSection report={report} />
      <LearningMethodsSection report={report} />
    </Box>
  )
}

export default LearningReportDetail

