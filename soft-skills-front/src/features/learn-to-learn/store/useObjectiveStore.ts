import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IObjectiveStore, ObjectiveFilters } from '../types/planner/objective.store'
import { TabValue } from '../types/ui/filter.types'

export const useObjectiveStore = create<IObjectiveStore>()(
  devtools(
    immer(
      (set) => ({
        selectedTab: 'all',
        searchTerm: '',
        selectedFilters: {
          priority: [],
          status: []
        },
        objectivesPagination: {
          total: 0,
          offset: 0,
          limit: 10,
        },

        setSelectedTab: (tab: TabValue) => {
          set((state) => {
            state.selectedTab = tab
            state.objectivesPagination.offset = 0
            
            if (tab !== 'all') {
              state.selectedFilters.status = []
            }

          }, false, 'OBJECTIVE/SET_SELECTED_TAB')
        },

        setSearchTerm: (searchTerm: string) => {
          set((state) => {
            state.searchTerm = searchTerm
            state.objectivesPagination.offset = 0
          }, false, 'OBJECTIVE/SET_SEARCH_TERM')
        },

        setSelectedFilters: (filters: ObjectiveFilters) => {
          set((state) => {
            state.selectedFilters = filters
            state.objectivesPagination.offset = 0
          }, false, 'OBJECTIVE/SET_SELECTED_FILTERS')
        },

        updateFilter: (filterKey: string, values: string[]) => {
          set((state) => {
            state.selectedFilters[filterKey] = values
            state.objectivesPagination.offset = 0
          }, false, 'OBJECTIVE/UPDATE_FILTER')
        },

        setObjectivesOffset: (offset: number) => {
          set((state) => {
            state.objectivesPagination.offset = offset
          }, false, 'OBJECTIVE/SET_OBJECTIVES_OFFSET')
        },

        setObjectivesLimit: (limit: number) => {
          set((state) => {
            state.objectivesPagination.limit = limit
            state.objectivesPagination.offset = 0
          }, false, 'OBJECTIVE/SET_OBJECTIVES_LIMIT')
        },

        setObjectivesTotal: (total: number | undefined) => {
          set((state) => {
            if (total !== undefined) {
              state.objectivesPagination.total = total
            }
          }, false, 'OBJECTIVE/SET_OBJECTIVES_TOTAL')
        },

        resetPagination: () => {
          set((state) => {
            state.objectivesPagination.offset = 0
            state.objectivesPagination.total = 0
          }, false, 'OBJECTIVE/RESET_PAGINATION')
        },

        resetFilters: () => {
          set((state) => {
            state.selectedFilters = {
              priority: [],
              status: []
            }
            state.searchTerm = ''
            state.objectivesPagination.offset = 0
          }, false, 'OBJECTIVE/RESET_FILTERS')
        },

        resetAll: () => {
          set((state) => {
            state.selectedTab = 'all'
            state.searchTerm = ''

            state.selectedFilters = {
              priority: [],
              status: []
            }
            
            state.objectivesPagination = {
              total: 0,
              offset: 0,
              limit: 10,
            }
          }, false, 'OBJECTIVE/RESET_ALL')
        }
      })
    ),
    { name: 'objectiveStore' }
  )
)
