import { RoundStatus } from './game-sessions/gameSession.enums'
import { ModePayload, Evaluation } from './game-sessions/gamePlay.models'

export interface GetSessionResultResponse {
  message: string
  data: GameSessionResult
}

export interface RoundRecap {
  roundId: string
  roundNumber: number
  status: RoundStatus
  playMode: string | null
  promptType: string | null
  audioUrl: string | null
  score: number | null
  maxScore: number
  modePayload: ModePayload | null
  evaluation: Evaluation | null 
  replaysUsed: number
  replaysLeft: number
  maxReplaysPerRound: number
}

export interface GameSessionResult {
  sessionCompleted: boolean
  finalScore: number
  finalMaxScore: number
  startedAt: string 
  finishedAt: string 
  totalRounds: number
  name: string
  rounds: RoundRecap[]
}

