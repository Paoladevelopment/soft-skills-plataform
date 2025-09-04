import { PaginationState } from "../pagination"
import { TabValue } from "../ui/filter.types"

export type ObjectiveFilters = Record<string, string[]>

export interface IObjectiveStore {
  selectedTab: TabValue
  searchTerm: string
  selectedFilters: ObjectiveFilters
  objectivesPagination: PaginationState

  setSelectedTab: (tab: TabValue) => void
  setSearchTerm: (searchTerm: string) => void
  setSelectedFilters: (filters: ObjectiveFilters) => void
  updateFilter: (filterKey: string, values: string[]) => void
  
  setObjectivesOffset: (offset: number) => void
  setObjectivesLimit: (limit: number) => void
  setObjectivesTotal: (total: number | undefined) => void
  resetPagination: () => void
  
  resetFilters: () => void
  resetAll: () => void
}