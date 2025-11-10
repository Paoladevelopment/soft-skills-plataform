import { Paper, Typography, Grid2, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelfEvaluationRead } from '../../types/self-evaluation/self-evaluation.api'
import { formatDifficulty, getMoodDisplay } from '../../utils/selfEvaluationFormatters'

interface FocusFeelingsSectionProps {
  report: SelfEvaluationRead
}

const renderStars = (level: number, max: number = 10) => {
  const stars = []
  for (let i = 1; i <= max; i++) {
    stars.push(
      <Typography
        key={i}
        component="span"
        sx={{
          color: i <= level ? 'secondary.500' : 'secondary.200',
          fontSize: '1.2rem',
        }}
      >
        ★
      </Typography>
    )
  }
  return stars
}

const FocusFeelingsSection = ({ report }: FocusFeelingsSectionProps) => {
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
        {t('sections.focusFeelings')}
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
          >
            {t('fields.difficulty')}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            {formatDifficulty(report.perceivedDifficulty)}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
          >
            {t('fields.overallMood')}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            {getMoodDisplay(report.mood)}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium" 
            mb={0.5}
          >
            {t('fields.concentrationLevel')}
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
          >
            <Box>{renderStars(report.concentrationLevel, 10)}</Box>
            <Typography variant="body2" color="text.secondary">
              {report.concentrationLevel}/10
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  )
}

export default FocusFeelingsSection

