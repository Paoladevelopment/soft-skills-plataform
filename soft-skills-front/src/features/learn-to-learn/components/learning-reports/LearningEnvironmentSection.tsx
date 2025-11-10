import { Paper, Typography, Grid2 } from '@mui/material'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'
import {
  formatStudyPlace,
  formatNoiseLevel,
  formatTimeOfDay,
  formatCollaborationMode,
} from '../../utils/selfEvaluationFormatters'

interface LearningEnvironmentSectionProps {
  report: SelfEvaluationRead
}

const LearningEnvironmentSection = ({ report }: LearningEnvironmentSectionProps) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        border: '1px solid',
        borderColor: 'secondary.200',
        borderRadius: 2 
      }}>
      <Typography 
        variant="h6" 
        fontWeight="medium" 
        mb={2} 
        fontSize="0.875rem"
      >
        Learning environment
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            Study Place:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatStudyPlace(report.studyPlace)}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            Noise Level:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.noiseLevel ? formatNoiseLevel(report.noiseLevel) : 'Not specified'}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            Time of Day:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.timeOfDay ? formatTimeOfDay(report.timeOfDay) : 'Not specified'}
          </Typography>
        </Grid2>
        
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            Collaboration Mode:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.collaborationMode ? formatCollaborationMode(report.collaborationMode) : 'Not specified'}
          </Typography>
        </Grid2>
      </Grid2>
    </Paper>
  )
}

export default LearningEnvironmentSection

