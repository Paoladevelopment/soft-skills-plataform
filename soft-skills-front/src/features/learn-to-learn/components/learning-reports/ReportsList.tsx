import { Stack, Box, CircularProgress } from '@mui/material'
import { SelfEvaluationReadRaw } from '../../types/self-evaluation/self-evaluation.api'
import LearningReportCard from './LearningReportCard'
import PaginationControls from '../PaginationControls'

interface ReportsListProps {
  reports: SelfEvaluationReadRaw[]
  total: number
  offset: number
  limit: number
  isFetching: boolean
  onOffsetChange: (offset: number) => void
  onLimitChange: (limit: number) => void
}

const ReportsList = ({
  reports,
  total,
  offset,
  limit,
  isFetching,
  onOffsetChange,
  onLimitChange,
}: ReportsListProps) => {
  return (
    <>
      <Stack spacing={2}>
        {reports.map((report) => (
          <LearningReportCard
            key={report.evaluationId}
            report={report}
          />
        ))}
      </Stack>

      {isFetching && (
        <Box display="flex" justifyContent="center" pt={2}>
          <CircularProgress size={20} />
        </Box>
      )}

      <PaginationControls
        total={total}
        offset={offset}
        limit={limit}
        onChangeOffset={onOffsetChange}
        onChangeLimit={onLimitChange}
        useLearningGoalStorePagination={false}
      />
    </>
  )
}

export default ReportsList

