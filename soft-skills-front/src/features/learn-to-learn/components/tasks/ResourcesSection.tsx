import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Add } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useResourceStore } from '../../store/useResourceStore'
import AddResourceModal from './AddResourceModal'
import ConfirmDeleteModal from '../../../../components/ConfirmDeleteModal'
import ResourceCard from './ResourceCard' 
import { Resource, EditingResources, UpdateResourcePayload, CreateResourcePayload } from '../../types/planner/resource.api'

interface ResourcesSectionProps {
  taskId: string
}

const ResourcesSection = ({ taskId }: ResourcesSectionProps) => {
  const { t } = useTranslation(['tasks'])
  const { resources, isLoading, fetchTaskResources, createResource, updateResourceById, deleteResourceById } = useResourceStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null)
  const [editingResources, setEditingResources] = useState<EditingResources>({})

  useEffect(() => {
    if (taskId) {
      fetchTaskResources(taskId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  const handleCreateResource = async (payload: CreateResourcePayload) => {
    await createResource(taskId, payload)
    setIsAddModalOpen(false)
  }

  const handleDeleteResource = (resource: Resource) => {
    setResourceToDelete(resource)
  }

  const handleConfirmDelete = async () => {
    if (resourceToDelete) {
      await deleteResourceById(taskId, resourceToDelete.resourceId)
      setResourceToDelete(null)
    }
  }

  const handleFieldChange = (resourceId: string, field: keyof Resource, value: string) => {
    setEditingResources(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [field]: value
      }
    }))
  }

  const handleSaveResource = async (resource: Resource) => {
    const changes = editingResources[resource.resourceId]

    if (changes && Object.keys(changes).length > 0) {
      await updateResourceById(taskId, resource.resourceId, changes as UpdateResourcePayload)
      
      setEditingResources(prev => {
        const newState = { ...prev }
        delete newState[resource.resourceId]
        return newState
      })
    }
  }

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 4 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ 
            mb: 2 
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold"
          >
            {t('tasks:resources.title')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            {t('tasks:resources.addButton')}
          </Button>
        </Stack>

        {resources.length === 0 ? (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              py: 2 
            }}
          >
            {t('tasks:resources.empty', { defaultValue: 'No resources added yet' })}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {resources.map((resource) => {
              const editedResource = editingResources[resource.resourceId] || {}

              return (
                <ResourceCard
                  key={resource.resourceId}
                  resource={resource}
                  editedResource={editedResource}
                  onFieldChange={handleFieldChange}
                  onSave={handleSaveResource}
                  onDelete={handleDeleteResource}
                />
              )
            })}
          </Stack>
        )}
      </Box>

      <AddResourceModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateResource}
      />

      <ConfirmDeleteModal
        open={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t('tasks:resources.deleteConfirm', { defaultValue: 'Delete resource?' })}
        message={t('tasks:resources.deleteMessage', { 
          defaultValue: 'Are you sure you want to delete this resource? This action cannot be undone.',
          resource: resourceToDelete?.title 
        })}
      />
    </>
  )
}

export default ResourcesSection

