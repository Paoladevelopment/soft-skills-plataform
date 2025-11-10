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
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateLearningGoalPayload } from '../../types/planner/learningGoals.api'
import { useEffect } from 'react'

const createAddGoalSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(1, t('validation.titleRequired')),
  description: z.string().min(1, t('validation.descriptionRequired')),
  impact: z.string().min(1, t('validation.impactRequired')),
})

type AddGoalFields = z.infer<ReturnType<typeof createAddGoalSchema>>

interface AddGoalModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (goal: CreateLearningGoalPayload) => void,
  defaultValues?: Partial<CreateLearningGoalPayload>
}

const AddGoalModal = ({ open, onClose, onSubmit, defaultValues }: AddGoalModalProps) => {
  const { t } = useTranslation('goals')
  const addGoalSchema = createAddGoalSchema(t)
  
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
          <Typography fontWeight="bold">{t('addGoal.modalTitle')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label={t('addGoal.title')}
            placeholder={t('addGoal.titlePlaceholder')}
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label={t('addGoal.description')}
            placeholder={t('addGoal.descriptionPlaceholder')}
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label={t('addGoal.personalImpact')}
            placeholder={t('addGoal.personalImpactPlaceholder')}
            fullWidth
            multiline
            minRows={2}
            {...register('impact')}
            error={!!errors.impact}
            helperText={errors.impact?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" color="secondary" type="submit">
            {t('addGoal.button')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddGoalModal
