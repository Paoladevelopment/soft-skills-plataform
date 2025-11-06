import { PlayMode, PromptType } from './gameSession.models'

export interface FocusModePayload {
  question: string
  answerChoices: string[]
  instruction?: string
}

export interface ClozeModePayload {
  textWithBlanks: string
  instruction?: string
}

export interface TextModePayload {
  instruction: string
}

export type ModePayload = FocusModePayload | ClozeModePayload | TextModePayload

export interface CurrentRoundConfig {
  maxReplaysPerRound: number
  audioEffects: {
    reverb?: number
    echo?: number
    backgroundNoise?: number
    speedVariation?: number
  }
}

export interface CurrentRound {
  roundId: string
  audioUrl: string
  config: CurrentRoundConfig
  currentRound: number
  status: string
  playMode: PlayMode
  promptType: PromptType
  score: number | null
  maxScore: number
  modePayload: ModePayload
}

export interface SubmitAttemptResponse {
  roundNumber: number
  isCorrect: boolean
  score: number
  feedbackShort: string
  clientElapsedMs: number
  canAdvance: boolean
}

export interface AdvanceRoundResponse {
  currentRound: number
}

