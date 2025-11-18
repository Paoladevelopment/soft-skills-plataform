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
import { useEffect } from 'react'
import { CreateNotePayload } from '../../types/planner/note.api'

const createAddNoteSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(1, t('tasks:notes.addModal.validation.titleRequired')),
  content: z.string().min(1, t('tasks:notes.addModal.validation.contentRequired')),
})

export type AddNoteFields = z.infer<ReturnType<typeof createAddNoteSchema>>

interface AddNoteModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateNotePayload) => void
}

const AddNoteModal = ({ open, onClose, onSubmit }: AddNoteModalProps) => {
  const { t } = useTranslation(['tasks'])
  const addNoteSchema = createAddNoteSchema(t)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddNoteFields>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const handleFormSubmit: SubmitHandler<AddNoteFields> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        content: '',
      })
    }
  }, [open, reset])

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
            {t('tasks:notes.addModal.title')}
          </Typography>
          <IconButton 
            onClick={onClose} 
            aria-label={t('ui.close', { ns: 'common' })}
          >
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
            {t('tasks:notes.addModal.subtitle')}
          </Typography>

          <TextField
            id="note-title"
            label={t('tasks:notes.addModal.titleLabel')}
            placeholder={t('tasks:notes.addModal.titlePlaceholder')}
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            id="note-content"
            label={t('tasks:notes.addModal.contentLabel')}
            placeholder={t('tasks:notes.addModal.contentPlaceholder')}
            fullWidth
            multiline
            minRows={4}
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
          />
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
            {t('tasks:notes.addModal.addButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddNoteModal

