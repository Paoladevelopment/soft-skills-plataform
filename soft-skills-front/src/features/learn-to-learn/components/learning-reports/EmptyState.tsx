import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const EmptyState = () => {
  const { t } = useTranslation('reports')
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        textAlign: "center",
        borderRadius: 2,
        boxShadow: "none",
        py: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium">
        {t('empty.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('empty.description')}
      </Typography>
    </Paper>
  )
}

export default EmptyState

