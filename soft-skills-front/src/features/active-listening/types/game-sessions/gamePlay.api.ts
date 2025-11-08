import { CurrentRound, SubmitAttemptResponse } from './gamePlay.models'

export type AnswerPayload = 
  | { selected_index: number }
  | { blanks: string[] }
  | { paraphrase: string }
  | { summary: string }
  | { questions: string[] }

export interface SubmitAttemptPayloadAPI {
  answer_payload: AnswerPayload
  client_elapsed_ms: number
  idempotency_key?: string
}

export interface GetCurrentRoundResponse {
  message: string
  data: CurrentRound
}

export interface SubmitAttemptResponseAPI {
  message: string
  data: SubmitAttemptResponse
}

export interface AdvanceRoundResponse {
  message: string
  data: CurrentRound
}

export interface ReplayStatus {
  requestAccepted: boolean
  canReplayNext: boolean
  replaysUsed: number
  replaysLeft: number
  maxReplaysPerRound: number
}

export interface ReplayResponse {
  message: string
  data: ReplayStatus
}

export interface ReplayAudioResult {
  requestAccepted: boolean
  canReplayNext: boolean
  replayStatus: ReplayStatus | null
}

