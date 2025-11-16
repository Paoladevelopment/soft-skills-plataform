import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import GameSessionForm from './GameSessionForm'
import { GAME_SESSION_MODE } from '../constants/gameSessionMode'
import { useGameSessionStore } from '../store/useGameSessionStore'
import { PromptType, GameSessionDifficulty, PlayMode } from '../types/game-sessions/gameSession.models'

interface GameSessionSettingsModalProps {
  open: boolean
  onClose: () => void
  sessionId: string
  sessionName: string
  isLoading?: boolean
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`room-settings-tabpanel-${index}`}
  >
    {value === index && <Box>{children}</Box>}
  </div>
)

const GameSessionSettingsModal = ({ open, onClose, sessionId, sessionName, isLoading = false }: GameSessionSettingsModalProps) => {
  const { t } = useTranslation('game')
  
  const [tabValue, setTabValue] = useState(0)
  const updateGameSessionConfig = useGameSessionStore((state) => state.updateGameSessionConfig)
  const selectedGameSession = useGameSessionStore((state) => state.selectedGameSession)
  
  const displaySessionName = selectedGameSession?.name || sessionName

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleUpdateSession = async (data: {
    sessionName: string
    totalRounds: number
    maxReplaysPerRound: number
    difficulty: GameSessionDifficulty
    responseTimeLimits: { [mode: string]: number }
    selectedModes: PlayMode[]
    allowedTypes: PromptType[]
  }) => {
    await updateGameSessionConfig(sessionId, {
      config: {
        total_rounds: data.totalRounds,
        max_replays_per_round: data.maxReplaysPerRound,
        difficulty: data.difficulty,
        response_time_limits: data.responseTimeLimits,
        selected_modes: data.selectedModes,
        allowed_types: data.allowedTypes,
      },
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0px 4px 0px #2F5A47',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 1,
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold"
          >
            {t('play.settingsModal.title', { name: displaySessionName })}
          </Typography>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.6)"
          >
            {t('play.settingsModal.subtitle')}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          px: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          slotProps={{
            indicator: {
              sx: {
                backgroundColor: '#FFB74D',
                height: 3,
              },
            },
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 48,
              padding: '0.75rem 1.5rem',
              minWidth: 'auto',
              '&.Mui-selected': {
                color: 'white',
              },
            },
            '& .MuiTabs-flexContainer': {
              gap: 3,
            },
          }}
        >
          <Tab label={t('play.settingsModal.configurationTab')} />
        </Tabs>
      </Box>

      <DialogContent 
        sx={{ 
          pt: 3 
        }}
      >
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: 8 
              }}
            >
              <CircularProgress 
                sx={{ 
                  color: 'white' 
                }} 
                size={48} 
              />
            </Box>
          ) : (
            <GameSessionForm 
              mode={GAME_SESSION_MODE.UPDATE} 
              sessionId={sessionId} 
              onSubmit={handleUpdateSession} 
            />
          )}
        </TabPanel>
      </DialogContent>
    </Dialog>
  )
}

export default GameSessionSettingsModal
