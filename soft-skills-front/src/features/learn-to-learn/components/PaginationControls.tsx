import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage
} from '@mui/icons-material'

interface PaginationControlsProps {
  total: number
  offset: number
  limit: number
  onChangeLimit: (limit: number) => void
  onChangeOffset: (offset: number) => void
}

const PaginationControls = ({
  total,
  offset,
  limit,
  onChangeLimit,
  onChangeOffset
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(total / limit)
  const start = offset + 1
  const end = Math.min(offset + limit, total)

  const handleFirstPage = () => onChangeOffset(0)
  const handlePrevPage = () => onChangeOffset(Math.max(0, offset - limit))
  const handleNextPage = () => onChangeOffset(Math.min(offset + limit, (totalPages - 1) * limit))
  const handleLastPage = () => onChangeOffset((totalPages - 1) * limit)

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>Results per page</Typography>
        <Select
          size="small"
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
        >
          {[5, 10].map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </Box>

      <Typography>
        {start}-{end} of {total}
      </Typography>

      <Box display="flex">
        <IconButton onClick={handleFirstPage} disabled={offset === 0}>
          <FirstPage />
        </IconButton>
        <IconButton onClick={handlePrevPage} disabled={offset === 0}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={handleNextPage} disabled={offset + limit >= total}>
          <ChevronRight />
        </IconButton>
        <IconButton onClick={handleLastPage} disabled={offset + limit >= total}>
          <LastPage />
        </IconButton>
      </Box>
    </Box>
  )
}

export default PaginationControls
