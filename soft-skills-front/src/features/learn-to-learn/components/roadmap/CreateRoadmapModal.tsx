import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  useTheme
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import ChatIcon from '@mui/icons-material/SmartToy'
import FlowChartIcon from '@mui/icons-material/AccountTree'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState } from 'react'
import { RoadmapCreationOption } from '../../types/roadmap/roadmap.options'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { useNavigate } from 'react-router-dom'
import RoadmapForm from './RoadmapForm'

interface Props {
  open: boolean
  onClose: () => void
}

const CreateRoadmapModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation('roadmap')
  const theme = useTheme()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RoadmapCreationOption>('chatbot')
  const [showManualForm, setShowManualForm] = useState(false)

  const {
    createRoadmap
  } = useRoadmapStore()

  const isChatbotSelected = selected === 'chatbot'
  const isManualSelected = selected === 'manual'

  const getBorderColor = (type: RoadmapCreationOption) =>
    selected === type ? theme.palette.secondary.main : '#ccc'

  const handleGetStarted = () => {
    if (selected === 'chatbot') {
      navigate('/learn/roadmaps/create/chat')
      onClose()
      return 
    } 

    setShowManualForm(true)
  }

  const handleManualSubmit = async (title: string, description: string) => {
    const roadmapId = await createRoadmap(title, description)
    if (roadmapId) {
      setShowManualForm(false)
      onClose()
      navigate(`/learn/roadmaps/${roadmapId}/edit`)
    }
  }

  return (
    <>
      <Dialog open={open && !showManualForm} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          {t('createModal.title')}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography mb={2}>
            {t('createModal.question')}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Box
              onClick={() => setSelected('chatbot')}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                border: `2px solid ${getBorderColor('chatbot')}`,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {isChatbotSelected && (
                <CheckCircleIcon
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 8, 
                    color: theme.palette.secondary.main 
                  }}
                />
              )}
              <Stack direction="column" alignItems="center" spacing={1}>
                <ChatIcon fontSize="large" />
                <Typography variant="subtitle1" fontWeight="medium">
                  {t('createModal.options.chatbot.title')}
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary">
                  {t('createModal.options.chatbot.description')}
                </Typography>
              </Stack>
            </Box>

            <Box
              onClick={() => setSelected('manual')}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                border: `2px solid ${getBorderColor('manual')}`,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {isManualSelected && (
                <CheckCircleIcon
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 8, 
                    color: theme.palette.secondary.main 
                  }}
                />
              )}
              <Stack direction="column" alignItems="center" spacing={1}>
                <FlowChartIcon fontSize="large" />
                <Typography variant="subtitle1" fontWeight="medium">
                  {t('createModal.options.manual.title')}
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary">
                  {t('createModal.options.manual.description')}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="text" color="inherit">
            {t('createModal.buttons.cancel')}
          </Button>
          <Button
            onClick={handleGetStarted}
            variant="contained"
            color="secondary"
          >
            {t('createModal.buttons.getStarted')}
          </Button>
        </DialogActions>
      </Dialog>

      <RoadmapForm
        open={showManualForm}
        onClose={() => {
          setShowManualForm(false)
          onClose()
        }}
        onSubmit={handleManualSubmit}
        mode='create'
      />
    </>
  )
}

export default CreateRoadmapModal