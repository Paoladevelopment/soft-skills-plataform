import { Card, CardContent, TextField, MenuItem, Button, Stack, InputAdornment } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as LinkIcon, Delete as DeleteIcon, Title as TitleIcon } from '@mui/icons-material'
import { Resource } from '../../types/planner/resource.api'

interface ResourceCardProps {
  resource: Resource
  editedResource: Partial<Resource>
  onFieldChange: (resourceId: string, field: keyof Resource, value: string) => void
  onSave: (resource: Resource) => void
  onDelete: (resource: Resource) => void
}

const ResourceCard = ({
  resource,
  editedResource,
  onFieldChange,
  onSave,
  onDelete
}: ResourceCardProps) => {
  const { t } = useTranslation(['tasks', 'common'])
  
  const resourceTypeOptions = [
    { value: 'web', label: t('tasks:resources.types.web') },
    { value: 'video', label: t('tasks:resources.types.video') },
    { value: 'document', label: t('tasks:resources.types.document') },
    { value: 'book', label: t('tasks:resources.types.book') },
    { value: 'article', label: t('tasks:resources.types.article') },
    { value: 'other', label: t('tasks:resources.types.other') },
  ]
  
  const displayResource = { ...resource, ...editedResource }
  const hasChanges = Object.keys(editedResource).length > 0

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <TextField
            select
            label={t('tasks:resources.addModal.typeLabel')}
            value={displayResource.type}
            onChange={(e) => onFieldChange(resource.resourceId, 'type', e.target.value)}
            fullWidth
            size="small"
          >
            {resourceTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('tasks:resources.addModal.titleLabel')}
            value={displayResource.title}
            onChange={(e) => onFieldChange(resource.resourceId, 'title', e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t('tasks:resources.addModal.urlLabel')}
            value={displayResource.link}
            onChange={(e) => onFieldChange(resource.resourceId, 'link', e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {hasChanges && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onSave(resource)}
            >
              {t('actions.save', { ns: 'common', defaultValue: 'Save' })}
            </Button>
          )}

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(resource)}
            fullWidth
          >
            {t('actions.delete', { ns: 'common' })}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ResourceCard

