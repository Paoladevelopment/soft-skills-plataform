import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid2,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'
import { PromptType, GameSessionDifficulty } from '../../types/game-sessions/gameSession.models'

const ContentSettingsSection = () => {
  const allowedTypes = useGameSessionDraftStore((state) => state.allowedTypes)
  const difficulty = useGameSessionDraftStore((state) => state.difficulty)
  const togglePromptType = useGameSessionDraftStore((state) => state.togglePromptType)
  const setDifficulty = useGameSessionDraftStore((state) => state.setDifficulty)

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        Content Settings
      </Typography>
      <FormControl component="fieldset">
        <FormLabel 
          component="legend" 
          sx={{ 
            color: 'white !important', 
            mb: 1 
          }}
        >
          Allowed Prompt Types (select at least one)
        </FormLabel>
        <FormGroup 
          sx={{ 
            '& .MuiFormControlLabel-label': { 
                color: 'white !important' 
              },
            }}
          >
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(PromptType.DESCRIPTIVE)}
                    onChange={() => togglePromptType(PromptType.DESCRIPTIVE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Descriptive"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(PromptType.HISTORICAL_EVENT)}
                    onChange={() => togglePromptType(PromptType.HISTORICAL_EVENT)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Historical Event"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(PromptType.INSTRUCTIONAL)}
                    onChange={() => togglePromptType(PromptType.INSTRUCTIONAL)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Instructional"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(PromptType.DIALOGUE)}
                    onChange={() => togglePromptType(PromptType.DIALOGUE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Dialogue"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(PromptType.NARRATED_DIALOGUE)}
                    onChange={() => togglePromptType(PromptType.NARRATED_DIALOGUE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Narrated Dialogue"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
          </Grid2>
        </FormGroup>
      </FormControl>

      <Box mt={2}>
        <Typography variant="body2" color="white" mb={1}>
          Difficulty Level
        </Typography>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as GameSessionDifficulty)}
          size="small"
          fullWidth
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
        >
          <MenuItem value={GameSessionDifficulty.EASY}>Easy</MenuItem>
          <MenuItem value={GameSessionDifficulty.INTERMEDIATE}>Intermediate</MenuItem>
          <MenuItem value={GameSessionDifficulty.HARD}>Hard</MenuItem>
        </Select>
      </Box>
    </Box>
  )
}

export default ContentSettingsSection

