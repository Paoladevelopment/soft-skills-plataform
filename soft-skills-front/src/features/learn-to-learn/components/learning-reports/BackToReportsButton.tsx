import { Stack, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackToReportsButton = () => {
  const { t } = useTranslation('reports')
  const navigate = useNavigate()

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={1}
    >
      <IconButton 
        onClick={() => navigate('/learn/reports')} 
        size="small"
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="body2"
        fontWeight={500}
        color="text.secondary"
      >
        {t('backToReports')}
      </Typography>
    </Stack>
  )
}

export default BackToReportsButton

