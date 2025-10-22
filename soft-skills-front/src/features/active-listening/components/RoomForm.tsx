import { Button, Divider, Stack } from '@mui/material'
import { Save } from '@mui/icons-material'
import { useRoomDraftStore } from '../store/useRoomDraftStore'
import { AllowedType, RoomDifficulty, TeamAssignmentMode } from '../types/room/room.models'
import { ROOM_MODE, RoomMode } from '../constants/roomMode'
import RoomNameSection from './sections/RoomNameSection'
import GameSettingsSection from './sections/GameSettingsSection'
import ContentSettingsSection from './sections/ContentSettingsSection'
import AudioEffectsSection from './sections/AudioEffectsSection'
import TeamSettingsSection from './sections/TeamSettingsSection'

interface RoomFormData {
  roomName: string
  totalRounds: number
  roundTimeLimit: number
  maxPlaybacks: number
  allowedTypes: AllowedType[]
  difficulty: RoomDifficulty
  reverb: number
  echo: number
  noise: number
  speedVar: number
  teamAssignmentMode: TeamAssignmentMode
  teamSize: number
}

interface RoomFormProps {
  mode?: RoomMode
  roomId?: string
  onSubmit?: (data: RoomFormData) => void | Promise<void>
}

const RoomForm = ({ mode = ROOM_MODE.CREATE, roomId, onSubmit }: RoomFormProps) => {
  const getSnapshot = useRoomDraftStore((state) => state.getSnapshot)

  const handleSubmit = async () => {
    const draft = getSnapshot()
    
    if (onSubmit) {
      await onSubmit(draft)
    }
  }

  return (
    <Stack spacing={3}>
      <RoomNameSection mode={mode} roomId={roomId} />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <GameSettingsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <ContentSettingsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <AudioEffectsSection />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <TeamSettingsSection />

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
        {mode === ROOM_MODE.CREATE ? 'Create Room' : 'Update Configuration'}
      </Button>
    </Stack>
  )
}

export default RoomForm

