import { api } from "../config/api"
import { fetchWithAuth } from "../utils/fetchWithAuth"
import { ModulesResponse } from "../types/modules.api"

export async function getAllModules(
  offset: number = 0,
  limit: number = 10
): Promise<ModulesResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  })

  const url = `${api.modules.getAll}?${params.toString()}`

  const response = await fetchWithAuth(url)
  return response
}