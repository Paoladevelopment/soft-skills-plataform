import { CreateLearningGoalPayload } from "./learningGoals.api"
import { PaginationState } from "../pagination"
import { LearningGoal } from "./planner.models"

export interface ILearningGoal {
  learningGoals: LearningGoal[]
  isPaginating: boolean
  selectedGoalId: string | null

  isLoading: boolean

  learningGoalsPagination: PaginationState

  setLearningGoalsOffset: (offset: number) => void
  setLearningGoalsLimit: (limit: number) => void
  setLearningGoalsTotal: (total: number) => void

  setLearningGoals: (goals: LearningGoal[]) => void
  setIsPaginating: (value: boolean) => void

  setSelectedGoalId: (id: string) => void

  fetchLearningGoals: (offset?: number, limit?: number) => Promise<void>
  createLearningGoal: (payload: CreateLearningGoalPayload) => Promise<void>
  deleteLearningGoal: (id: string) => Promise<void>

  getSelectedGoal: () => LearningGoal | undefined
}