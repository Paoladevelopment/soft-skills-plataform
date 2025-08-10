import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ILearningGoal } from '../types/planner/learningGoal.store'
import { getUserLearningGoals, createLearningGoal, deleteLearningGoal } from '../api/LearningGoals'
import { LearningGoal } from '../types/planner/planner.models'
import { transformGoalResponse } from '../utils/transform'
import { CreateLearningGoalPayload } from '../types/planner/learningGoals.api'
import { useToastStore } from '../../../store/useToastStore'

export const useLearningGoalStore = create<ILearningGoal>()(
  devtools(
    immer(
      (set, get) => ({
        learningGoals: [],
        isPaginating: false,
        selectedGoalId: null,
        isLoading: false,

        learningGoalsPagination: {
          total: 0,
          offset: 0,
          limit: 10,
        },

        setLearningGoals: (goals: LearningGoal[]) => {
          set((state) => {
            state.learningGoals = goals
          }, false, 'LEARNING_GOAL/SET_LEARNING_GOALS')
        },

        setIsPaginating: (value: boolean) => {
          set((state) => {
            state.isPaginating = value
          }, false, 'SET_IS_PAGINATING')
        },   
        
        setSelectedGoalId: (id: string) => {
          set((state) => {
            state.selectedGoalId = id
          }, false, "SET_SELECTED_GOAL_ID") 
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

        getSelectedGoal: () => {
          const {learningGoals, selectedGoalId} = get()
          return learningGoals.find(goal => goal.id === selectedGoalId)
        },

        fetchLearningGoals: async (offset?: number, limit?: number) => {
          const currentOffset = offset ?? get().learningGoalsPagination.offset
          const currentLimit = limit ?? get().learningGoalsPagination.limit

          set((state) => {
            state.isLoading = true
          }, false, 'LEARNING_GOAL/FETCH_LEARNING_GOALS_REQUEST')

          try {
            const {data: goals, total}  = await getUserLearningGoals(currentOffset, currentLimit)
            const transformedGoals = goals.map(transformGoalResponse)

            get().setLearningGoals(transformedGoals)
            get().setLearningGoalsTotal(total)

          } catch (err: unknown) {
            if (err instanceof Error) {
              useToastStore.getState().showToast(err.message || 'Error fetching goals', 'error')
            }
          } finally {
            set((state) => {
              state.isLoading = false
              state.isPaginating = false
            }, false, 'LEARNING_GOAL/FETCH_LEARNING_GOALS_COMPLETE')
          }
        },

        createLearningGoal: async (payload: CreateLearningGoalPayload) => {
          try {
            const { data, message } = await createLearningGoal(payload)
            const newGoal = transformGoalResponse(data)
        
            set((state) => {
              state.learningGoals.unshift(newGoal)
            }, false, 'LEARNING_GOAL/CREATE_LEARNING_GOAL_SUCCESS')

            useToastStore.getState().showToast(message || `${payload.title} added to your learning goals.`, 'success')
          } catch (err: unknown) {
            if (err instanceof Error) {
              useToastStore.getState().showToast(err.message || 'Error creating goal', 'error')
            }
          }
        },

        deleteLearningGoal: async (id: string) => {
          try {
            const { message } = await deleteLearningGoal(id)

            set((state) => {
              state.learningGoals = state.learningGoals.filter(goal => goal.id !== id)

              const { offset, limit, total } = state.learningGoalsPagination
              const remainingItems = total - 1

              const isPageEmpty = offset >= remainingItems && offset !== 0
              if (isPageEmpty) {
                state.learningGoalsPagination.offset = offset - limit
              }
              
              state.learningGoalsPagination.total = remainingItems
            }, false, 'LEARNING_GOAL/DELETE_LEARNING_GOAL_SUCCESS')

            useToastStore.getState().showToast(message || 'Goal deleted successfully', 'success')
          } catch (err: unknown) {
            if (err instanceof Error) {
              useToastStore.getState().showToast(err.message || 'Error deleting goal', 'error')
            }
          }
        }
      })
    ),
    { name: 'learningGoalStore' }
  )
)
