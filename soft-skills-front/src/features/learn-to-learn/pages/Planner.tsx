import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import GoalsSection from '../components/planner/GoalsSection'

const Planner = () => {
  const { t } = useTranslation('goals')
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        gap: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('title')}
          </Typography>
          <Typography variant="subtitle1" component="p">
            {t('subtitle')}
          </Typography>
      </Box>
    
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <GoalsSection />
      </Box>
    </Box>
  )
}

export default Planner

