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
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { SubmitHandler, useForm, Controller } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from 'react'
import { CreateTaskPayload } from '../../types/planner/task.api'
import { Priority, TaskType } from '../../types/common.enums'
import { usePomodoroPreferencesStore } from '../../store/usePomodoroPreferencesStore'

const createAddTaskSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(1, t('objectives.addTaskModal.validation.titleRequired')),
  description: z.string().min(1, t('objectives.addTaskModal.validation.descriptionRequired')),
  task_type: z.nativeEnum(TaskType, {
    required_error: t('objectives.addTaskModal.validation.taskTypeRequired'),
  }),
  priority: z.nativeEnum(Priority, {
    required_error: t('objectives.addTaskModal.validation.priorityRequired'),
  }),
  estimated_pomodoros: z.number().min(0.5, t('objectives.addTaskModal.validation.estimatedTimeRequired')),
  due_date: z.string().optional(),
  is_optional: z.boolean().optional(),
})

export type AddTaskFields = z.infer<ReturnType<typeof createAddTaskSchema>>

const getPomodoroHelperText = (isConfigured: boolean, effectivePomodoroLengthMinutes: number, t: (key: string, options?: Record<string, unknown>) => string): string => {
  return isConfigured 
    ? t('objectives.addTaskModal.estimatedPomodorosHelper', { minutes: effectivePomodoroLengthMinutes })
    : t('objectives.addTaskModal.estimatedPomodorosHelperDefault')
}

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (task: AddTaskFields) => void
  defaultValues?: Partial<CreateTaskPayload>
}

const AddTaskModal = ({ open, onClose, onSubmit, defaultValues }: AddTaskModalProps) => {
  const { t } = useTranslation('goals')
  const { isConfigured, effectivePomodoroLengthMinutes, fetchPomodoroPreferences } = usePomodoroPreferencesStore()
  const addTaskSchema = createAddTaskSchema(t)
  
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
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography fontWeight="bold">
            {t('objectives.addTaskModal.title')}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3 
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1 
            }}
          >
            {t('objectives.addTaskModal.subtitle')}
          </Typography>

          <TextField
            id="task-title"
            label={t('objectives.addTaskModal.titleLabel')}
            placeholder={t('objectives.addTaskModal.titlePlaceholder')}
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            id="task-description"
            label={t('objectives.addTaskModal.descriptionLabel')}
            placeholder={t('objectives.addTaskModal.descriptionPlaceholder')}
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Controller
            name="task_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.task_type}>
                <InputLabel id="task-type-label">{t('objectives.addTaskModal.taskTypeLabel')}</InputLabel>
                <Select
                  labelId="task-type-label"
                  id="task-type"
                  label={t('objectives.addTaskModal.taskTypeLabel')}
                  value={field.value ?? TaskType.Other}
                  onChange={field.onChange}
                >
                  <MenuItem value={TaskType.Reading}>{t('objectives.addTaskModal.taskTypes.reading')}</MenuItem>
                  <MenuItem value={TaskType.Practice}>{t('objectives.addTaskModal.taskTypes.practice')}</MenuItem>
                  <MenuItem value={TaskType.Writing}>{t('objectives.addTaskModal.taskTypes.writing')}</MenuItem>
                  <MenuItem value={TaskType.Research}>{t('objectives.addTaskModal.taskTypes.research')}</MenuItem>
                  <MenuItem value={TaskType.Listening}>{t('objectives.addTaskModal.taskTypes.listening')}</MenuItem>
                  <MenuItem value={TaskType.Discussion}>{t('objectives.addTaskModal.taskTypes.discussion')}</MenuItem>
                  <MenuItem value={TaskType.ProblemSolving}>{t('objectives.addTaskModal.taskTypes.problem_solving')}</MenuItem>
                  <MenuItem value={TaskType.Experimenting}>{t('objectives.addTaskModal.taskTypes.experimenting')}</MenuItem>
                  <MenuItem value={TaskType.Teaching}>{t('objectives.addTaskModal.taskTypes.teaching')}</MenuItem>
                  <MenuItem value={TaskType.Other}>{t('objectives.addTaskModal.taskTypes.other')}</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.task_type?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel id="task-priority-label">{t('objectives.addTaskModal.priorityLabel')}</InputLabel>
                <Select
                  labelId="task-priority-label"
                  id="task-priority"
                  label={t('objectives.addTaskModal.priorityLabel')}
                  value={field.value ?? Priority.Medium}
                  onChange={field.onChange}
                >
                  <MenuItem value={Priority.Low}>{t('objectives.filters.low')}</MenuItem>
                  <MenuItem value={Priority.Medium}>{t('objectives.filters.medium')}</MenuItem>
                  <MenuItem value={Priority.High}>{t('objectives.filters.high')}</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.priority?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <TextField
            id="task-estimated-time"
            label={t('objectives.addTaskModal.estimatedPomodorosLabel')}
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
            helperText={errors.estimated_pomodoros?.message || getPomodoroHelperText(isConfigured, effectivePomodoroLengthMinutes, t)}
          />

          <TextField
            id="task-due-date"
            label={t('objectives.addTaskModal.dueDateLabel')}
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message || t('objectives.addTaskModal.dueDateHelper')}
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
                label={t('objectives.addTaskModal.isOptionalLabel')}
              />
            )}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: -2 
            }}
          >
            {t('objectives.addTaskModal.isOptionalHelper')}
          </Typography>
        </DialogContent>

        <DialogActions 
          sx={{ 
            px: 3, 
            pb: 3 
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            {t('actions.cancel', { ns: 'common' })}
          </Button>

          <Button variant="contained" color="secondary" type="submit">
            {t('objectives.addTaskModal.createButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddTaskModal
