import { Box, Typography, Breadcrumbs, Link, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLearningGoalStore } from '../store/useLearningGoalStore'
import InlineEditableField from '../components/ui/InlineEditableField'
import NoResults from '../components/ui/NoResults'
import { Notes } from '@mui/icons-material'
import { useEffect } from 'react'

const LearningGoalDetail = () => {
  const navigate = useNavigate()
  const { goalId } = useParams()
  const {
    selectedGoal: goal,
    isLoading,
    getSelectedGoal,
    fetchLearningGoalById,
  } = useLearningGoalStore()

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

  const saveField = (field: 'title' | 'description' | 'impact', value: string) => {
    console.log(`Saving ${field}:`, value)
  }

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
        <Link underline="hover" color="inherit" onClick={() => navigate('/learn/planner')} sx={{ cursor: 'pointer' }}>
          Learning Goals
        </Link>
        <Typography color="text.primary">{goal.title}</Typography>
      </Breadcrumbs>

      <Box>
        <InlineEditableField
          label="Title"
          defaultValue={goal.title}
          onSave={(val) => saveField('title', val)}
          disableDefaultDecoration
        />
        
        <InlineEditableField
          label="Description"
          defaultValue={goal.description}
          onSave={(val) => saveField('description', val)}
          multiline
          icon={<Notes />}
        />

        <InlineEditableField
          label="Impact"
          defaultValue={goal.impact}
          onSave={(val) => saveField('impact', val)}
          multiline
          icon={<Notes />}
        />
      </Box>
    </Box>
  )
}

export default LearningGoalDetail