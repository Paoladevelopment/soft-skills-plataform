import { RoadmapSummary } from "./roadmap.models";

export interface FetchRoadmapsSummaryResponse {
  data: RoadmapSummary[]
  total: number
}
export interface CreateRoadmapPayload {
  title: string
  description: string
}