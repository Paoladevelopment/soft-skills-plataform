import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { SelfEvaluationCreate, SelfEvaluationCreated, SelfEvaluationRead } from "../types/self-evaluation/self-evaluation.api"

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
  return response
}

export async function getSelfEvaluationsByUserId(userId: string): Promise<SelfEvaluationRead[]> {
  const url = api.selfEvaluations.byUserId(userId)

  const response = await fetchWithAuth(url)
  return response
}

export async function getSelfEvaluationsByTaskId(taskId: string): Promise<SelfEvaluationRead[]> {
  const url = api.selfEvaluations.byTaskId(taskId)

  const response = await fetchWithAuth(url)
  return response
}

