import { CreateLearningGoalPayload } from "./learningGoals.api"
import { PaginationState } from "../pagination"
import { Objective } from "./planner.models"

export interface IObjective {
  objectives: Objective[]
  isPaginating: boolean
  selectedObjectiveId: string | null

  isLoading: boolean

  objectivesPagination: PaginationState

  setObjectivesOffset: (offset: number) => void
  setObjectivesLimit: (limit: number) => void
  setObjectivesTotal: (total: number) => void

  setObjectives: (objectives: Objective[]) => void

  setIsPaginating: (value: boolean) => void

  fetchObjectives: (offset?: number, limit?: number) => Promise<void>
  createObjective: (payload: CreateLearningGoalPayload) => Promise<void>
  deleteObjective: (id: string) => Promise<void>
}