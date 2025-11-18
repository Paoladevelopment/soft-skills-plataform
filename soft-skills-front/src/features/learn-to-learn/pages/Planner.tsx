import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
            {t('subtitle')}{' '}
            <Link 
              to="/learn/help"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
                textDecorationColor: '#2383E2',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecorationColor = '#1565c0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecorationColor = '#2383E2'
              }}
            >
              {t('subtitleLink')}
            </Link>
            .
          </Typography>
      </Box>
    
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <GoalsSection />
      </Box>
    </Box>
  )
}

export default Planner

