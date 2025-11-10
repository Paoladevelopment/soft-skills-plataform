import { Paper, Typography, Grid2, Checkbox, FormControlLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'
import { LearningMethod } from '../../types/self-evaluation/self-evaluation.enums'
import { formatLearningMethod } from '../../utils/selfEvaluationFormatters'

interface LearningMethodsSectionProps {
  report: SelfEvaluationRead
}

const LearningMethodsSection = ({ report }: LearningMethodsSectionProps) => {
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
        {t('sections.learningMethodsUsed')}
      </Typography>
      <Grid2 container spacing={1}>
        {Object.values(LearningMethod).map((method) => {
          const isUsed = report.learningMethods?.includes(method) || false

          return (
            <Grid2 
              size={{ 
                xs: 12, 
                sm: 6 
              }} 
              key={method}
            >
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={isUsed} 
                    disabled 
                    sx={{
                      '&.Mui-checked': {
                        color: 'secondary.main',
                      },
                      '&.Mui-disabled.Mui-checked': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    {formatLearningMethod(method)}
                  </Typography>
                }
              />
            </Grid2>
          )
        })}
      </Grid2>
    </Paper>
  )
}

export default LearningMethodsSection

