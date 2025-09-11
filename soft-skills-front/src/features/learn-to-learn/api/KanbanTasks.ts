import { fetchWithAuth } from '../../../utils/fetchWithAuth'
import { api } from '../../../config/api'
import { KanbanApiResponse } from '../types/kanban/task.api'

export const fetchKanbanTasks = async (objectiveId: string): Promise<KanbanApiResponse> => {
  const url = api.objectives.kanban(objectiveId)
  const response = await fetchWithAuth(url)
  return response
}
