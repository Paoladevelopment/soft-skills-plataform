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
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { formatDateString } from '../../../utils/formatDate'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { useEffect, useState } from 'react'
import RoadmapFlow from '../components/roadmap/RoadmapFlow'
import TaskInformationSidebar from '../components/roadmap/TaskInformationSidebar'

const RoadmapDetail = () => {
  const { roadmapId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const isPublicMode = location.pathname.startsWith('/learn/explore')

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
    if (isPublicMode) {
      navigate('/learn/explore')
    } else {
      navigate('/learn/roadmaps')
    }
  }

  const handleCopyRoadmap = () => {
    console.log('Copy roadmap:', roadmapId)
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
            {isPublicMode ? 'Back to explore' : 'Back to roadmaps'}
          </Typography>
        </Stack>

        {isPublicMode ? (
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyRoadmap}
          >
            Copy Roadmap
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/learn/roadmaps/${roadmapId}/edit`)}
          >
            Edit Roadmap
          </Button>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Typography variant="h4" fontWeight="bold">
          {selectedRoadmap.title}
        </Typography>
        {selectedRoadmap.visibility === 'public' ? (
          <PublicIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
        ) : (
          <LockIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
        )}
      </Stack>
      
      {isPublicMode && (
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1} 
          mb={1}
        >
          <PersonIcon 
            sx={{ 
              fontSize: '1rem', 
              color: 'text.secondary' 
            }} 
          />
          <Typography variant="body1" color="text.secondary">
            Created by <strong>{selectedRoadmap.username || 'Unknown Author'}</strong>
          </Typography>
        </Stack>
      )}
      
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

      <Box 
        mt={4} 
        border="1px solid #e0e0e0" 
        borderRadius={2} 
        minHeight="700px"
        position="relative"
      >
        <RoadmapFlow 
          onNodeClick={setSelectedNodeId}
          onPaneClick={() => setSelectedNodeId(null)}
        />
        {selectedNodeId && (
          <>
            <Box
              onClick={() => setSelectedNodeId(null)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                zIndex: 5,
                cursor: 'pointer',
              }}
            />

            <TaskInformationSidebar
              selectedNodeId={selectedNodeId}
              onClose={() => setSelectedNodeId(null)}
            />
            
          </>
        )}
      </Box>
    </Box>
  )
}

export default RoadmapDetail