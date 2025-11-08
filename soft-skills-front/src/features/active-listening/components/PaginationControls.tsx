import {
  Box,
  Typography,
  Button
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
  onChangeOffset: (offset: number) => void
}

const PaginationControls = ({
  total,
  offset,
  limit,
  onChangeOffset,
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1
  const start = offset + 1
  const end = Math.min(offset + limit, total)

  const handleFirstPage = () => {
    onChangeOffset(0)
  }

  const handlePrevPage = () => {
    onChangeOffset(Math.max(0, offset - limit))
  }

  const handleNextPage = () => {
    onChangeOffset(Math.min(offset + limit, (totalPages - 1) * limit))
  }

  const handleLastPage = () => {
    onChangeOffset((totalPages - 1) * limit)
  }

  const isFirstPage = offset === 0
  const isLastPage = offset + limit >= total

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mt: 3,
        p: 2,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(255, 182, 38, 0.1) 0%, rgba(72, 173, 163, 0.1) 100%)',
        border: '2px solid rgba(255, 182, 38, 0.3)',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 182, 38, 0.15)',
          border: '1px solid rgba(255, 182, 38, 0.4)',
        }}
      >
        <Typography
          sx={{
            color: '#2C3E50',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {start}-{end} of {total}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
        }}
      >
        <Button
          onClick={handleFirstPage}
          disabled={isFirstPage}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: isFirstPage ? 'rgba(0, 0, 0, 0.1)' : '#FFB626',
            color: isFirstPage ? 'rgba(0, 0, 0, 0.3)' : 'white',
            '&:hover': {
              backgroundColor: isFirstPage ? 'rgba(0, 0, 0, 0.1)' : '#FFD699',
              transform: isFirstPage ? 'none' : 'translateY(-2px)',
            },
            '&:disabled': {
              color: 'rgba(0, 0, 0, 0.3)',
            },
            boxShadow: isFirstPage ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          <FirstPage />
        </Button>
        <Button
          onClick={handlePrevPage}
          disabled={isFirstPage}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: isFirstPage ? 'rgba(0, 0, 0, 0.1)' : '#FFB626',
            color: isFirstPage ? 'rgba(0, 0, 0, 0.3)' : 'white',
            '&:hover': {
              backgroundColor: isFirstPage ? 'rgba(0, 0, 0, 0.1)' : '#FFD699',
              transform: isFirstPage ? 'none' : 'translateY(-2px)',
            },
            '&:disabled': {
              color: 'rgba(0, 0, 0, 0.3)',
            },
            boxShadow: isFirstPage ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          <ChevronLeft />
        </Button>
        <Box
          sx={{
            minWidth: 50,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            backgroundColor: 'linear-gradient(135deg, #48ADA3 0%, #3A8A7F 100%)',
            background: 'linear-gradient(135deg, #48ADA3 0%, #3A8A7F 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          {currentPage}
        </Box>
        <Button
          onClick={handleNextPage}
          disabled={isLastPage}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: isLastPage ? 'rgba(0, 0, 0, 0.1)' : '#FFB626',
            color: isLastPage ? 'rgba(0, 0, 0, 0.3)' : 'white',
            '&:hover': {
              backgroundColor: isLastPage ? 'rgba(0, 0, 0, 0.1)' : '#FFD699',
              transform: isLastPage ? 'none' : 'translateY(-2px)',
            },
            '&:disabled': {
              color: 'rgba(0, 0, 0, 0.3)',
            },
            boxShadow: isLastPage ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          <ChevronRight />
        </Button>
        <Button
          onClick={handleLastPage}
          disabled={isLastPage}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: isLastPage ? 'rgba(0, 0, 0, 0.1)' : '#FFB626',
            color: isLastPage ? 'rgba(0, 0, 0, 0.3)' : 'white',
            '&:hover': {
              backgroundColor: isLastPage ? 'rgba(0, 0, 0, 0.1)' : '#FFD699',
              transform: isLastPage ? 'none' : 'translateY(-2px)',
            },
            '&:disabled': {
              color: 'rgba(0, 0, 0, 0.3)',
            },
            boxShadow: isLastPage ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          <LastPage />
        </Button>
      </Box>
    </Box>
  )
}

export default PaginationControls

