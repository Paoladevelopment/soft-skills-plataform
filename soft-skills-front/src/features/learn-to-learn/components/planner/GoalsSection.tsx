import {
  Typography,
  Paper,
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { usePlannerStore } from '../../store/useLearningPlannerStore'
import { useEffect, useState } from 'react'
import GoalCard from './GoalCard'
import AddGoalModal from './AddGoalModal'
import { CreateLearningGoalPayload } from '../../types/planner/learningGoals.api'
import PaginationControls from '../PaginationControls'
import { LearningGoal } from '../../types/planner/planner.models'
import ConfirmDeleteModal from '../ConfirmDeleteModal'

const GoalsSection = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [inputTitle, setInputTitle] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<LearningGoal | null>(null)

  const {
    learningGoals,
    isLoading,
    fetchLearningGoals,
    createLearningGoal,
    deleteLearningGoal,
    learningGoalsPagination: { offset, limit, total },
    setLearningGoalsOffset,
    setLearningGoalsLimit,
  } = usePlannerStore()

  useEffect(() => {
    fetchLearningGoals(offset, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, limit])

  const isEmpty = !isLoading && learningGoals.length === 0
  const hasGoals = !isLoading && learningGoals.length > 0

  const handleGoalSubmit = async (goal: CreateLearningGoalPayload) => {
    await createLearningGoal(goal)
    setInputTitle('')
  }

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false)
    
    if (!goalToDelete) return
    await deleteLearningGoal(goalToDelete.id)

    setGoalToDelete(null)
  }

  const handleOpenDeleteModal = (goal: LearningGoal) => {
    setGoalToDelete(goal)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setGoalToDelete(null)
  }

  return (
    <>
      <AddGoalModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setInputTitle('')
        }}
        onSubmit={handleGoalSubmit}
        defaultValues={{ title: inputTitle }}
      />
      
      <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            width: "100%",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Add learning goal"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            fullWidth
            sx={{
              paddingLeft: 2,
              py: 1,
            }}
            slotProps={{
              input: {
                disableUnderline: true,
              }
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              flexBasis: "20%",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Add Goal
          </Button>
        </Stack>
        <Box 
          my={4}
        >
          {isLoading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {isEmpty && (
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                textAlign: "center",
                borderRadius: 2,
                boxShadow: "none",
                py: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                No learning goals yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first learning goal to get started on your educational journey
              </Typography>
            </Paper>
          )}

          {hasGoals && (
            <>
              <Stack 
                spacing={2}
              >
                {learningGoals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onDeleteClick={() => handleOpenDeleteModal(goal)}
                  />
                ))}
              </Stack>
              <PaginationControls
                total={total}
                offset={offset}
                limit={limit}
                onChangeOffset={setLearningGoalsOffset}
                onChangeLimit={setLearningGoalsLimit}
              />
            </>
          )}
        </Box> 
      </Box>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default GoalsSection