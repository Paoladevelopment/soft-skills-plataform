import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { formatDateString } from '../../../utils/formatDate'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { useEffect, useState } from 'react'
import RoadmapFlow from '../components/roadmap/RoadmapFlow'
import TaskInformationSidebar from '../components/roadmap/TaskInformationSidebar'

const RoadmapDetail = () => {
  const { t } = useTranslation('roadmap')
  const { roadmapId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const isPublicMode = location.pathname.startsWith('/learn/explore')

  const {
    selectedRoadmap,
    selectedRoadmapSteps,
    isLoading,
    isConverting,
    getRoadmapById,
    setSelectedRoadmap,
    setSelectedRoadmapSteps,
    resetEditorLayout,
    copyRoadmap,
    convertToLearningGoal
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

  const handleCopyRoadmap = async () => {
    if (!roadmapId) return
    
    const newRoadmapId = await copyRoadmap(roadmapId)
    if (newRoadmapId) {
      navigate(`/learn/roadmaps/${newRoadmapId}`)
    }
  }

  const handleConvertToLearningGoal = async () => {
    if (!roadmapId || isConverting) return
    
    const learningGoalId = await convertToLearningGoal(roadmapId)
    if (learningGoalId) {
      navigate(`/learn/planner/goals/${learningGoalId}`)
    }
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
            {isPublicMode ? t('detail.backToExplore') : t('detail.backToRoadmaps')}
          </Typography>
        </Stack>

        {isPublicMode ? (
          <Stack direction="row" spacing={2}>
            <Tooltip title={t('detail.createActionablePlanTooltip')}>
              <Button
                variant="contained"
                startIcon={isConverting ? <CircularProgress size={16} color="inherit" /> : <PlaylistAddCheckIcon />}
                onClick={handleConvertToLearningGoal}
                disabled={isConverting}
              >
                {t('detail.createActionablePlan')}
              </Button>
            </Tooltip>
            <Tooltip title={t('detail.copyRoadmapTooltip')}>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyRoadmap}
              >
                {t('detail.copyRoadmap')}
              </Button>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Tooltip title={t('detail.createActionablePlanTooltip')}>
              <Button
                variant="contained"
                startIcon={isConverting ? <CircularProgress size={16} color="inherit" /> : <PlaylistAddCheckIcon />}
                onClick={handleConvertToLearningGoal}
                disabled={isConverting}
              >
                {t('detail.createActionablePlan')}
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/learn/roadmaps/${roadmapId}/edit`)}
            >
              {t('detail.editRoadmap')}
            </Button>
          </Stack>
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
            {t('detail.createdBy')} <strong>{selectedRoadmap.username || t('detail.unknownAuthor')}</strong>
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
            {formatDateString(selectedRoadmap.createdAt, t('detail.notDefined'), t('detail.created'))}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          <MenuBookIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {selectedRoadmapSteps} {t('detail.learningSteps')}
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