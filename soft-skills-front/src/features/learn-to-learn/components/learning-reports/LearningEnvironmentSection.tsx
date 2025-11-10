import { Paper, Typography, Grid2 } from '@mui/material'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('reports')
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
        {t('sections.learningEnvironment')}
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            {t('fields.studyPlace')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatStudyPlace(report.studyPlace)}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            {t('fields.noiseLevel')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.noiseLevel ? formatNoiseLevel(report.noiseLevel) : t('notSpecified')}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            {t('fields.timeOfDay')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.timeOfDay ? formatTimeOfDay(report.timeOfDay) : t('notSpecified')}
          </Typography>
        </Grid2>
        
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" fontWeight="medium">
            {t('fields.collaborationMode')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.collaborationMode ? formatCollaborationMode(report.collaborationMode) : t('notSpecified')}
          </Typography>
        </Grid2>
      </Grid2>
    </Paper>
  )
}

export default LearningEnvironmentSection

