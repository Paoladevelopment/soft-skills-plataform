import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IRoadmapStore } from '../types/roadmap/roadmap.store'
import { useToastStore } from '../../../store/useToastStore'
import { Roadmap, RoadmapSummary } from '../types/roadmap/roadmap.models'
import { getPublicRoadmaps, getRoadmapById, getUserRoadmaps } from '../api/Roadmaps'

export const useRoadmapStore = create<IRoadmapStore>()(
  devtools(
    immer((set, get) => ({
      myRoadmaps: [],
      publicRoadmaps: [],
      isLoading: false,

      myRoadmapsPagination: {
        total: 0,
        offset: 0,
        limit: 10,
      },

      publicRoadmapsPagination: {
        offset: 0,
        limit: 10,
        total: 0,
      },

      selectedRoadmap: null,
      selectedRoadmapSteps: 0,

      setMyRoadmaps: (roadmaps: RoadmapSummary[]) => {
        set((state) => {
          state.myRoadmaps = roadmaps
        }, false, 'ROADMAP/SET_MY_ROADMAPS')
      },

      setPublicRoadmaps: (roadmaps: RoadmapSummary[]) => {
        set((state) => {
          state.publicRoadmaps = roadmaps
        }, false, 'ROADMAP/SET_PUBLIC_ROADMAPS')
      },

      setMyRoadmapsOffset: (offset: number) => {
        set((state) => {
          state.myRoadmapsPagination.offset = offset
        }, false, 'ROADMAP/SET_MY_OFFSET')
      },

      setPublicRoadmapsOffset: (offset: number) => {
        set((state) => {
          state.publicRoadmapsPagination.offset = offset
        }, false, 'ROADMAP/SET_PUBLIC_OFFSET')
      },

      setMyRoadmapsLimit: (limit: number) => {
        set((state) => {
          state.myRoadmapsPagination.limit = limit
        }, false, 'ROADMAP/SET_MY_LIMIT')
      },

      setPublicRoadmapsLimit: (limit: number) => {
        set((state) => {
          state.publicRoadmapsPagination.limit = limit
        }, false, 'ROADMAP/SET_PUBLIC_LIMIT')
      },

      setMyRoadmapsTotal: (total: number) => {
        set((state) => {
          state.myRoadmapsPagination.total = total
        }, false, 'ROADMAP/SET_MY_TOTAL')
      },

      setPublicRoadmapsTotal: (total: number) => {
        set((state) => {
          state.publicRoadmapsPagination.total = total
        }, false, 'ROADMAP/SET_PUBLIC_TOTAL')
      },

      setSelectedRoadmap: (roadmap: Roadmap | null) => {
        set((state) => {
          state.selectedRoadmap = roadmap
        }, false, 'ROADMAP/SET_SELECTED_ROADMAP')
      },

      setSelectedRoadmapSteps: (stepsCount: number) => {
        set((state) => {
          state.selectedRoadmapSteps = stepsCount
        }, false, 'ROADMAP/SET_SELECTED_ROADMAP_STEPS')
      },

      fetchMyRoadmaps: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().myRoadmapsPagination.offset
        const currentLimit = limit ?? get().myRoadmapsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_MY_REQUEST')

        try {
          const { data, total } = await getUserRoadmaps(currentOffset, currentLimit)

          get().setMyRoadmaps(data)
          get().setMyRoadmapsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching your roadmaps', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_MY_COMPLETE')
        }
      },

      fetchPublicRoadmaps: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().publicRoadmapsPagination.offset
        const currentLimit = limit ?? get().publicRoadmapsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_PUBLIC_REQUEST')

        try {
          const { data, total } = await getPublicRoadmaps(currentOffset, currentLimit)

          get().setPublicRoadmaps(data)
          get().setPublicRoadmapsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching public roadmaps', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_PUBLIC_COMPLETE')
        }
      },

      getRoadmapById: async (id: string) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_BY_ID_REQUEST')
      
        try {
          const roadmap = await getRoadmapById(id)
          const stepsCount = roadmap.objectives.reduce((acc, obj) => acc + obj.tasks.length, 0)
      
          get().setSelectedRoadmap(roadmap)
          get().setSelectedRoadmapSteps(stepsCount)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching roadmap', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_BY_ID_COMPLETE')
        }
      },

      deleteRoadmap: async (id: string) => {
        console.log(id)
      }
    })),

    { name: 'roadmapStore' }
  )
)