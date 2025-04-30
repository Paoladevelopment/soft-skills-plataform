import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { FetchRoadmapsSummaryResponse } from "../types/roadmap/roadmap.api"
import { Roadmap } from "../types/roadmap/roadmap.models"

export async function getUserRoadmaps(
  offset: number, 
  limit: number
): Promise<FetchRoadmapsSummaryResponse> {
  const url = `${api.roadmap.getMine}?offset=${offset}&limit=${limit}`

  const response = await fetchWithAuth(url)
  return response
}


export async function getPublicRoadmaps(
  offset: number, 
  limit: number
): Promise<FetchRoadmapsSummaryResponse> {
  const url = `${api.roadmap.getPublic}?offset=${offset}&limit=${limit}`

  const response = await fetchWithAuth(url)
  return response
}

export async function getRoadmapById(id: string): Promise<Roadmap> {
  const url = api.roadmap.byId(id)
  const response = await fetchWithAuth(url)
  return response.data
}