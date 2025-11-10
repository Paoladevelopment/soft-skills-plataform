import { Box, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useSelfEvaluations } from '../hooks/useSelfEvaluations'
import ReportsFilterSection from '../components/learning-reports/ReportsFilterSection'
import ActiveFiltersDisplay from '../components/learning-reports/ActiveFiltersDisplay'
import ReportsList from '../components/learning-reports/ReportsList'
import EmptyState from '../components/learning-reports/EmptyState'
import ErrorState from '../components/learning-reports/ErrorState'

type SortOption = 'date_desc' | 'date_asc'

const LearningReport = () => {
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState<SortOption>('date_desc')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [moodFilter, setMoodFilter] = useState<string>('All')

  const { data, isLoading, isFetching, error } = useSelfEvaluations(
    offset,
    limit,
    sortBy,
    difficultyFilter,
    moodFilter
  )

  const reports = data?.data || []
  const total = data?.total ?? 0
  const isEmpty = !isLoading && reports.length === 0
  const hasReports = reports.length > 0
  const isInitialLoading = isLoading && reports.length === 0

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    setOffset(0)
  }

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value)
    setOffset(0)
  }

  const handleMoodChange = (value: string) => {
    setMoodFilter(value)
    setOffset(0)
  }

  const handleRemoveFilter = (filterType: 'difficulty' | 'mood') => {
    if (filterType === 'difficulty') {
      setDifficultyFilter('All')
      setOffset(0)
      
      return
    }
    
    setMoodFilter('All')
    setOffset(0)
  }

  const handleClearAllFilters = () => {
    setDifficultyFilter('All')
    setMoodFilter('All')
    setOffset(0)
  }

  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        gap: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Learning reports
        </Typography>
        <Typography variant="subtitle1" component="p">
          Reflect on your completed tasks to strengthen your learning process.
        </Typography>
      </Box>

      <ReportsFilterSection
        sortBy={sortBy}
        difficultyFilter={difficultyFilter}
        moodFilter={moodFilter}
        onSortChange={handleSortChange}
        onDifficultyChange={handleDifficultyChange}
        onMoodChange={handleMoodChange}
      />

      <ActiveFiltersDisplay
        difficultyFilter={difficultyFilter}
        moodFilter={moodFilter}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
      />

      <Box 
        sx={{ 
          flex: 1, 
          minHeight: 0 
        }}
      >
        {isInitialLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && <ErrorState error={error} />}

        {!error && isEmpty && <EmptyState />}

        {hasReports && (
          <ReportsList
            reports={reports}
            total={total}
            offset={offset}
            limit={limit}
            isFetching={isFetching}
            onOffsetChange={setOffset}
            onLimitChange={setLimit}
          />
        )}
      </Box>
    </Box>
  )
}

export default LearningReport
