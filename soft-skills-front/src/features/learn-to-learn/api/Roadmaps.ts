import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { CreateRoadmapPayload, FetchRoadmapsSummaryResponse } from "../types/roadmap/roadmap.api"
import { Roadmap } from "../types/roadmap/roadmap.models"
import { normalizeLayoutNodes } from "../utils/roadmap/roadmap_serializers"
import snakecaseKeys from 'snakecase-keys'

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

export async function createRoadmap(
  payload: CreateRoadmapPayload
): Promise<Roadmap> {
  const response = await fetchWithAuth(api.roadmap.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function deleteRoadmap(id: string): Promise<{ message: string }> {
  const url = api.roadmap.byId(id)

  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  return response
}

export async function updateRoadmap(
  id: string,
  payload: Roadmap
): Promise<Roadmap> {
  const url = api.roadmap.byId(id)

  const {
    title,
    description,
    objectives,
    visibility,
    layout,
  } = payload

  const normalizedLayout = layout
  ? {
      nodes: normalizeLayoutNodes(layout.nodes),
      edges: layout.edges,
    }
  : undefined

  const body = {
    title,
    description,
    objectives,
    visibility,
    layout: normalizedLayout,
  }

  const snakeCaseBody = snakecaseKeys(body, { deep: true })

  const response = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snakeCaseBody),
  })

  return response.data
}