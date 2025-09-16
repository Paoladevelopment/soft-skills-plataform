import {
  Typography,
  Stack,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import { useState } from 'react'
import { RoadmapSummary } from '../../types/roadmap/roadmap.models'
import { formatDateString } from '../../../../utils/formatDate'

interface GoalCardProps {
  roadmapSummary: RoadmapSummary
  onDeleteClick?: () => void
  onViewClick?: () => void
}

const RoadmapCard = ({ roadmapSummary, onDeleteClick, onViewClick }: GoalCardProps) => {
  const [hovered, setHovered] = useState(false)

  const stepsCount = roadmapSummary.stepsCount || 0

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
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" component="span">
              {roadmapSummary.title}
            </Typography>
            {roadmapSummary.visibility === 'public' ? (
              <PublicIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
            ) : (
              <LockIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
            )}
          </Stack>
        }
        action={
          hovered && (
            <IconButton aria-label='delete' onClick={onDeleteClick}>
              <DeleteIcon/>
            </IconButton>
          )
        }
      />
      <CardContent>
        <Typography variant='body2' color="text.secondary" mb={2}>
          {roadmapSummary.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {
              formatDateString(roadmapSummary.createdAt, "Not defined", "Created:")
            }
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {stepsCount} {stepsCount === 1 ? 'step' : 'steps'}
          </Typography>
      </Stack>
      </CardContent>

      <CardActions 
        sx={{ 
          justifyContent: "center"
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onViewClick}
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