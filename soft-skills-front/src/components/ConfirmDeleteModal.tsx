import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

interface ConfirmDeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmDeleteModalProps) => {
  const { t } = useTranslation('common')
  const defaultTitle = t('actions.confirmDeletion')
  const defaultMessage = t('actions.confirmDeleteMessage')
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth
      maxWidth="xs"
    >
      <Box 
        sx={{ 
          backgroundColor: "#ff6b6b", 
          px: 3, 
          py: 2, 
          position: "relative" 
        }}>
        <Typography variant="h6" fontWeight="semi-bold" color="white">
          {title || defaultTitle}
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            position: "absolute", 
            right: 8, 
            top: 8, 
            color: "white"
          }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent 
        sx={{ 
          textAlign: "center", 
          py: 4 
        }}>
        <WarningAmberIcon color="error" fontSize="large" />
        <Typography mt={2}>{message || defaultMessage}</Typography>
      </DialogContent>

      <DialogActions 
        sx={{ 
          justifyContent: "center", 
          pb: 3 
        }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit" 
          startIcon={<CloseIcon />}
        >
          {t('actions.cancel')}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          startIcon={<DeleteIcon />}
        >
          {t('actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteModal

