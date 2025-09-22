import { SelectedFilters } from "../../components/ui/DataFilter"

export interface IExploreStore {
  searchTerm: string
  selectedFilters: SelectedFilters
  appliedFilters: SelectedFilters
  page: number
  pageSize: number
  
  setSearchTerm: (searchTerm: string) => void
  setSelectedFilters: (filters: SelectedFilters) => void
  updateFilter: (filterKey: string, values: string[]) => void
  applyFilters: () => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  clearFilters: () => void
  resetAll: () => void
}
