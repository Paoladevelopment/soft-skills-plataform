import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import {
  CreateLearningGoalPayload,
  CreateLearningGoalResponse,
  DeleteLearningGoalResponse,
  FetchLearningGoalsResponse,
  FetchLearningGoalResponse,
  UpdateLearningGoalPayload,
  UpdateLearningGoalResponse,
  ConvertToRoadmapResponse,
} from '../types/planner/learningGoals.api'
import { FetchObjectivesResponse } from '../types/planner/objectives.api'

export async function getUserLearningGoals(
  offset: number, 
  limit: number
): Promise<FetchLearningGoalsResponse> {
  const url = `${api.learningGoals.getAllByUser}?offset=${offset}&limit=${limit}`

  const response = await fetchWithAuth(url)
  return response
}

export async function getLearningGoalById(
  id: string
): Promise<FetchLearningGoalResponse> {
  const url = api.learningGoals.byId(id)

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

export async function updateLearningGoal(
  id: string,
  payload: UpdateLearningGoalPayload
): Promise<UpdateLearningGoalResponse> {
  const url = api.learningGoals.byId(id)

  const response = await fetchWithAuth(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })

  return response
}

export async function getObjectivesByLearningGoal(
  learningGoalId: string,
  offset: number = 0,
  limit: number = 10,
  status?: string,
  priority?: string[],
  search?: string,
  orderBy?: string[]
): Promise<FetchObjectivesResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  })

  if (status) params.append('status', status)

  if (priority && priority.length > 0) {
    priority.forEach(item => params.append('priority', item))
  }

  if (search) params.append('search', search)
    
  if (orderBy && orderBy.length > 0) {
    orderBy.forEach(item => params.append('order_by', item))
  }

  const url = `${api.learningGoals.getObjectives(learningGoalId)}?${params.toString()}`

  const response = await fetchWithAuth(url)
  return response
}

export async function convertLearningGoalToRoadmap(
  learningGoalId: string
): Promise<ConvertToRoadmapResponse> {
  const url = api.learningGoals.convertToRoadmap(learningGoalId)

  const response = await fetchWithAuth(url, {
    method: "POST",
  })

  return response
}