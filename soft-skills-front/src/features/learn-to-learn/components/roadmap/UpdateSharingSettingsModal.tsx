import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Lock, Public } from '@mui/icons-material'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { RoadmapVisibility } from '../../types/roadmap/roadmap.enums'

interface Props {
  open: boolean,
  visibility: RoadmapVisibility,
  onSubmit: (visibility: RoadmapVisibility) => Promise<void>
  onClose: () => void
}

const UpdateSharingSettingsModal = ({ open, visibility, onSubmit, onClose }: Props) => {
  const { t } = useTranslation('roadmap')
  const [selectedVisibility, setSelectedVisibility] = useState<RoadmapVisibility>(visibility)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangeVisibility = (
    _: React.MouseEvent<HTMLElement>,
    newValue: RoadmapVisibility | null
  ) => {
    if (newValue) setSelectedVisibility(newValue)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(selectedVisibility)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  const isPrivate = selectedVisibility === RoadmapVisibility.Private
  const isPublic = selectedVisibility === RoadmapVisibility.Public

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">{t('editor.sharing.title')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" mb={2}>
          {t('editor.sharing.instruction')}
        </Typography>

        <ToggleButtonGroup
          fullWidth
          value={selectedVisibility}
          exclusive
          onChange={handleChangeVisibility}
          sx={{ mb: 2 }}
        >
          <ToggleButton 
            value={RoadmapVisibility.Private}
            sx={{ textTransform: 'none' }}
          >
            <Lock fontSize="small" sx={{ mr: 1 }} />
            {t('editor.sharing.onlyMe')}
          </ToggleButton>
          <ToggleButton 
            value={RoadmapVisibility.Public}
            sx={{ textTransform: 'none' }}
          >
            <Public fontSize="small" sx={{ mr: 1 }} />
            {t('editor.sharing.public')}
          </ToggleButton>
        </ToggleButtonGroup>

        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
          }}
        >
          {isPrivate && (
            <>
              <Lock fontSize="large" />
              <Typography mt={1}>{t('editor.sharing.onlyYouAccess')}</Typography>
            </>
          )}
          {isPublic && (
            <>
              <Public fontSize="large" />
              <Typography mt={1}>{t('editor.sharing.anyoneWithLink')}</Typography>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3, 
          pb: 2 
        }}
      >
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t('editor.sharing.close')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="secondary"
        >
          {isSubmitting ? (
            <CircularProgress 
              size={20} 
              sx={{ color: 'white', mr: 1 }} />
          ) : null}
          {t('editor.sharing.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateSharingSettingsModal