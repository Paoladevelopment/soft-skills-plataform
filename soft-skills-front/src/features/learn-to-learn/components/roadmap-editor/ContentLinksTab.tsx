import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  Button,
  InputAdornment,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { CircleCheck, Link as LinkIcon } from 'lucide-react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { ResourceType } from '../../types/common.enums'
import { findNodeById } from '../../utils/roadmap/roadmap_graph_helpers'
import { Resource } from '../../types/roadmap/roadmap.models'
import {
  findObjectiveById,
  findParentObjectiveOfTask,
  findTaskById,
} from '../../utils/roadmap/roadmap_structure_utils'
import { isObjectiveNode } from '../../utils/roadmap/roadmap_node_type_utils'

const ContentAndLinksTab = () => {
  const {
    selectedNodeId,
    selectedRoadmap,
    editorNodes,
    updateObjectiveContent,
    updateTaskContent,
  } = useRoadmapStore()

  const node = selectedNodeId ? findNodeById(editorNodes, selectedNodeId) : null

  const objective = selectedRoadmap && node
    ? findObjectiveById(selectedRoadmap, node.id)
    : undefined

  const task = selectedRoadmap && node
    ? findTaskById(selectedRoadmap, node.id)
    : undefined

  const isObjective = node ? isObjectiveNode(node) : false
  const contentFields = isObjective ? objective : task

  if (!selectedRoadmap || !node) return null

  const resources = contentFields?.resources ?? []

  const handleChange = (
    field: 'contentTitle' | 'description' | 'resources',
    value: string | Resource[]
  ) => {
    if (isObjective && objective) {
      updateObjectiveContent(objective.objectiveId, { [field]: value })
      return
    }

    if (task) {
      const parentObjective = findParentObjectiveOfTask(selectedRoadmap, task.taskId)
      if (parentObjective) {
        updateTaskContent(parentObjective.objectiveId, task.taskId, { [field]: value })
      }
    }
  }

  const handleResourceChange = (
    index: number,
    field: keyof Resource,
    value: string
  ) => {
    const updatedResources = [...resources]
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    }
    handleChange('resources', updatedResources)
  }
  
  const handleAddResource = () => {
    const resource = { type: ResourceType.Article, title: '', url: '' }
    const newResources = [...resources, resource]
    handleChange('resources', newResources)
  }
  
  const handleRemoveResource = (index: number) => {
    const updatedResources = resources.filter((_, i) => i !== index)
    handleChange('resources', updatedResources)
  }

  return (
    <Box>
      <Typography fontWeight="bold" mb={1}>
        Title
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={contentFields?.contentTitle ?? ''}
        onChange={(e) => handleChange('contentTitle', e.target.value)}
        sx={{ 
          mb: 2 
        }}
        placeholder="Enter Title"
      />

      <Typography fontWeight="bold" mb={1}>
        Description
      </Typography>
      <TextField
        fullWidth
        size="small"
        multiline
        minRows={10}
        value={contentFields?.description ?? ''}
        onChange={(e) => handleChange('description', e.target.value)}
        sx={{
          mb: 3 
        }}
        placeholder="Enter Description"
      />

      {resources.map((res, index) => (
        <Box 
          key={index} 
          sx={{ 
            mb: 3, 
            border: '1px solid #eee', 
            borderRadius: 1, 
            p: 2 
          }}
        >
          <Select
            fullWidth
            size="small"
            value={res.type}
            onChange={(e) =>
              handleResourceChange(index, 'type', e.target.value as ResourceType)
            }
            sx={{ mb: 1 }}
          >
            {Object.values(ResourceType).map((type) => (
              <MenuItem 
                key={type} 
                value={type}
              >
                {type}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            size="small"
            value={res.title ?? ''}
            onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
            placeholder="Resource Title"
            sx={{ 
              mb: 1 
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CircleCheck size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            size="small"
            value={res.url ?? ''}
            onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
            placeholder="Resource URL"
            sx={{ 
              mb: 1 
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            onClick={() => handleRemoveResource(index)}
            color="error"
            fullWidth
            startIcon={<DeleteIcon />}
            variant="outlined"
          >
            Remove
          </Button>
        </Box>
      ))}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddResource}
      >
        Add Link
      </Button>
    </Box>
  )
}

export default ContentAndLinksTab