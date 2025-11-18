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
import { CreateResourcePayload, RESOURCE_TYPES } from '../../types/planner/resource.api'

const createAddResourceSchema = (t: (key: string) => string) => z.object({
  type: z.enum(RESOURCE_TYPES, {
    required_error: t('tasks:resources.addModal.validation.typeRequired'),
  }),
  title: z.string().min(1, t('tasks:resources.addModal.validation.titleRequired')),
  link: z.string().url(t('tasks:resources.addModal.validation.urlInvalid')).min(1, t('tasks:resources.addModal.validation.urlRequired')),
})

export type AddResourceFields = z.infer<ReturnType<typeof createAddResourceSchema>>

interface AddResourceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateResourcePayload) => void
}

const AddResourceModal = ({ open, onClose, onSubmit }: AddResourceModalProps) => {
  const { t } = useTranslation(['tasks'])
  const addResourceSchema = createAddResourceSchema(t)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddResourceFields>({
    resolver: zodResolver(addResourceSchema),
    defaultValues: {
      type: 'web',
      title: '',
      link: '',
    },
  })

  const handleFormSubmit: SubmitHandler<AddResourceFields> = (data) => {
    onSubmit(data)
    reset()
    onClose()
  }

  useEffect(() => {
    if (open) {
      reset({
        type: 'web',
        title: '',
        link: '',
      })
    }
  }, [open, reset])

  const resourceTypeOptions = [
    { value: 'web', label: t('tasks:resources.types.web') },
    { value: 'video', label: t('tasks:resources.types.video') },
    { value: 'document', label: t('tasks:resources.types.document') },
    { value: 'book', label: t('tasks:resources.types.book') },
    { value: 'article', label: t('tasks:resources.types.article') },
    { value: 'other', label: t('tasks:resources.types.other') },
  ]

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
            {t('tasks:resources.addModal.title')}
          </Typography>
          <IconButton 
            onClick={onClose}
            aria-label={t('ui.close', { ns: 'common' })}>
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
            {t('tasks:resources.addModal.subtitle')}
          </Typography>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel id="resource-type-label">
                  {t('tasks:resources.addModal.typeLabel')}
                </InputLabel>
                <Select
                  labelId="resource-type-label"
                  id="resource-type"
                  label={t('tasks:resources.addModal.typeLabel')}
                  {...field}
                >
                  {resourceTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <TextField
            id="resource-title"
            label={t('tasks:resources.addModal.titleLabel')}
            placeholder={t('tasks:resources.addModal.titlePlaceholder')}
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            id="resource-link"
            label={t('tasks:resources.addModal.urlLabel')}
            placeholder={t('tasks:resources.addModal.urlPlaceholder')}
            fullWidth
            {...register('link')}
            error={!!errors.link}
            helperText={errors.link?.message}
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
            {t('tasks:resources.addModal.addButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddResourceModal

