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
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { SubmitHandler, useForm, Controller } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from 'react'
import { CreateTaskPayload } from '../../types/planner/task.api'
import { Priority, TaskType } from '../../types/common.enums'
import { usePomodoroPreferencesStore } from '../../store/usePomodoroPreferencesStore'

const addTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  task_type: z.nativeEnum(TaskType, {
    required_error: "Task type is required",
  }),
  priority: z.nativeEnum(Priority, {
    required_error: "Priority is required",
  }),
  estimated_pomodoros: z.number().min(0.5, "Estimated time is required"),
  due_date: z.string().optional(),
  is_optional: z.boolean().optional(),
})

export type AddTaskFields = z.infer<typeof addTaskSchema>

const getPomodoroHelperText = (isConfigured: boolean, effectivePomodoroLengthMinutes: number): string => {
  return isConfigured 
    ? `1 pomodoro = ${effectivePomodoroLengthMinutes} min` 
    : "You haven't set your pomodoro yet. For now, 1 pomodoro = 60 min."
}

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (task: AddTaskFields) => void
  defaultValues?: Partial<CreateTaskPayload>
}

const AddTaskModal = ({ open, onClose, onSubmit, defaultValues }: AddTaskModalProps) => {
  const { isConfigured, effectivePomodoroLengthMinutes, fetchPomodoroPreferences } = usePomodoroPreferencesStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddTaskFields>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      task_type: TaskType.Other,
      priority: Priority.Medium,
      estimated_pomodoros: 1,
      due_date: '',
      is_optional: false,
      ...defaultValues
    },
  })

  const handleFormSubmit: SubmitHandler<AddTaskFields> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  useEffect(() => {
    if (open) {
      fetchPomodoroPreferences()
      
      reset({
        title: '',
        description: '',
        task_type: TaskType.Other,
        priority: Priority.Medium,
        estimated_pomodoros: 1,
        due_date: '',
        is_optional: false,
        ...defaultValues
      })
    }
  }, [open, defaultValues, reset, fetchPomodoroPreferences])

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        disableRestoreFocus
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">Create new task</Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Fill in the details below to create your new task. Be specific with your title and description to help future you understand exactly what needs to be done.
          </Typography>

          <TextField
            id="task-title"
            label="Title"
            placeholder="Enter task title"
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message || "Name this task clearly so future you knows what it is."}
          />

          <TextField
            id="task-description"
            label="Description"
            placeholder="Add context, links, or acceptance criteria..."
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message || "Add context, links, or acceptance criteria."}
          />

          <Controller
            name="task_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.task_type}>
                <InputLabel id="task-type-label">Task type</InputLabel>
                <Select
                  labelId="task-type-label"
                  id="task-type"
                  label="Task type"
                  value={field.value ?? TaskType.Other}
                  onChange={field.onChange}
                >
                  <MenuItem value={TaskType.Reading}>Reading</MenuItem>
                  <MenuItem value={TaskType.Practice}>Practice</MenuItem>
                  <MenuItem value={TaskType.Writing}>Writing</MenuItem>
                  <MenuItem value={TaskType.Research}>Research</MenuItem>
                  <MenuItem value={TaskType.Listening}>Listening</MenuItem>
                  <MenuItem value={TaskType.Discussion}>Discussion</MenuItem>
                  <MenuItem value={TaskType.ProblemSolving}>Problem Solving</MenuItem>
                  <MenuItem value={TaskType.Experimenting}>Experimenting</MenuItem>
                  <MenuItem value={TaskType.Teaching}>Teaching</MenuItem>
                  <MenuItem value={TaskType.Other}>Other</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.task_type?.message || "Pick the main activity so we can suggest better tips later."}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel id="task-priority-label">Priority</InputLabel>
                <Select
                  labelId="task-priority-label"
                  id="task-priority"
                  label="Priority"
                  value={field.value ?? Priority.Medium}
                  onChange={field.onChange}
                >
                  <MenuItem value={Priority.Low}>Low</MenuItem>
                  <MenuItem value={Priority.Medium}>Medium</MenuItem>
                  <MenuItem value={Priority.High}>High</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.priority?.message || "How important is this compared to everything else?"}
                </FormHelperText>
              </FormControl>
            )}
          />

          <TextField
            id="task-estimated-time"
            label="Estimated time (in pomodoros)"
            type="number"
            fullWidth
            slotProps={{ 
                htmlInput: { 
                    min: 0.5, 
                    step: 0.5 
                } 
            }}
            {...register('estimated_pomodoros', { valueAsNumber: true })}
            error={!!errors.estimated_pomodoros}
            helperText={errors.estimated_pomodoros?.message || getPomodoroHelperText(isConfigured, effectivePomodoroLengthMinutes)}
          />

          <TextField
            id="task-due-date"
            label="Due date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message || "When does this need to be done?"}
          />

          <Controller
            name="is_optional"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    id="task-optional"
                    checked={field.value || false}
                    onChange={field.onChange}
                  />
                }
                label="Optional task"
              />
            )}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: -2 }}>
            Mark as optional so it won't block your plan.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddTaskModal
