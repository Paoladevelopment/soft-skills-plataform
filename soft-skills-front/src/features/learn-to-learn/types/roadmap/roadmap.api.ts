import { RoadmapSummary } from "./roadmap.models";

export interface FetchRoadmapsSummaryResponse {
  data: RoadmapSummary[]
  total: number
}

export interface CreateRoadmapPayload {
  title: string
  description: string
}

export interface PublicRoadmapsParams {
  search?: string
  authorId?: string
  minSteps?: number
  maxSteps?: number
  offset?: number
  limit?: number
}

export interface CopyRoadmapResponse {
  message: string
  roadmapId: string
}

export interface ConvertToLearningGoalResponse {
  message: string
  learningGoalId: string
}