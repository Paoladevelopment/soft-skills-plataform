import { Box, Typography, Chip, Button } from '@mui/material'
import { PerceivedDifficulty, Mood } from '../../types/self-evaluation/self-evaluation.enums'

interface ActiveFilter {
  key: string
  label: string
  type: 'difficulty' | 'mood'
}

interface ActiveFiltersDisplayProps {
  difficultyFilter: string
  moodFilter: string
  onRemoveFilter: (filterType: 'difficulty' | 'mood') => void
  onClearAllFilters: () => void
}

const getDifficultyLabel = (value: string): string => {
  switch (value) {
    case PerceivedDifficulty.EASY:
      return 'Easy'
    case PerceivedDifficulty.MODERATE:
      return 'Medium'
    case PerceivedDifficulty.HARD:
      return 'Hard'
    default:
      return value
  }
}

const getMoodLabel = (value: string): string => {
  switch (value) {
    case Mood.ENERGIZED:
      return 'Energized'
    case Mood.CALM:
      return 'Calm'
    case Mood.NEUTRAL:
      return 'Neutral'
    case Mood.TIRED:
      return 'Tired'
    case Mood.FRUSTRATED:
      return 'Frustrated'
    case Mood.STRESSED:
      return 'Stressed'
    case Mood.OTHER:
      return 'Other'
    default:
      return value
  }
}

const ActiveFiltersDisplay = ({
  difficultyFilter,
  moodFilter,
  onRemoveFilter,
  onClearAllFilters,
}: ActiveFiltersDisplayProps) => {
  const activeFilters: ActiveFilter[] = []

  if (difficultyFilter !== 'All') {
    activeFilters.push({
      key: 'difficulty',
      label: `Difficulty: ${getDifficultyLabel(difficultyFilter)}`,
      type: 'difficulty'
    })
  }

  if (moodFilter !== 'All') {
    activeFilters.push({
      key: 'mood',
      label: `Mood: ${getMoodLabel(moodFilter)}`,
      type: 'mood'
    })
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        flexWrap: 'wrap' 
      }}
    >
      <Typography 
        variant="body1" 
        color="secondary.800" 
        fontWeight="500"
        sx={{ 
          mr: 1 
        }}
      >
        Active filters:
      </Typography>
      
      {activeFilters.map(filter => (
        <Chip
          key={filter.key}
          label={filter.label}
          onDelete={() => onRemoveFilter(filter.type)}
          size="small"
          variant="outlined"
          sx={{
            borderColor: 'secondary.500',
            color: 'secondary.800',
            '& .MuiChip-deleteIcon': {
              color: 'secondary.800',
              '&:hover': {
                color: 'secondary.900'
              }
            },
            '&:hover': {
              backgroundColor: 'secondary.50'
            }
          }}
        />
      ))}
      
      <Button
        variant="text"
        size="small"
        onClick={onClearAllFilters}
        sx={{
          textTransform: 'none',
          color: 'secondary.800',
          fontSize: '0.75rem',
          minWidth: 'auto',
          p: 0.5,
          ml: 1
        }}
      >
        Clear all filters
      </Button>
    </Box>
  )
}

export default ActiveFiltersDisplay

