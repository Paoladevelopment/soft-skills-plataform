import { GameSessionListItem, GameSession } from './gameSession.models'
import { CreateGameSessionRequest, UpdateGameSessionRequest, UpdateGameSessionConfigRequest, StartGameSessionResponse } from './gameSession.api'

export interface GameSessionsPagination {
  total: number
  offset: number
  limit: number
}

export interface IGameSessionStore {
  gameSessions: GameSessionListItem[]
  selectedGameSession: GameSession | null
  isLoading: boolean
  gameSessionsPagination: GameSessionsPagination

  setGameSessions: (gameSessions: GameSessionListItem[]) => void
  setSelectedGameSession: (gameSession: GameSession | null) => void
  setGameSessionsOffset: (offset: number) => void
  setGameSessionsLimit: (limit: number) => void
  setGameSessionsTotal: (total: number) => void

  fetchGameSessions: (offset?: number, limit?: number) => Promise<void>
  getGameSessionById: (id: string) => Promise<void>
  createGameSession: (sessionData: CreateGameSessionRequest) => Promise<void>
  updateGameSession: (id: string, sessionData: UpdateGameSessionRequest) => Promise<void>
  updateGameSessionConfig: (id: string, sessionData: UpdateGameSessionConfigRequest) => Promise<void>
  deleteGameSession: (id: string) => Promise<void>
  startGameSession: (id: string) => Promise<StartGameSessionResponse | undefined>
}
