import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Typography,
  MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { SubmitHandler, useForm, Controller } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from 'react'
import { CreateObjectivePayload } from '../../types/planner/objectives.api'
import { Priority } from '../../types/common.enums'

const addObjectiveSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority, {
    required_error: "Priority is required",
  }),
  due_date: z.string().optional(),
})

type AddObjectiveFields = z.infer<typeof addObjectiveSchema>

interface AddObjectiveModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (objective: CreateObjectivePayload) => void
  defaultValues?: Partial<CreateObjectivePayload>
}

const AddObjectiveModal = ({ open, onClose, onSubmit, defaultValues }: AddObjectiveModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddObjectiveFields>({
    resolver: zodResolver(addObjectiveSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: Priority.Medium,
      due_date: '',
      ...defaultValues
    },
  })

  const handleFormSubmit: SubmitHandler<AddObjectiveFields> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        priority: Priority.Medium,
        due_date: '',
        ...defaultValues
      })
    }
  }, [open, defaultValues, reset])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">Create objective</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Title"
            placeholder="Objective title"
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            placeholder="Add a short description"
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField
                label="Priority"
                select
                fullWidth
                value={field.value || Priority.Medium}
                onChange={field.onChange}
                error={!!errors.priority}
                helperText={errors.priority?.message}
              >
                <MenuItem value={Priority.Low}>Low</MenuItem>
                <MenuItem value={Priority.Medium}>Medium</MenuItem>
                <MenuItem value={Priority.High}>High</MenuItem>
              </TextField>
            )}
          />

          <TextField
            label="Due date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            placeholder="dd/mm/aaaa"
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" color="secondary" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddObjectiveModal
