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
import CloseIcon from '@mui/icons-material/Close'
import ChatIcon from '@mui/icons-material/SmartToy'
import FlowChartIcon from '@mui/icons-material/AccountTree'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState } from 'react'
import { RoadmapCreationOption } from '../../types/roadmap/roadmap.options'

interface Props {
  open: boolean
  onClose: () => void
  onSelectOption: (option: RoadmapCreationOption) => void
}

const CreateRoadmapModal = ({ open, onClose, onSelectOption }: Props) => {
  const theme = useTheme()
  const [selected, setSelected] = useState<RoadmapCreationOption>('chatbot')

  const isChatbotSelected = selected === 'chatbot'
  const isManualSelected = selected === 'manual'

  const getBorderColor = (type: RoadmapCreationOption) =>
    selected === type ? theme.palette.secondary.main : '#ccc'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        New Roadmap
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography mb={2}>
          How would you like to create your roadmap?
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
                Guided by Aithena
              </Typography>
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Let our AI tutor guide you through a personalized roadmap creation conversation.
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
                Start from scratch
              </Typography>
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Build your roadmap manually using our visual editor.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() => onSelectOption(selected)}
          variant="contained"
          color="secondary"
        >
          Get started
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateRoadmapModal