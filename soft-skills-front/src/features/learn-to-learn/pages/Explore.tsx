import {
  Box,
  Typography,
  Grid2,
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RoadmapCard from '../components/roadmap/RoadmapCard'
import { usePublicRoadmaps } from '../hooks/usePublicRoadmaps'
import { useDebounce } from '../hooks/useDebounce'
import EmptyState from '../components/ui/EmptyState'
import PaginationControls from '../components/PaginationControls'
import DataFilter from '../components/ui/DataFilter'
import ActiveFilters from '../components/ui/ActiveFilters'
import { FilterOption } from '../types/ui/filter.types'
import { useExploreStore } from '../store/useExploreStore'

const Explore = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    searchTerm,
    selectedFilters,
    appliedFilters,
    page,
    pageSize,
    setSearchTerm,
    updateFilter,
    applyFilters,
    setPage,
    setPageSize,
    clearFilters
  } = useExploreStore()

  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlAuthor = searchParams.get('authorId')
    const urlPage = parseInt(searchParams.get('page') || '1')
    const urlPageSize = parseInt(searchParams.get('pageSize') || '12')

    if (urlSearch !== searchTerm) setSearchTerm(urlSearch)
    if (urlAuthor && !appliedFilters.author.includes(urlAuthor)) {
      updateFilter('author', [urlAuthor])
      applyFilters()
    }
    if (urlPage !== page) setPage(urlPage)
    if (urlPageSize !== pageSize) setPageSize(urlPageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const debouncedSearch = useDebounce(searchTerm, 300)

  const queryParams = useMemo(() => {
    let minSteps: number | undefined = undefined
    let maxSteps: number | undefined = undefined
    
    if (appliedFilters.stepsRange.length > 0) {
      const [min, max] = appliedFilters.stepsRange[0].split('-')
      
      if (min) minSteps = parseInt(min)
      if (max) maxSteps = parseInt(max)
    }

    return {
      search: debouncedSearch || undefined, 
      authorId: appliedFilters.author.length > 0 ? appliedFilters.author[0] : undefined,
      minSteps,
      maxSteps,
      page,
      pageSize
    }
  }, [debouncedSearch, appliedFilters, page, pageSize])

  const { data, isLoading, error, refetch } = usePublicRoadmaps(queryParams)


  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    
    if (appliedFilters.author.length > 0) params.set('authorId', appliedFilters.author[0])
    if (appliedFilters.stepsRange.length > 0) {
      const [min, max] = appliedFilters.stepsRange[0].split('-')
      if (min) params.set('minSteps', min)
      if (max) params.set('maxSteps', max)
    }
    
    if (page !== 1) params.set('page', page.toString())
    if (pageSize !== 12) params.set('pageSize', pageSize.toString())
    
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, appliedFilters, page, pageSize, setSearchParams])

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterChange = (filterKey: string, values: string[]) => {
    updateFilter(filterKey, values)
  }

  const handleApplyFilters = () => {
    applyFilters()
  }

  const handleRemoveFilter = (filterKey: string) => {
    updateFilter(filterKey, [])
    applyFilters()
  }

  const handleViewRoadmap = (roadmapId: string) => {
    navigate(`/learn/explore/${roadmapId}`)
  }

  const handlePageChange = (newOffset: number) => {
    const newPage = Math.floor(newOffset / pageSize) + 1
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
  }

  const filterOptions: FilterOption[] = [
    {
      key: 'author',
      label: 'Author',
      type: 'text',
      placeholder: 'Enter author name'
    },
    {
      key: 'stepsRange',
      label: 'Steps Range',
      type: 'range',
      minPlaceholder: 'min steps',
      maxPlaceholder: 'max steps'
    }
  ]

  const roadmaps = data?.data || []
  const total = data?.total || 0
  const isEmpty = !isLoading && roadmaps.length === 0
  const hasResults = roadmaps.length > 0
  const isInitialLoading = isLoading && roadmaps.length === 0


  return (
    <Box p={4}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Explore public roadmaps
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover learning paths created by the community
        </Typography>
      </Box>

      <DataFilter
        searchPlaceholder="Search public roadmaps..."
        filterButtonText="Filter Roadmaps"
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        applyButtonText="Apply filters"
      />

      <ActiveFilters
        appliedFilters={appliedFilters}
        filterOptions={filterOptions}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={clearFilters}
      />

      {error && (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          Failed to load roadmaps. Please try again.
        </Alert>
      )}

      {isInitialLoading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {hasResults && (
        <>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Showing {roadmaps.length} of {total} roadmaps
          </Typography>
          
          <Grid2 container spacing={3} mb={4}>
            {roadmaps.map((roadmap) => (
              <Grid2
                key={roadmap.roadmapId}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                display="flex"
              >
                <RoadmapCard
                  roadmapSummary={roadmap}
                  onViewClick={() => handleViewRoadmap(roadmap.roadmapId)}
                  mode="public"
                />
              </Grid2>
            ))}
          </Grid2>

          <PaginationControls
            total={total}
            offset={(page - 1) * pageSize}
            limit={pageSize}
            onChangeOffset={handlePageChange}
            onChangeLimit={handlePageSizeChange}
            pageSizeOptions={[12, 24, 36]}
          />
        </>
      )}

      {isEmpty && (
        <EmptyState
          title="No public roadmaps found"
          description="Try adjusting your search terms or filters to find more roadmaps."
          buttonText="Clear Filters"
          onButtonClick={clearFilters}
        />
      )}
    </Box>
  )
}

export default Explore