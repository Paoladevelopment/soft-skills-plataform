import { PaginationState } from "../pagination"
import { Roadmap, RoadmapSummary } from "./roadmap.models"

export interface IRoadmapStore {
  selectedRoadmap: Roadmap | null
  selectedRoadmapSteps: number

  myRoadmaps: RoadmapSummary[]
  publicRoadmaps: RoadmapSummary[]

  isLoading: boolean

  myRoadmapsPagination: PaginationState
  publicRoadmapsPagination: PaginationState

  setMyRoadmaps: (roadmaps: RoadmapSummary[]) => void
  setPublicRoadmaps: (roadmaps: RoadmapSummary[]) => void

  setSelectedRoadmap: (roadmap: Roadmap | null) => void
  setSelectedRoadmapSteps: (stepsCount: number) => void

  setMyRoadmapsOffset: (offset: number) => void
  setPublicRoadmapsOffset: (offset: number) => void

  setMyRoadmapsLimit: (limit: number) => void
  setPublicRoadmapsLimit: (limit: number) => void

  setMyRoadmapsTotal: (total: number) => void
  setPublicRoadmapsTotal: (total: number) => void

  fetchMyRoadmaps: (offset?: number, limit?: number) => Promise<void>
  fetchPublicRoadmaps: (offset?: number, limit?: number) => Promise<void>

  getRoadmapById: (id: string) => Promise<void>
  deleteRoadmap: (id: string) => Promise<void>
}