import { Button, Divider, Stack } from '@mui/material'
import { Save } from '@mui/icons-material'
import { useGameSessionDraftStore } from '../store/useGameSessionDraftStore'
import { PromptType, GameSessionDifficulty, PlayMode } from '../types/game-sessions/gameSession.models'
import { GAME_SESSION_MODE, GameSessionMode } from '../constants/gameSessionMode'
import GameSessionNameSection from './sections/GameSessionNameSection'
import GameSettingsSection from './sections/GameSettingsSection'
import ContentSettingsSection from './sections/ContentSettingsSection'
import AudioEffectsSection from './sections/AudioEffectsSection'

interface GameSessionFormData {
  sessionName: string
  totalRounds: number
  maxReplaysPerRound: number
  difficulty: GameSessionDifficulty
  responseTimeLimits: { [mode: string]: number }
  selectedModes: PlayMode[]
  allowedTypes: PromptType[]
  audioEffects: { [effect: string]: number }
}

interface GameSessionFormProps {
  mode?: GameSessionMode
  sessionId?: string
  onSubmit?: (data: GameSessionFormData) => void | Promise<void>
}

const GameSessionForm = ({ mode = GAME_SESSION_MODE.CREATE, sessionId, onSubmit }: GameSessionFormProps) => {
  const getSnapshot = useGameSessionDraftStore((state) => state.getSnapshot)

  const handleSubmit = async () => {
    const draft = getSnapshot()
    
    if (onSubmit) {
      await onSubmit(draft)
    }
  }

  return (
    <Stack spacing={3}>
      <GameSessionNameSection mode={mode} sessionId={sessionId} />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <GameSettingsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <ContentSettingsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <AudioEffectsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <Button
        variant="contained"
        onClick={handleSubmit}
        startIcon={<Save />}
        fullWidth
        sx={{
          background: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
          color: 'white',
          py: 1.5,
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '1.1rem',
          borderRadius: '12px',
          '&:hover': {
            background: 'linear-gradient(180deg, #FB8C00 0%, #EF6C00 100%)',
          },
        }}
      >
        {mode === GAME_SESSION_MODE.CREATE ? 'Create Session' : 'Update Configuration'}
      </Button>
    </Stack>
  )
}

export default GameSessionForm

