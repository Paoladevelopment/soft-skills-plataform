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
import { CreateObjectivePayload } from '../../types/planner/objectives.api'
import { Priority } from '../../types/common.enums'

const createAddObjectiveSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(1, t('objectives.addModal.validation.titleRequired')),
  description: z.string().min(1, t('objectives.addModal.validation.descriptionRequired')),
  priority: z.nativeEnum(Priority, {
    required_error: t('objectives.addModal.validation.priorityRequired'),
  }),
  due_date: z.string().optional(),
})

type AddObjectiveFields = z.infer<ReturnType<typeof createAddObjectiveSchema>>

interface AddObjectiveModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (objective: CreateObjectivePayload) => void
  defaultValues?: Partial<CreateObjectivePayload>
}

const AddObjectiveModal = ({ open, onClose, onSubmit, defaultValues }: AddObjectiveModalProps) => {
  const { t } = useTranslation('goals')
  const addObjectiveSchema = createAddObjectiveSchema(t)
  
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
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        disableRestoreFocus
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">{t('objectives.addModal.title')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            id="objective-title"
            label={t('objectives.addModal.titleLabel')}
            placeholder={t('objectives.addModal.titlePlaceholder')}
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            id="objective-description"
            label={t('objectives.addModal.descriptionLabel')}
            placeholder={t('objectives.addModal.descriptionPlaceholder')}
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
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel id="objective-priority-label">{t('objectives.addModal.priorityLabel')}</InputLabel>
                <Select
                  labelId="objective-priority-label"
                  id="objective-priority"
                  label={t('objectives.addModal.priorityLabel')}
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
            id="objective-due-date"
            label={t('objectives.addModal.dueDateLabel')}
            type="date"
            fullWidth
            slotProps={{
              htmlInput: {
                min: new Date().toISOString().split('T')[0],
              },
              inputLabel: {
                shrink: true,
              },
            }}
            placeholder={t('objectives.addModal.dueDatePlaceholder')}
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" color="secondary" type="submit">
            {t('objectives.addModal.createButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddObjectiveModal
