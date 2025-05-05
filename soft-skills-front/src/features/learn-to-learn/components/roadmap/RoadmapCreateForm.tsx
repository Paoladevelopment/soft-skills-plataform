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

const roadmapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').max(450, 'Max 450 characters allowed'),
})

type RoadmapFields = z.infer<typeof roadmapSchema>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, description: string) => void
}

const RoadmapCreateForm = ({ open, onClose, onSubmit }: Props) => {
  const isLoading = useRoadmapStore((state) => state.isLoading)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RoadmapFields>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: { title: '', description: '' },
  })

  const description = watch('description')

  const handleFormSubmit: SubmitHandler<RoadmapFields> = ({ title, description }) => {
    onSubmit(title.trim(), description.trim())
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">New Roadmap</Typography>
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
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
            {isLoading ? <CircularProgress size={20} /> : 'Create Roadmap'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoadmapCreateForm