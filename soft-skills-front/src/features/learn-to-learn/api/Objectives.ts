import { fetchWithAuth } from '../../../utils/fetchWithAuth'
import { api } from '../../../config/api'
import { CreateObjectivePayload, CreateObjectiveResponse } from '../types/planner/objectives.api'

export const createObjective = async (
  payload: CreateObjectivePayload
): Promise<CreateObjectiveResponse> => {
  const url = api.objectives.create
  
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return response
}
