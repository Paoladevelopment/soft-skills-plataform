import { Snackbar, Alert, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useToastStore } from '../store/useToastStore'
import { ToastType } from '../types/toast.types'

const getTitleForToast = (type: ToastType, t: (key: string) => string): string => {
  switch (type) {
    case 'success':
      return t('toast.success', { ns: 'common' })
    case 'error':
      return t('toast.error', { ns: 'common' })
    case 'warning':
      return t('toast.warning', { ns: 'common' })
    case 'info':
      return t('toast.info', { ns: 'common' })
    default:
      return ''
  }
}

const GlobalToastManager = () => {
  const { t } = useTranslation('common')
  const { 
    open, 
    message, 
    type, 
    timeout,
    hideToast 
  } = useToastStore()

  return (
    <Snackbar
      open={open}
      autoHideDuration={timeout}
      onClose={hideToast}
      anchorOrigin={{ 
        vertical: 'bottom', 
        horizontal: 'right' 
      }}
    >
      <Alert 
        onClose={hideToast} 
        severity={type} 
        variant="filled" 
        sx={{ 
          width: '100%' 
          }}
        >
        <Typography fontWeight="bold">
          {getTitleForToast(type, t)}
        </Typography>
        <Typography>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default GlobalToastManager
