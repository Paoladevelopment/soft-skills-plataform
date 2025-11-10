import { Paper, Typography } from '@mui/material'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface KeyInsightSectionProps {
  report: SelfEvaluationRead
}

const KeyInsightSection = ({ report }: KeyInsightSectionProps) => {
  const keyInsight = report.learningIntention || 'No insight available'

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
        What i learned
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

