import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDateString } from '../../../utils/formatDate'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { useEffect } from 'react'
import RoadmapFlow from '../components/roadmap/RoadmapFlow'

const RoadmapDetail = () => {
  const { roadmapId } = useParams()
  const navigate = useNavigate()

  const {
    selectedRoadmap,
    selectedRoadmapSteps,
    isLoading,
    getRoadmapById,
    setSelectedRoadmap,
    setSelectedRoadmapSteps,
    resetEditorLayout
  } = useRoadmapStore()

  const resetRoadmapEditorState = () => {
    setSelectedRoadmap(null)
    setSelectedRoadmapSteps(0)
    resetEditorLayout()
  }

  const handleBackToRoadmaps = () => {
    navigate('/learn/roadmaps')
  }

  useEffect(() => {
    if (roadmapId) {
      getRoadmapById(roadmapId)
    }

    return () => {
      resetRoadmapEditorState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId])

  if (isLoading || !selectedRoadmap) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBackToRoadmaps}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" fontWeight="medium" color="text.secondary">
            Back to roadmaps
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/learn/roadmaps/${roadmapId}/edit`)}
        >
          Edit Roadmap
        </Button>
      </Stack>

      <Typography variant="h4" fontWeight="bold" mb={1}>
        {selectedRoadmap.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        {selectedRoadmap.description}
      </Typography>

      <Stack direction="row" spacing={4} mb={4}>
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          <CalendarTodayIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {formatDateString(selectedRoadmap.createdAt, "Not defined", "Created:")}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          <MenuBookIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {selectedRoadmapSteps} learning steps
          </Typography>
        </Stack>
      </Stack>

      <Box mt={4} border="1px solid #e0e0e0" borderRadius={2} minHeight="700px">
        <RoadmapFlow />
      </Box>
    </Box>
  )
}

export default RoadmapDetail