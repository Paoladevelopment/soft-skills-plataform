import { RoadmapSummary } from "./roadmap.models";

export interface FetchRoadmapsSummaryResponse {
  data: RoadmapSummary[]
  total: number
}