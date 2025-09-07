import { PaginationState } from "../pagination"

export interface ILearningGoal {
  selectedGoalId: string | null
  selectedGoalTitle: string | null
  isPaginating: boolean
  learningGoalsPagination: PaginationState

  setSelectedGoalId: (id: string | null) => void
  setSelectedGoalTitle: (title: string | null) => void
  setIsPaginating: (value: boolean) => void
  setLearningGoalsOffset: (offset: number) => void
  setLearningGoalsLimit: (limit: number) => void
  setLearningGoalsTotal: (total: number) => void
  resetPagination: () => void
  clearSelectedGoal: () => void
}