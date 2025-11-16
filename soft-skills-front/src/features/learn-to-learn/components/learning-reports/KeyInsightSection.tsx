import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface KeyInsightSectionProps {
  report: SelfEvaluationRead
}

const KeyInsightSection = ({ report }: KeyInsightSectionProps) => {
  const { t } = useTranslation('reports')
  const keyInsight = report.learningIntention || t('noInsightAvailable')

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: 'secondary.800',
        borderRadius: 2,
      }}
    >
      <Typography 
        variant="subtitle2" 
        fontWeight="bold" 
        mb={1} 
        sx={{ 
          color: '#FFFFFF' 
        }}
      >
        {t('sections.whatILearned')}
      </Typography>
      
      <Typography 
        variant="body2" 
        fontStyle="italic" 
        sx={{ 
          color: '#FFFFFF' 
        }}
      >
        {keyInsight}
      </Typography>
    </Paper>
  )
}

export default KeyInsightSection

