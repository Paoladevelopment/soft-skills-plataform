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
import CloseIcon from '@mui/icons-material/Close'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { useEffect } from 'react'

const roadmapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').max(450, 'Max 450 characters allowed'),
})

type RoadmapFields = z.infer<typeof roadmapSchema>

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

function getRoadmapFormLabels(mode: 'create' | 'edit') {
  return {
    dialogTitle: mode === 'create' ? 'New Roadmap' : 'Edit Roadmap',
    submitButton: mode === 'create' ? 'Create Roadmap' : 'Save Changes',
  }
}

const RoadmapForm = ({ open, onClose, onSubmit, mode, initialValues }: Props) => {
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

  const { dialogTitle, submitButton } = getRoadmapFormLabels(mode)

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
            Add a title and description to your roadmap.
          </Typography>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Roadmap Title"
              fullWidth
              placeholder="Enter Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Description"
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
            Cancel
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