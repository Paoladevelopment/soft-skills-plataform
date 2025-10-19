import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'
import { AllowedType, RoomDifficulty } from '../../types/room/room.models'

const ContentSettingsSection = () => {
  const allowedTypes = useRoomDraftStore((state) => state.allowedTypes)
  const difficulty = useRoomDraftStore((state) => state.difficulty)
  const toggleAllowedType = useRoomDraftStore((state) => state.toggleAllowedType)
  const setField = useRoomDraftStore((state) => state.setField)

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        Content Settings
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ color: 'white !important', mb: 1 }}>
          Allowed Prompt Types (select at least one)
        </FormLabel>
        <FormGroup sx={{ '& .MuiFormControlLabel-label': { color: 'white !important' } }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.DESCRIPTIVE)}
                    onChange={() => toggleAllowedType(AllowedType.DESCRIPTIVE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Descriptive"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.CONVERSATIONAL)}
                    onChange={() => toggleAllowedType(AllowedType.CONVERSATIONAL)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Conversational"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.HISTORICAL_EVENT)}
                    onChange={() => toggleAllowedType(AllowedType.HISTORICAL_EVENT)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Historical Event"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.INSTRUCTIONAL)}
                    onChange={() => toggleAllowedType(AllowedType.INSTRUCTIONAL)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Instructional"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.DIALOGUE)}
                    onChange={() => toggleAllowedType(AllowedType.DIALOGUE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Dialogue"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowedTypes.includes(AllowedType.NARRATIVE_DIALOGUE)}
                    onChange={() => toggleAllowedType(AllowedType.NARRATIVE_DIALOGUE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label="Narrated Dialogue"
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid>
          </Grid>
        </FormGroup>
      </FormControl>

      <Box mt={2}>
        <Typography variant="body2" color="white" mb={1}>
          Difficulty Level
        </Typography>
        <Select
          value={difficulty}
          onChange={(e) => setField('difficulty', e.target.value as RoomDifficulty)}
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
          <MenuItem value={RoomDifficulty.EASY}>Easy</MenuItem>
          <MenuItem value={RoomDifficulty.INTERMEDIATE}>Intermediate</MenuItem>
          <MenuItem value={RoomDifficulty.HARD}>Hard</MenuItem>
        </Select>
      </Box>
    </Box>
  )
}

export default ContentSettingsSection

