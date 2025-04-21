import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateLearningGoalPayload } from '../../types/learningGoals.api'
import { useEffect } from 'react'

const addGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  impact: z.string().min(1, "Impact is required"),
})

type AddGoalFields = z.infer<typeof addGoalSchema>

interface AddGoalModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (goal: CreateLearningGoalPayload) => void,
  defaultValues?: Partial<CreateLearningGoalPayload>
}

const AddGoalModal = ({ open, onClose, onSubmit, defaultValues }: AddGoalModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddGoalFields>({
    resolver: zodResolver(addGoalSchema),
    defaultValues,
  })

  const handleFormSubmit: SubmitHandler<AddGoalFields> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  useEffect(() => {
    if (open && defaultValues) {
      reset(defaultValues)
    }
  }, [open, defaultValues, reset])  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">Add learning goal</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Title"
            placeholder="Learn JavaScript"
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            placeholder="Master JavaScript to build interactive web applications"
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Impact"
            placeholder="Why this goal matters to you"
            fullWidth
            multiline
            minRows={2}
            {...register('impact')}
            error={!!errors.impact}
            helperText={errors.impact?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            Add Goal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddGoalModal
