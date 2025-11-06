import { CurrentRound } from './gamePlay.models'
import { SubmitAttemptPayloadAPI } from './gamePlay.api'

export interface IGamePlayStore {
  currentRound: CurrentRound | null
  isLoading: boolean
  isSubmitting: boolean
  replayCount: number
  elapsedTime: number
  timerRunning: boolean
  error: string | null

  setCurrentRound: (round: CurrentRound | null) => void
  setIsLoading: (loading: boolean) => void
  setIsSubmitting: (submitting: boolean) => void
  setError: (error: string | null) => void
  incrementReplayCount: () => void
  resetReplayCount: () => void
  setElapsedTime: (time: number) => void
  setTimerRunning: (running: boolean) => void

  fetchCurrentRound: (sessionId: string) => Promise<void>
  submitAttempt: (sessionId: string, payload: SubmitAttemptPayloadAPI) => Promise<{ isCorrect: boolean; feedbackShort: string; canAdvance: boolean }>
  advanceRound: (sessionId: string) => Promise<void>
  reset: () => void
}

