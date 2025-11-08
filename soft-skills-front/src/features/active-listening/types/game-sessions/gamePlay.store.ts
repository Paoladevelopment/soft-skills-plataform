import { CurrentRound, AttemptFeedback } from './gamePlay.models'
import { SubmitAttemptPayloadAPI, ReplayStatus, ReplayAudioResult } from './gamePlay.api'

export interface IGamePlayStore {
  currentRound: CurrentRound | null
  isLoading: boolean
  isSubmitting: boolean
  isReplaying: boolean
  elapsedTime: number
  timerRunning: boolean
  error: string | null

  setCurrentRound: (round: CurrentRound | null) => void
  setIsLoading: (loading: boolean) => void
  setIsSubmitting: (submitting: boolean) => void
  setIsReplaying: (replaying: boolean) => void
  setError: (error: string | null) => void
  setElapsedTime: (time: number) => void
  setTimerRunning: (running: boolean) => void
  updateReplayCounters: (replayStatus: ReplayStatus) => void

  fetchCurrentRound: (sessionId: string) => Promise<void>
  replayAudio: (sessionId: string, roundNumber: number) => Promise<ReplayAudioResult>
  submitAttempt: (sessionId: string, payload: SubmitAttemptPayloadAPI) => Promise<AttemptFeedback | null>
  advanceRound: (sessionId: string) => Promise<void>
  reset: () => void
}

