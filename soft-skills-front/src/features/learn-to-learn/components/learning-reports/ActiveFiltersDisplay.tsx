import { Box, Typography, Chip, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PerceivedDifficulty, Mood } from '../../types/self-evaluation/self-evaluation.enums'
import { formatDifficulty, formatMood } from '../../utils/selfEvaluationFormatters'

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
      return formatDifficulty(PerceivedDifficulty.EASY)
    case PerceivedDifficulty.MODERATE:
      return formatDifficulty(PerceivedDifficulty.MODERATE)
    case PerceivedDifficulty.HARD:
      return formatDifficulty(PerceivedDifficulty.HARD)
    default:
      return value
  }
}

const getMoodLabel = (value: string): string => {
  switch (value) {
    case Mood.ENERGIZED:
      return formatMood(Mood.ENERGIZED)
    case Mood.CALM:
      return formatMood(Mood.CALM)
    case Mood.NEUTRAL:
      return formatMood(Mood.NEUTRAL)
    case Mood.TIRED:
      return formatMood(Mood.TIRED)
    case Mood.FRUSTRATED:
      return formatMood(Mood.FRUSTRATED)
    case Mood.STRESSED:
      return formatMood(Mood.STRESSED)
    case Mood.OTHER:
      return formatMood(Mood.OTHER)
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
  const { t } = useTranslation('reports')
  const activeFilters: ActiveFilter[] = []

  if (difficultyFilter !== 'All') {
    activeFilters.push({
      key: 'difficulty',
      label: `${t('filters.difficulty')}: ${getDifficultyLabel(difficultyFilter)}`,
      type: 'difficulty'
    })
  }

  if (moodFilter !== 'All') {
    activeFilters.push({
      key: 'mood',
      label: `${t('filters.mood')}: ${getMoodLabel(moodFilter)}`,
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
        {t('filters.activeFilters', { defaultValue: 'Active filters:' })}
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
        {t('filters.clearAll')}
      </Button>
    </Box>
  )
}

export default ActiveFiltersDisplay

