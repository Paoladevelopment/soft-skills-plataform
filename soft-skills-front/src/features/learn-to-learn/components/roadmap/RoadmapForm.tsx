import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { useEffect } from 'react'

const createRoadmapSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(1, t('editor.form.validation.titleRequired')),
  description: z.string().min(1, t('editor.form.validation.descriptionRequired')).max(450, t('editor.form.validation.maxCharacters')),
})

type RoadmapFields = z.infer<ReturnType<typeof createRoadmapSchema>>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, description: string) => void
  mode: 'create' | 'edit'
  initialValues?: {
    title: string
    description: string
  }
}

function getRoadmapFormLabels(mode: 'create' | 'edit', t: (key: string) => string) {
  return {
    dialogTitle: mode === 'create' ? t('editor.form.newRoadmap') : t('editor.form.editRoadmap'),
    submitButton: mode === 'create' ? t('editor.form.createRoadmap') : t('editor.form.saveChanges'),
  }
}

const RoadmapForm = ({ open, onClose, onSubmit, mode, initialValues }: Props) => {
  const { t } = useTranslation('roadmap')
  const roadmapSchema = createRoadmapSchema(t)
  const isLoading = useRoadmapStore((state) => state.isLoading)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RoadmapFields>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: initialValues ?? { title: '', description: '' },
  })

  const description = watch('description')

  const handleFormSubmit: SubmitHandler<RoadmapFields> = ({ title, description }) => {
    onSubmit(title.trim(), description.trim())
  }

  const { dialogTitle, submitButton } = getRoadmapFormLabels(mode, t)

  useEffect(() => {
    if (open && initialValues) {
      reset(initialValues)
    }
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">{dialogTitle}</Typography>
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent
          sx={{
            paddingTop: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary" mb={2}>
            {t('editor.form.instruction')}
          </Typography>
          <Stack spacing={2} mt={1}>
            <TextField
              label={t('editor.form.titleLabel')}
              fullWidth
              placeholder={t('editor.form.titlePlaceholder')}
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label={t('editor.form.descriptionLabel')}
              fullWidth
              multiline
              rows={3}
              placeholder={t('editor.form.descriptionPlaceholder')}
              slotProps={{
                input: {
                  inputProps: {
                    maxLength: 450
                  }
                }
              }}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message || `${description.length}/450`}
            />
          </Stack>
        </DialogContent>

        <DialogActions 
          sx={{
            px: 3, 
            pb: 2 
            }}
          >
          <Button onClick={onClose} variant="text" color="inherit" disabled={isLoading}>
            {t('actions.cancel', { ns: 'common' })}
          </Button>
          <Button type="submit" color="secondary" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : submitButton}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoadmapForm