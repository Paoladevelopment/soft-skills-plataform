import { Box, Typography, Breadcrumbs, Link, CircularProgress, Stack, Chip, Divider } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLearningGoalStore } from '../store/useLearningGoalStore'
import InlineEditableField from '../components/ui/InlineEditableField'
import NoResults from '../components/ui/NoResults'
import DateDisplay from '../components/ui/DateDisplay'
import { Notes, AccessTime } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getLearningGoalStatusInfo, getStatusChipColor } from '../utils/learningGoalUtils'
import { useDebounce } from '../hooks/useDebounce'

const LearningGoalDetail = () => {
  const navigate = useNavigate()
  const { goalId } = useParams()
  const {
    selectedGoal: goal,
    isLoading,
    getSelectedGoal,
    fetchLearningGoalById,
    updateLearningGoal,
  } = useLearningGoalStore()

  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    impact: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState({
    title: false,
    description: false,
    impact: false
  })

  const debouncedTitle = useDebounce(goalData.title)
  const debouncedDescription = useDebounce(goalData.description)
  const debouncedImpact = useDebounce(goalData.impact)

  useEffect(() => {
    const fetchGoal = async () => {
      if (!goalId) return
      
      const existingGoal = getSelectedGoal()
      
      if (!existingGoal) {
        await fetchLearningGoalById(goalId)
      }
    }

    fetchGoal()
  }, [goalId, getSelectedGoal, fetchLearningGoalById])

  useEffect(() => {
    if (goal) {
      setGoalData({
        title: goal.title,
        description: goal.description,
        impact: goal.impact
      })
    }
  }, [goal])

  useEffect(() => {
    const saveTitle = async () => {
      if (hasUserInteracted.title && debouncedTitle !== undefined) {
        setIsSaving(true)

        await updateLearningGoal({ title: debouncedTitle })

        setIsSaving(false)
      }
    }
    saveTitle()
  }, [debouncedTitle, updateLearningGoal, hasUserInteracted.title])

  useEffect(() => {
    const saveDescription = async () => {
      if (hasUserInteracted.description && debouncedDescription !== undefined) {
        setIsSaving(true)

        await updateLearningGoal({ description: debouncedDescription })

        setIsSaving(false)
      }
    }
    saveDescription()
  }, [debouncedDescription, updateLearningGoal, hasUserInteracted.description])

  useEffect(() => {
    const saveImpact = async () => {
      if (hasUserInteracted.impact && debouncedImpact !== undefined) {
        setIsSaving(true)

        await updateLearningGoal({ impact: debouncedImpact })

        setIsSaving(false)
      }
    }
    saveImpact()
  }, [debouncedImpact, updateLearningGoal, hasUserInteracted.impact])

  const saveField = (field: 'title' | 'description' | 'impact', value: string) => {
    setGoalData(prev => ({
      ...prev,
      [field]: value
    }))
    
    setHasUserInteracted(prev => ({
      ...prev,
      [field]: true
    }))
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          maxWidth: '900px',
          mx: 'auto',
          px: 2,
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!goal) {
    return (
      <NoResults
        title="Goal not found"
        description="The learning goal you're looking for doesn't exist or may have been removed."
        buttonText="Back to Learning Goals"
        onButtonClick={() => navigate('/learn/planner')}
      />
    )
  }

  const statusInfo = getLearningGoalStatusInfo(goal.completedAt, goal.startedAt)

  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/learn/planner')} 
          sx={{ 
            cursor: 'pointer', 
            flex: 1,
            textAlign: 'left'
          }}
        >
          Learning Goals
        </Link>
        <Typography color="text.primary">{goalData.title}</Typography>
      </Breadcrumbs>

      <Box>
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ 
            mb: 2, 
            width: '100%' 
          }} 
        >
          <Box sx={{ flex: 1 }}>
            <InlineEditableField
              label="Title"
              defaultValue={goalData.title}
              onSave={(val) => saveField('title', val)}
              disableDefaultDecoration
            />
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {isSaving && (
              <Chip
                label="Saving..."
                size="small"
                color="info"
                variant="outlined"
              />
            )}

            <Chip
              label={statusInfo.status}
              color={getStatusChipColor(statusInfo.status)}
              size="small"
            />
            
            {statusInfo.elapsedTime && (
              <Chip
                icon={<AccessTime />}
                label={`Elapsed: ${statusInfo.elapsedTime}`}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Stack>
        
        <InlineEditableField
          label="Description"
          defaultValue={goalData.description}
          onSave={(val) => saveField('description', val)}
          multiline
          icon={<Notes />}
        />

        <InlineEditableField
          label="Impact"
          defaultValue={goalData.impact}
          onSave={(val) => saveField('impact', val)}
          multiline
          icon={<Notes />}
        />

        <Divider sx={{ my: 1 }} />

        <DateDisplay
          title="Dates"
          dates={[
            {
              label: 'Created at',
              value: goal.createdAt
            },
            {
              label: 'Updated at',
              value: goal.updatedAt
            },
            {
              label: 'Started at',
              value: goal.startedAt
            },
            {
              label: 'Completed at',
              value: goal.completedAt
            }
          ]}
        />
      </Box>
    </Box>
  )
}

export default LearningGoalDetail