import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ErrorStateProps {
  error: Error | unknown
}

const ErrorState = ({ error }: ErrorStateProps) => {
  const { t } = useTranslation('reports')
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #f44336",
        textAlign: "center",
        borderRadius: 2,
        boxShadow: "none",
        py: 2,
        backgroundColor: "#ffebee",
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" color="error">
        {t('errors.loadError')}
      </Typography>
      <Typography variant="body2" color="error" mt={1}>
        {error instanceof Error ? error.message : t('errors.generic', { ns: 'common' })}
      </Typography>
    </Paper>
  )
}

export default ErrorState

