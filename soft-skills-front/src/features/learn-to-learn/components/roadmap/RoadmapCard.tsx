import {
  Typography,
  Stack,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  SxProps,
  Theme
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import { useState } from 'react'
import { RoadmapSummary } from '../../types/roadmap/roadmap.models'
import { formatDateString } from '../../../../utils/formatDate'

interface RoadmapCardProps {
  roadmapSummary: RoadmapSummary
  onDeleteClick?: () => void
  onViewClick?: () => void
  mode?: 'private' | 'public'
}

const getConditionalStyles = (isPublicMode: boolean): {
  title: SxProps<Theme>
  description: SxProps<Theme>
  cardHeader: SxProps<Theme>
  cardContent: SxProps<Theme>
  cardActions: SxProps<Theme>
} => ({
  title: isPublicMode ? {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.3,
    minHeight: '2.6em'
  } : {},
  
  description: isPublicMode ? {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    mb: 2,
    minHeight: '3.6em',
    lineHeight: 1.4
  } : { mb: 2 },
  
  cardHeader: {
    pb: isPublicMode ? 1 : 'default'
  },
  
  cardContent: {
    pt: isPublicMode ? 0 : 'default',
    pb: 2
  },
  
  cardActions: {
    justifyContent: "center",
    pt: isPublicMode ? 0 : 'default'
  }
})

const getStepsText = (stepsCount: number): string => {
  return `${stepsCount} ${stepsCount === 1 ? 'step' : 'steps'}`
}

const getConditionalContent = (isPublicMode: boolean, roadmapSummary: RoadmapSummary) => ({
  descriptionText: roadmapSummary.description || (isPublicMode ? 'No description available' : ''),
  dateFormat: isPublicMode ? "Created" : "Created:",
  showAuthor: isPublicMode,
  showVisibilityIcon: !isPublicMode,
  showDeleteAction: !isPublicMode
})

const RoadmapCard = ({ roadmapSummary, onDeleteClick, onViewClick, mode = 'private' }: RoadmapCardProps) => {
  const [hovered, setHovered] = useState(false)

  const stepsCount = roadmapSummary.stepsCount || 0
  const isPublicMode = mode === 'public'
  const styles = getConditionalStyles(isPublicMode)
  const content = getConditionalContent(isPublicMode, roadmapSummary)

  return (
    <Card 
      variant='outlined'
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: hovered ? "#a9a9a9": "divider",
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: "none",
        minHeight: 300,
        width: '100%',
        height: '100%',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardHeader
        title={
          isPublicMode ? (
            <Typography 
              variant="h6" 
              component="span"
              sx={styles.title}
            >
              {roadmapSummary.title}
            </Typography>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" component="span">
                {roadmapSummary.title}
              </Typography>
              {content.showVisibilityIcon && (
                roadmapSummary.visibility === 'public' ? (
                  <PublicIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                ) : (
                  <LockIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                )
              )}
            </Stack>
          )
        }
        action={
          content.showDeleteAction && hovered && (
            <IconButton aria-label='delete' onClick={onDeleteClick}>
              <DeleteIcon/>
            </IconButton>
          )
        }
        sx={styles.cardHeader}
      />
      <CardContent sx={styles.cardContent}>
        <Typography 
          variant='body2' 
          color="text.secondary" 
          sx={styles.description}
        >
          {content.descriptionText}
        </Typography>

        {content.showAuthor && (
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <PersonIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {roadmapSummary.username}
            </Typography>
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isPublicMode ? 2 : 0}>
          <Typography variant="caption" color="text.secondary">
            {formatDateString(roadmapSummary.createdAt, "Not defined", content.dateFormat)}
          </Typography>

          {isPublicMode ? (
            <Chip 
              label={getStepsText(stepsCount)}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem',
                height: '24px'
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              {getStepsText(stepsCount)}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={styles.cardActions}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={isPublicMode ? (e) => {
            e.stopPropagation()
            onViewClick?.()
          } : onViewClick}
          endIcon={<OpenInNewIcon />}
          sx={{
            fontWeight: 500,
          }}
        >
          View Roadmap
        </Button>
      </CardActions>
    </Card>
  )
}

export default RoadmapCard