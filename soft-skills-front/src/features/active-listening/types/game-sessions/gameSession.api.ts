import { GameSession, GameSessionListItem, PromptType, GameSessionDifficulty, PlayMode } from './gameSession.models'

export interface GetGameSessionResponse {
  message: string
  data: GameSession
}

export interface GetGameSessionsResponse {
  message: string
  data: GameSessionListItem[]
  total: number
  offset: number
  limit: number
}

export interface ResponseTimeLimitsPayload {
  [mode: string]: number
}

export interface AudioEffectsPayload {
  [effect: string]: number
}

export interface GameSessionConfigPayload {
  total_rounds: number
  max_replays_per_round: number
  difficulty: GameSessionDifficulty
  response_time_limits: ResponseTimeLimitsPayload
  selected_modes: PlayMode[]
  allowed_types: PromptType[]
  audio_effects: AudioEffectsPayload
}

export interface CreateGameSessionRequest {
  name: string
  config: GameSessionConfigPayload
}

export interface CreateGameSessionResponse {
  message: string
  data: GameSession
}

export interface UpdateGameSessionRequest {
  name?: string
  status?: string
}

export interface UpdateGameSessionConfigRequest {
  config: Partial<GameSessionConfigPayload>
}

export interface UpdateGameSessionResponse {
  message: string
  data: GameSession
}

