import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface LearningPurposeSectionProps {
  report: SelfEvaluationRead
}

const LearningPurposeSection = ({ report }: LearningPurposeSectionProps) => {
  const { t } = useTranslation('reports')
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        border: '1px solid', 
        borderColor: 'secondary.200', 
        borderRadius: 2 
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="medium"
        mb={2} 
        fontSize="0.875rem"
      >
        {t('sections.learningPurpose')}
      </Typography>
      <Typography 
        variant="body2" 
        fontWeight="medium" 
        mb={1}
      >
        {t('fields.whatIIntendedToLearn')}
      </Typography>
       <Typography variant="body2" color="text.secondary">
         {report.learningIntention}
       </Typography>
    </Paper>
  )
}

export default LearningPurposeSection

