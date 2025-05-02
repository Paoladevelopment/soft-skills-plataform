import {
  Box,
  Typography,
  Grid2,
  Button,
  Stack,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RoadmapCard from '../components/roadmap/RoadmapCard'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { useEffect, useState } from 'react'
import PaginationControls from '../components/PaginationControls'
import { useNavigate } from 'react-router-dom'
import CreateRoadmapModal from '../components/roadmap/CreateRoadmapModal'

const Roadmaps = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { 
    myRoadmaps,
    isLoading,
    fetchMyRoadmaps,
    myRoadmapsPagination: {offset, limit, total},
    setMyRoadmapsOffset,
    setMyRoadmapsLimit,
  } = useRoadmapStore()

  const navigate = useNavigate()

  useEffect(() => {
    fetchMyRoadmaps(offset, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, limit])

  const isEmpty = !isLoading && myRoadmaps.length == 0
  const hasMyRoadmaps = myRoadmaps.length > 0
  const isInitialLoading = isLoading && myRoadmaps.length == 0

  return (
    <Box 
      p={4}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Your learning roadmaps
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage your personalized learning paths
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: 500,
          }}
          onClick={() => setShowCreateModal(true)}
        >
          Create new roadmap
        </Button>
      </Stack>

      <Box>
        {isInitialLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {hasMyRoadmaps && (
          <Grid2 container spacing={3}>
            {myRoadmaps.map((roadmap) => (
              <Grid2
                key={roadmap.roadmapId}
                size={{ xs: 12, sm: 6, md: 4 }}
                display="flex"
              >
                <RoadmapCard
                  roadmapSummary={roadmap}
                  onViewClick={() => {
                    navigate(`/learn/roadmaps/${roadmap.roadmapId}`)
                  }}
                  onDeleteClick={() => {
                    // handle delete
                  }}
                />
              </Grid2>
              ))
            } 
          </Grid2>
        )}

        <PaginationControls
          total={total}
          offset={offset}
          limit={limit}
          onChangeOffset={setMyRoadmapsOffset}
          onChangeLimit={setMyRoadmapsLimit}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
      <CreateRoadmapModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSelectOption={(option) => {
          setShowCreateModal(false)
          if (option === 'chatbot') {
            navigate('/learn/roadmaps/create/chat')
          } else {
            navigate('/learn/roadmaps/create/manual')
          }
        }}
      />
    </Box>
  )
}

export default Roadmaps
