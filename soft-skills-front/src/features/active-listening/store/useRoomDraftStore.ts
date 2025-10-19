import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AllowedType, RoomDifficulty, TeamAssignmentMode } from '../types/room/room.models'
import { RoomDraft, RoomDraftStore } from '../types/room/room.draft'

const initialState: RoomDraft = {
  roomName: '',
  totalRounds: 5,
  roundTimeLimit: 90,
  maxPlaybacks: 2,
  allowedTypes: [AllowedType.DESCRIPTIVE, AllowedType.CONVERSATIONAL],
  difficulty: RoomDifficulty.EASY,
  reverb: 0,
  echo: 0,
  noise: 0,
  speedVar: 0,
  teamAssignmentMode: TeamAssignmentMode.MANUAL,
  teamSize: 2,
}

export const useRoomDraftStore = create<RoomDraftStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setField: (field, value) => {
        set({ [field]: value })
      },

      toggleAllowedType: (type) => {
        set((state) => ({
          allowedTypes: state.allowedTypes.includes(type)
            ? state.allowedTypes.filter((t) => t !== type)
            : [...state.allowedTypes, type],
        }))
      },

      setAudio: (effect, value) => {
        set({ 
          [effect]: value 
        })
      },

      reset: () => {
        set(initialState)
      },

      loadRoom: (room) => {
        set((state) => (
          { 
            ...state, 
            ...room 
          })
        )
      },

      getSnapshot: () => {
        const state = get()
        return {
          roomName: state.roomName,
          totalRounds: state.totalRounds,
          roundTimeLimit: state.roundTimeLimit,
          maxPlaybacks: state.maxPlaybacks,
          allowedTypes: state.allowedTypes,
          difficulty: state.difficulty,
          reverb: state.reverb,
          echo: state.echo,
          noise: state.noise,
          speedVar: state.speedVar,
          teamAssignmentMode: state.teamAssignmentMode,
          teamSize: state.teamSize,
        }
      },
    }),
    {
      name: 'room-draft'
    }
  )
)

