import { fetchWithAuth } from '../../../utils/fetchWithAuth'
import { api } from '../../../config/api'
import { SubmitAttemptPayloadAPI, GetCurrentRoundResponse, SubmitAttemptResponseAPI, AdvanceRoundResponse } from '../types/game-sessions/gamePlay.api'

export function handleBlankChange(
  index: number,
  value: string,
  filledBlanks: string[],
  setFilledBlanks: (blanks: string[]) => void
): void {
  const newBlanks = [...filledBlanks]
  newBlanks[index] = value
  setFilledBlanks(newBlanks)
}

export async function getCurrentRound(sessionId: string): Promise<GetCurrentRoundResponse> {
  const url = api.gameSessions.rounds.current(sessionId)

  const response = await fetchWithAuth(url)

  return response
}

export async function submitAttempt(
  sessionId: string,
  roundNumber: number,
  payload: SubmitAttemptPayloadAPI
): Promise<SubmitAttemptResponseAPI> {
  const url = api.gameSessions.rounds.attempt(sessionId, roundNumber)

  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
}

export async function advanceRound(sessionId: string): Promise<AdvanceRoundResponse> {
  const url = api.gameSessions.rounds.next(sessionId)

  const response = await fetchWithAuth(url, {
    method: 'POST',
  })
  
  return response
}

