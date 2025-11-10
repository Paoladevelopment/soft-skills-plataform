import { Paper, Typography, Box, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'

interface TaskExperienceSectionProps {
  report: SelfEvaluationRead
}

const TaskExperienceSection = ({ report }: TaskExperienceSectionProps) => {
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
        {t('sections.taskExperience')}
      </Typography>
      <Box mb={2}>
        <Typography 
          variant="body1" 
          fontWeight="medium" 
          mb={1}
        >
          {t('fields.whatWentWell')}
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
          {t('fields.challengesIFaced')}
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
          {t('fields.improvementPlan')}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {report.improvementPlan}
        </Typography>
      </Box>
    </Paper>
  )
}

export default TaskExperienceSection

