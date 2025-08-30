import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ILearningGoal } from '../types/planner/learningGoal.store'

export const useLearningGoalStore = create<ILearningGoal>()(
  devtools(
    immer(
      (set) => ({
        selectedGoalId: null,
        isPaginating: false,
        learningGoalsPagination: {
          total: 0,
          offset: 0,
          limit: 10,
        },

        setSelectedGoalId: (id: string | null) => {
          set((state) => {
            state.selectedGoalId = id
          }, false, "SET_SELECTED_GOAL_ID")
        },

        setIsPaginating: (value: boolean) => {
          set((state) => {
            state.isPaginating = value
          }, false, 'SET_IS_PAGINATING')
        },

        setLearningGoalsOffset: (offset: number) => {
          set((state) => {
            state.learningGoalsPagination.offset = offset
          }, false, 'LEARNING_GOAL/SET_LEARNING_GOALS_OFFSET')
        },

        setLearningGoalsLimit: (limit: number) => {
          set((state) => {
            state.learningGoalsPagination.limit = limit
          }, false, 'LEARNING_GOAL/SET_LEARNING_GOALS_LIMIT')
        },

        setLearningGoalsTotal: (total: number) => {
          set((state) => {
            state.learningGoalsPagination.total = total
          }, false, 'LEARNING_GOAL/SET_LEARNING_GOALS_TOTAL')
        },

        resetPagination: () => {
          set((state) => {
            state.learningGoalsPagination.offset = 0
            state.learningGoalsPagination.total = 0
          }, false, 'LEARNING_GOAL/RESET_PAGINATION')
        },

        clearSelectedGoal: () => {
          set((state) => {
            state.selectedGoalId = null
          }, false, 'LEARNING_GOAL/CLEAR_SELECTED_GOAL')
        }
      })
    ),
    { name: 'learningGoalStore' }
  )
)
