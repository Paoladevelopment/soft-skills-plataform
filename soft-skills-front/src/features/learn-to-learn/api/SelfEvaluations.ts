import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { SelfEvaluationCreate, SelfEvaluationCreated, SelfEvaluationRead, FetchSelfEvaluationsApiResponse } from "../types/self-evaluation/self-evaluation.api"

export async function createSelfEvaluation(
  payload: SelfEvaluationCreate
): Promise<SelfEvaluationCreated> {
  const url = api.selfEvaluations.create

  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response
}

export async function getSelfEvaluationById(evaluationId: string): Promise<SelfEvaluationRead> {
  const url = api.selfEvaluations.byId(evaluationId)

  const response = await fetchWithAuth(url)

  return response.data
}

export async function getSelfEvaluationsByUserId(
  userId: string,
  offset?: number,
  limit?: number,
  sortBy?: string,
  difficulty?: string,
  mood?: string
): Promise<FetchSelfEvaluationsApiResponse> {
  const params = new URLSearchParams()

  if (offset !== undefined) params.append('offset', offset.toString())
  if (limit !== undefined) params.append('limit', limit.toString())
  if (sortBy) params.append('sort_by', sortBy)
  if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty)
  if (mood && mood !== 'All') params.append('mood', mood)

  const url = params.toString() 
    ? `${api.selfEvaluations.byUserId(userId)}?${params.toString()}`
    : api.selfEvaluations.byUserId(userId)

  const response = await fetchWithAuth(url)
  
  return response
}

