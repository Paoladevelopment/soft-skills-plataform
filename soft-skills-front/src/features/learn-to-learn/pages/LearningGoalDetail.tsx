import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLearningGoalStore } from '../store/useLearningGoalStore'
import InlineEditableField from '../components/ui/InlineEditableField'

const LearningGoalDetail = () => {
  const navigate = useNavigate()
  const goal = useLearningGoalStore(state => state.getSelectedGoal())

  if (!goal) {
    return <Typography variant="body1">Goal not found.</Typography>
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
        />

        <InlineEditableField
          label="Impact"
          defaultValue={goal.impact}
          onSave={(val) => saveField('impact', val)}
          multiline
        />
      </Box>
    </Box>
  )
}

export default LearningGoalDetail