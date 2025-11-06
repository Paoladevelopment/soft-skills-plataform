import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PromptType, GameSessionDifficulty, PlayMode } from '../types/game-sessions/gameSession.models'
import { IGameSessionDraftStore } from '../types/game-sessions/gameSession.draft'

const initialState = {
  sessionName: '',
  totalRounds: 5,
  maxReplaysPerRound: 2,
  difficulty: GameSessionDifficulty.EASY,
  responseTimeLimits: {
    [PlayMode.FOCUS]: 60,
    [PlayMode.CLOZE]: 90,
    [PlayMode.PARAPHRASE]: 120,
    [PlayMode.SUMMARIZE]: 120,
    [PlayMode.CLARIFY]: 90,
  },
  selectedModes: [
    PlayMode.FOCUS,
    PlayMode.CLOZE,
    PlayMode.PARAPHRASE,
    PlayMode.SUMMARIZE,
    PlayMode.CLARIFY,
  ],
  allowedTypes: [
    PromptType.DESCRIPTIVE,
    PromptType.CONVERSATIONAL,
  ],
  audioEffects: {
    reverb: 0,
    echo: 0,
    backgroundNoise: 0,
    speedVariation: 0,
  },
}

export const useGameSessionDraftStore = create<IGameSessionDraftStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSessionName: (name) => {
        set({ sessionName: name })
      },

      setTotalRounds: (rounds) => {
        set({ totalRounds: rounds })
      },

      setMaxReplaysPerRound: (replays) => {
        set({ maxReplaysPerRound: replays })
      },

      setDifficulty: (difficulty) => {
        set({ difficulty })
      },

      togglePlayMode: (mode) => {
        set((state) => ({
          selectedModes: state.selectedModes.includes(mode)
            ? state.selectedModes.filter((m) => m !== mode)
            : [...state.selectedModes, mode],
        }))
      },

      togglePromptType: (type) => {
        set((state) => ({
          allowedTypes: state.allowedTypes.includes(type)
            ? state.allowedTypes.filter((t) => t !== type)
            : [...state.allowedTypes, type],
        }))
      },

      setResponseTimeLimit: (mode, value) => {
        set((state) => ({
          responseTimeLimits: {
            ...state.responseTimeLimits,
            [mode]: value,
          },
        }))
      },

      setAudioEffect: (effect, value) => {
        set((state) => ({
          audioEffects: {
            ...state.audioEffects,
            [effect]: value,
          },
        }))
      },

      reset: () => {
        set(initialState)
      },

      loadGameSession: (session) => {
        set((state) => ({
          ...state,
          ...session,
        }))
      },

      getSnapshot: () => {
        const state = get()
        return {
          sessionName: state.sessionName,
          totalRounds: state.totalRounds,
          maxReplaysPerRound: state.maxReplaysPerRound,
          difficulty: state.difficulty,
          responseTimeLimits: state.responseTimeLimits,
          selectedModes: state.selectedModes,
          allowedTypes: state.allowedTypes,
          audioEffects: state.audioEffects,
        }
      },
    }),
    {
      name: 'game-session-draft',
    }
  )
)

