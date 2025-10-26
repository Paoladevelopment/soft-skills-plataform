import { fetchWithAuth } from '../../../utils/fetchWithAuth'
import { api } from '../../../config/api'
import { 
  GetGameSessionsResponse, 
  GetGameSessionResponse, 
  CreateGameSessionRequest, 
  UpdateGameSessionRequest, 
  UpdateGameSessionConfigRequest, 
  CreateGameSessionResponse, 
  UpdateGameSessionResponse 
} from '../types/game-sessions/gameSession.api'

export async function getUserGameSessions(
  offset: number,
  limit: number
): Promise<GetGameSessionsResponse> {
  const response = await fetchWithAuth(api.gameSessions.getAll(offset, limit))
  return response
}

export async function getGameSessionById(id: string): Promise<GetGameSessionResponse> {
  const response = await fetchWithAuth(api.gameSessions.byId(id))
  return response
}

export async function createGameSession(sessionData: CreateGameSessionRequest): Promise<CreateGameSessionResponse> {
  const response = await fetchWithAuth(api.gameSessions.create, {
    method: 'POST',
    body: JSON.stringify(sessionData),
  })

  return response
}

export async function updateGameSession(id: string, sessionData: UpdateGameSessionRequest): Promise<UpdateGameSessionResponse> {
  const response = await fetchWithAuth(api.gameSessions.update(id), {
    method: 'PATCH',
    body: JSON.stringify(sessionData),
  })

  return response
}

export async function updateGameSessionConfig(id: string, sessionData: UpdateGameSessionConfigRequest): Promise<UpdateGameSessionResponse> {
  const response = await fetchWithAuth(api.gameSessions.updateConfig(id), {
    method: 'PATCH',
    body: JSON.stringify(sessionData.config),
  })

  return response
}

export async function deleteGameSession(id: string): Promise<{ message: string }> {
  const response = await fetchWithAuth(api.gameSessions.delete(id), {
    method: 'DELETE',
  })
  
  return response
}

