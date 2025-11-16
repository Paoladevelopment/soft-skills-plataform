import { Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PerceivedDifficulty, Mood } from '../../types/self-evaluation/self-evaluation.enums'
import { formatDifficulty, formatMood } from '../../utils/selfEvaluationFormatters'

type SortOption = 'date_desc' | 'date_asc'

interface ReportsFilterSectionProps {
  sortBy: SortOption
  difficultyFilter: string
  moodFilter: string
  onSortChange: (value: SortOption) => void
  onDifficultyChange: (value: string) => void
  onMoodChange: (value: string) => void
}

const ReportsFilterSection = ({
  sortBy,
  difficultyFilter,
  moodFilter,
  onSortChange,
  onDifficultyChange,
  onMoodChange,
}: ReportsFilterSectionProps) => {
  const { t } = useTranslation('reports')
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        p: 2,
      }}
    >
      <FormControl 
        size="small" 
        sx={{ 
            minWidth: 200 
        }}
      >
        <InputLabel id="sort-by-label">{t('filters.sortBy')}</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by"
          value={sortBy}
          label={t('filters.sortBy')}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <MenuItem value="date_desc">{t('filters.dateDesc')}</MenuItem>
          <MenuItem value="date_asc">{t('filters.dateAsc')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 150 
        }}
      >
        <InputLabel id="difficulty-label">{t('filters.difficulty')}</InputLabel>
        <Select
          labelId="difficulty-label"
          id="difficulty"
          value={difficultyFilter}
          label={t('filters.difficulty')}
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <MenuItem value="All">{t('filters.all')}</MenuItem>
          <MenuItem value={PerceivedDifficulty.EASY}>{formatDifficulty(PerceivedDifficulty.EASY)}</MenuItem>
          <MenuItem value={PerceivedDifficulty.MODERATE}>{formatDifficulty(PerceivedDifficulty.MODERATE)}</MenuItem>
          <MenuItem value={PerceivedDifficulty.HARD}>{formatDifficulty(PerceivedDifficulty.HARD)}</MenuItem>
        </Select>
      </FormControl>

      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 150 
        }}
      >
        <InputLabel id="mood-label">{t('filters.mood')}</InputLabel>
        <Select
          labelId="mood-label"
          id="mood"
          value={moodFilter}
          label={t('filters.mood')}
          onChange={(e) => onMoodChange(e.target.value)}
        >
          <MenuItem value="All">{t('filters.all')}</MenuItem>
          <MenuItem value={Mood.ENERGIZED}>{formatMood(Mood.ENERGIZED)}</MenuItem>
          <MenuItem value={Mood.CALM}>{formatMood(Mood.CALM)}</MenuItem>
          <MenuItem value={Mood.NEUTRAL}>{formatMood(Mood.NEUTRAL)}</MenuItem>
          <MenuItem value={Mood.TIRED}>{formatMood(Mood.TIRED)}</MenuItem>
          <MenuItem value={Mood.FRUSTRATED}>{formatMood(Mood.FRUSTRATED)}</MenuItem>
          <MenuItem value={Mood.STRESSED}>{formatMood(Mood.STRESSED)}</MenuItem>
          <MenuItem value={Mood.OTHER}>{formatMood(Mood.OTHER)}</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}

export default ReportsFilterSection

