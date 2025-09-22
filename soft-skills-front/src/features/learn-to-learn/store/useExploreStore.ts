import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IExploreStore } from '../types/explore/explore.store'
import { SelectedFilters } from '../components/ui/DataFilter'

const initialState = {
  searchTerm: '',
  selectedFilters: {
    author: [],
    stepsRange: []
  },
  appliedFilters: {
    author: [],
    stepsRange: []
  },
  page: 1,
  pageSize: 12
}

export const useExploreStore = create<IExploreStore>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setSearchTerm: (searchTerm: string) => {
        set((state) => {
          state.searchTerm = searchTerm
          state.page = 1
        }, false, 'EXPLORE/SET_SEARCH_TERM')
      },

      setSelectedFilters: (filters: SelectedFilters) => {
        set((state) => {
          state.selectedFilters = filters
          state.appliedFilters = filters
          state.page = 1
        }, false, 'EXPLORE/SET_SELECTED_FILTERS')
      },

      updateFilter: (filterKey: string, values: string[]) => {
        set((state) => {
          state.selectedFilters[filterKey] = values
        }, false, 'EXPLORE/UPDATE_FILTER')
      },

      applyFilters: () => {
        set((state) => {
          state.appliedFilters = { ...state.selectedFilters }
          state.page = 1
        }, false, 'EXPLORE/APPLY_FILTERS')
      },

      setPage: (page: number) => {
        set((state) => {
          state.page = page
        }, false, 'EXPLORE/SET_PAGE')
      },

      setPageSize: (pageSize: number) => {
        set((state) => {
          state.pageSize = pageSize
          state.page = 1
        }, false, 'EXPLORE/SET_PAGE_SIZE')
      },

      clearFilters: () => {
        set((state) => {
          state.searchTerm = ''
          state.selectedFilters = {
            author: [],
            stepsRange: []
          }
          state.appliedFilters = {
            author: [],
            stepsRange: []
          }
          state.page = 1
        }, false, 'EXPLORE/CLEAR_FILTERS')
      },

      resetAll: () => {
        set((state) => {
          Object.assign(state, initialState)
        }, false, 'EXPLORE/RESET_ALL')
      }
    })),
    { name: 'exploreStore' }
  )
)
