import {
  Box,
  Typography,
  Chip,
  Link,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { findNodeById } from '../../utils/roadmap/roadmapGraphHelpers'
import { findTaskById, findObjectiveById } from '../../utils/roadmap/roadmapStructureUtils'
import { isTaskNode, isObjectiveNode } from '../../utils/roadmap/roadmapNodeTypeUtils'
import { ResourceType } from '../../types/common.enums'

const getResourceTypeLabel = (type: ResourceType): string => {
  const labels: Record<ResourceType, string> = {
    [ResourceType.Article]: 'Article',
    [ResourceType.Book]: 'Book',
    [ResourceType.Video]: 'Video',
    [ResourceType.Web]: 'Web',
    [ResourceType.Other]: 'Other',
  }
  return labels[type] || type
}

const getResourceTypeColor = (type: ResourceType): string => {
  const colors: Record<ResourceType, string> = {
    [ResourceType.Article]: '#FFE082',
    [ResourceType.Book]: '#C7E9B0',
    [ResourceType.Video]: '#A0D2EB',
    [ResourceType.Web]: '#FFCDCD',
    [ResourceType.Other]: '#D5AAFF',
  }
  return colors[type] || '#FFE082'
}

interface TaskInformationSidebarProps {
  selectedNodeId: string | null
  onClose: () => void
}

const TaskInformationSidebar = ({ selectedNodeId, onClose }: TaskInformationSidebarProps) => {
  const {
    selectedRoadmap,
    editorNodes,
  } = useRoadmapStore()

  if (!selectedNodeId || !selectedRoadmap) return null

  const node = findNodeById(editorNodes, selectedNodeId)
  if (!node) return null

  const task = isTaskNode(node)
    ? findTaskById(selectedRoadmap, node.id)
    : undefined

  const objective = isObjectiveNode(node)
    ? findObjectiveById(selectedRoadmap, node.id)
    : undefined

  const content = task || objective
  if (!content) return null

  const title = content.contentTitle || content.title
  const description = content.description
  const resources = content.resources || []

  return (
    <Box
      sx={{
        width: 400,
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'secondary.500',
        }}
      >
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 3,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}

        {resources.length > 0 && (
          <>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Visit the following resources to learn more:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {resources.map((resource, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    label={getResourceTypeLabel(resource.type)}
                    size="small"
                    sx={{
                      backgroundColor: getResourceTypeColor(resource.type),
                      color: '#000',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                      minWidth: '70px',
                    }}
                  />
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: 'underline',
                      color: 'primary.main',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: 'primary.dark',
                      },
                    }}
                  >
                    {resource.title}
                  </Link>
                </Box>
              ))}
            </Box>
          </>
        )}

        {resources.length === 0 && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            No resources available
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default TaskInformationSidebar

