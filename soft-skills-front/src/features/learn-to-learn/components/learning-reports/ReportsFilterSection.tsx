import { Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { PerceivedDifficulty, Mood } from '../../types/self-evaluation/self-evaluation.enums'

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
        <InputLabel id="sort-by-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by"
          value={sortBy}
          label="Sort by"
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <MenuItem value="date_desc">Date (Newest first)</MenuItem>
          <MenuItem value="date_asc">Date (Oldest first)</MenuItem>
        </Select>
      </FormControl>

      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 150 
        }}
      >
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          labelId="difficulty-label"
          id="difficulty"
          value={difficultyFilter}
          label="Difficulty"
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value={PerceivedDifficulty.EASY}>Easy</MenuItem>
          <MenuItem value={PerceivedDifficulty.MODERATE}>Medium</MenuItem>
          <MenuItem value={PerceivedDifficulty.HARD}>Hard</MenuItem>
        </Select>
      </FormControl>

      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 150 
        }}
      >
        <InputLabel id="mood-label">Mood</InputLabel>
        <Select
          labelId="mood-label"
          id="mood"
          value={moodFilter}
          label="Mood"
          onChange={(e) => onMoodChange(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value={Mood.ENERGIZED}>Energized</MenuItem>
          <MenuItem value={Mood.CALM}>Calm</MenuItem>
          <MenuItem value={Mood.NEUTRAL}>Neutral</MenuItem>
          <MenuItem value={Mood.TIRED}>Tired</MenuItem>
          <MenuItem value={Mood.FRUSTRATED}>Frustrated</MenuItem>
          <MenuItem value={Mood.STRESSED}>Stressed</MenuItem>
          <MenuItem value={Mood.OTHER}>Other</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}

export default ReportsFilterSection

