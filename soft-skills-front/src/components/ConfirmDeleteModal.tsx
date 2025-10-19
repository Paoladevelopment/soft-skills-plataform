import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material'
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
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.'
}: ConfirmDeleteModalProps) => {
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
          {title}
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
        <Typography mt={2}>{message}</Typography>
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
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteModal

