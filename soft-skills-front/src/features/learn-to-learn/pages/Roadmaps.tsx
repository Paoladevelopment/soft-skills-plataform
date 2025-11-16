import {
  Box,
  Typography,
  Grid2,
  Button,
  Stack,
  CircularProgress
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import RoadmapCard from '../components/roadmap/RoadmapCard'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { useEffect, useState } from 'react'
import PaginationControls from '../components/PaginationControls'
import { useNavigate } from 'react-router-dom'
import CreateRoadmapModal from '../components/roadmap/CreateRoadmapModal'
import { RoadmapSummary } from '../types/roadmap/roadmap.models'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal'
import EmptyState from '../components/ui/EmptyState'

const Roadmaps = () => {
  const { t } = useTranslation('roadmap')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [roadmapToDelete, setRoadmapToDelete] = useState<RoadmapSummary | null>(null)

  const { 
    myRoadmaps,
    isLoading,
    fetchMyRoadmaps,
    deleteRoadmap,
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

  const handleOpenDeleteModal = (roadmap: RoadmapSummary) => {
    setRoadmapToDelete(roadmap)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setRoadmapToDelete(null)
  }

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false)

    if (!roadmapToDelete) return
    await deleteRoadmap(roadmapToDelete.roadmapId)

    setRoadmapToDelete(null)
  }

  return (
    <Box 
      p={4}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t('myRoadmaps.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('myRoadmaps.subtitle')}
          </Typography>
        </Box>

        {hasMyRoadmaps && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{
              fontWeight: 500,
            }}
            onClick={() => setShowCreateModal(true)}
          >
            {t('myRoadmaps.createNew')}
          </Button>
        )}
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
                  onDeleteClick={() => handleOpenDeleteModal(roadmap)}
                />
              </Grid2>
              ))
            } 
          </Grid2>
        )}

        {isEmpty && (
          <EmptyState
            title={t('myRoadmaps.empty.title')}
            description={t('myRoadmaps.empty.description')}
            buttonText={t('myRoadmaps.empty.button')}
            onButtonClick={() => setShowCreateModal(true)}
            fullHeight
          />
        )}

        {hasMyRoadmaps && (
          <PaginationControls
            total={total}
            offset={offset}
            limit={limit}
            onChangeOffset={setMyRoadmapsOffset}
            onChangeLimit={setMyRoadmapsLimit}
            pageSizeOptions={[10, 25, 50]}
          />
        )}
      </Box>
      <CreateRoadmapModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}

export default Roadmaps
