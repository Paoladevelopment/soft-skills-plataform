import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import {
  CreateLearningGoalPayload,
  CreateLearningGoalResponse,
  DeleteLearningGoalResponse,
  FetchLearningGoalResponse,
} from '../types/planner/learningGoals.api'

export async function getUserLearningGoals(
  offset: number, 
  limit: number
): Promise<FetchLearningGoalResponse> {
  const url = `${api.learningGoals.getAllByUser}?offset=${offset}&limit=${limit}`

  const response = await fetchWithAuth(url)
  return response
}

export async function createLearningGoal(
  payload: CreateLearningGoalPayload
): Promise<CreateLearningGoalResponse> {
   const url = `${api.learningGoals.create}`

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return response
}

export async function deleteLearningGoal(
  id: string
): Promise<DeleteLearningGoalResponse> {
  const url = api.learningGoals.byId(id)

  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  return response
}