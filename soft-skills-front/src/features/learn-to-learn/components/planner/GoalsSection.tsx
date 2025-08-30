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
import { useLearningGoalStore } from '../../store/useLearningGoalStore'
import { useLearningGoals, useCreateLearningGoal, useDeleteLearningGoal } from '../../hooks/useLearningGoals'
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
    learningGoalsPagination: { offset, limit, total },
    setLearningGoalsOffset,
    setLearningGoalsLimit,
    setLearningGoalsTotal,
  } = useLearningGoalStore()

  const { data, isLoading, isFetching } = useLearningGoals(offset, limit)
  const { mutateAsync: createLearningGoal } = useCreateLearningGoal()
  const { mutateAsync: deleteLearningGoal } = useDeleteLearningGoal()

  useEffect(() => {
    if (data?.total !== undefined) {
      setLearningGoalsTotal(data.total)
    }
  }, [data?.total, setLearningGoalsTotal])

  const learningGoals = data?.data || []
  const isEmpty = !isLoading && learningGoals.length === 0
  const hasGoals = learningGoals.length > 0
  const isInitialLoading = isLoading && learningGoals.length === 0

  const handleGoalSubmit = async (goal: CreateLearningGoalPayload) => {
    await createLearningGoal(goal)
    setInputTitle('')
    setAddModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false)
    
    if (!goalToDelete) {
      return
    }
    
    const goalId = goalToDelete.learningGoalId
    
    await deleteLearningGoal(goalId)
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
            disabled={false}
            sx={{
              flexBasis: "20%",
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
          {isInitialLoading && (
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
                    key={goal.learningGoalId} 
                    goal={goal} 
                    onDeleteClick={() => handleOpenDeleteModal(goal)}
                  />
                ))}
              </Stack>

              {isFetching && (
                <Box display="flex" justifyContent="center" pt={2}>
                  <CircularProgress size={20} />
                </Box>
              )}
      
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