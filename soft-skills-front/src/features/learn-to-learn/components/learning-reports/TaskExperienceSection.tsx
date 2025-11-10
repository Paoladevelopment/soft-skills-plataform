import { Paper, Typography, Box, Divider } from '@mui/material'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface TaskExperienceSectionProps {
  report: SelfEvaluationRead
}

const TaskExperienceSection = ({ report }: TaskExperienceSectionProps) => {
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
        Experience during the task
      </Typography>
      <Box mb={2}>
        <Typography 
          variant="body1" 
          fontWeight="medium" 
          mb={1}
        >
          What went well:
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          {report.whatWentWell}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={2}>
        <Typography 
          variant="body1" 
          fontWeight="medium" 
          mb={1}
        >
          Challenges I faced:
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          {report.challengesEncountered}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography 
          variant="body1" 
          fontWeight="medium" 
          mb={1}
        >
          Improvement plan:
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {report.improvementPlan}
        </Typography>
      </Box>
    </Paper>
  )
}

export default TaskExperienceSection

