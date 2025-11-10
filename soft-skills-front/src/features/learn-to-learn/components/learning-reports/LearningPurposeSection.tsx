import { Paper, Typography } from '@mui/material'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface LearningPurposeSectionProps {
  report: SelfEvaluationRead
}

const LearningPurposeSection = ({ report }: LearningPurposeSectionProps) => {
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
        Learning purpose
      </Typography>
      <Typography 
        variant="body2" 
        fontWeight="medium" 
        mb={1}
      >
        What I intended to learn:
      </Typography>
       <Typography variant="body2" color="text.secondary">
         {report.learningIntention}
       </Typography>
    </Paper>
  )
}

export default LearningPurposeSection

