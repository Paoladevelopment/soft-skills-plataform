import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { 
  CreateOrUpdatePomodoroPreferencesPayload,
  CreateOrUpdatePomodoroPreferencesResponse,
  GetPomodoroPreferencesResponse
} from "../types/pomodoroPreferences/pomodoroPreferences.api"

export async function getPomodoroPreferences(): Promise<GetPomodoroPreferencesResponse> {
  const response = await fetchWithAuth(api.pomodoroPreferences.get)
  return response
}

export async function createOrUpdatePomodoroPreferences(
  payload: CreateOrUpdatePomodoroPreferencesPayload
): Promise<CreateOrUpdatePomodoroPreferencesResponse> {
  const response = await fetchWithAuth(api.pomodoroPreferences.createOrUpdate, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response.data
}
