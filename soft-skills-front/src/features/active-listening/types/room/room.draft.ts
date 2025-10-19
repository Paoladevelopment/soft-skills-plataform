import { AllowedType, RoomDifficulty, TeamAssignmentMode } from './room.models'

export interface RoomDraft {
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

export interface RoomDraftStore extends RoomDraft {
  setField: <K extends keyof RoomDraft>(field: K, value: RoomDraft[K]) => void
  toggleAllowedType: (type: AllowedType) => void
  setAudio: (effect: 'reverb' | 'echo' | 'noise' | 'speedVar', value: number) => void
  reset: () => void
  getSnapshot: () => RoomDraft
  loadRoom: (room: Partial<RoomDraft>) => void
}

