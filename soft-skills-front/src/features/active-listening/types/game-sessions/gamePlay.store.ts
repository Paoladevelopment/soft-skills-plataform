import { CurrentRound, AttemptFeedback } from './gamePlay.models'
import { SubmitAttemptPayloadAPI, ReplayStatus, ReplayAudioResult, FinishSessionResponse } from './gamePlay.api'
import { GameSessionResult } from '../gameSessionResult'

export interface IGamePlayStore {
  currentRound: CurrentRound | null
  isLoading: boolean
  isSubmitting: boolean
  isReplaying: boolean
  elapsedTime: number
  timerRunning: boolean
  error: string | null
  result: GameSessionResult | null

  setCurrentRound: (round: CurrentRound | null) => void
  setIsLoading: (loading: boolean) => void
  setIsSubmitting: (submitting: boolean) => void
  setIsReplaying: (replaying: boolean) => void
  setError: (error: string | null) => void
  setElapsedTime: (time: number) => void
  setTimerRunning: (running: boolean) => void
  setResult: (result: GameSessionResult | null) => void
  updateReplayCounters: (replayStatus: ReplayStatus) => void

  fetchCurrentRound: (sessionId: string) => Promise<void>
  replayAudio: (sessionId: string, roundNumber: number) => Promise<ReplayAudioResult>
  submitAttempt: (sessionId: string, payload: SubmitAttemptPayloadAPI) => Promise<AttemptFeedback | null>
  advanceRound: (sessionId: string) => Promise<void>
  finishSession: (sessionId: string) => Promise<FinishSessionResponse | null>
  fetchSessionResult: (sessionId: string) => Promise<void>
  reset: () => void
}

