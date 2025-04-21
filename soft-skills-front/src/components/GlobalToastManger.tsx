import { Snackbar, Alert, Typography } from '@mui/material'
import { useToastStore } from '../store/useToastStore'
import { ToastType } from '../types/toast.types'

const getTitleForToast = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'Success'
    case 'error':
      return 'Something went wrong'
    case 'warning':
      return 'Warning'
    case 'info':
      return 'Info'
    default:
      return ''
  }
}

const GlobalToastManager = () => {
  const { 
    open, 
    message, 
    type, 
    hideToast 
  } = useToastStore()

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
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
          {getTitleForToast(type)}
        </Typography>
        <Typography>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default GlobalToastManager
