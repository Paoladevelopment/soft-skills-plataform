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
import { useTranslation } from 'react-i18next'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'
import { PromptType, GameSessionDifficulty } from '../../types/game-sessions/gameSession.models'

const ContentSettingsSection = () => {
  const { t } = useTranslation('game')
  
  const allowedTypes = useGameSessionDraftStore((state) => state.allowedTypes)
  const difficulty = useGameSessionDraftStore((state) => state.difficulty)
  const togglePromptType = useGameSessionDraftStore((state) => state.togglePromptType)
  const setDifficulty = useGameSessionDraftStore((state) => state.setDifficulty)

  return (
    <Box>
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        color="white" 
        mb={2}
      >
        {t('play.sessionForm.contentSettings.title')}
      </Typography>
      <FormControl component="fieldset">
        <FormLabel 
          component="legend" 
          sx={{ 
            color: 'white !important', 
            mb: 1 
          }}
        >
          {t('play.sessionForm.contentSettings.allowedPromptTypes')}
        </FormLabel>
        <FormGroup 
          sx={{ 
            '& .MuiFormControlLabel-label': { 
                color: 'white !important' 
              },
            }}
          >
          <Grid2 container spacing={2}>
            <Grid2 
              size={{ 
                xs: 6, 
                md: 4 
              }}
            >
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
                label={t('play.sessionForm.contentSettings.promptTypes.descriptive')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 
              size={{ 
                xs: 6, 
                md: 4 
              }}
            >
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
                label={t('play.sessionForm.contentSettings.promptTypes.historicalEvent')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 
              size={{ 
                xs: 6, 
                md: 4 
              }}
            >
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
                label={t('play.sessionForm.contentSettings.promptTypes.instructional')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 
              size={{ 
                xs: 6, 
                md: 4 
              }}
            >
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
                label={t('play.sessionForm.contentSettings.promptTypes.dialogue')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 
              size={{
                xs: 6, 
                md: 4 
              }}
            >
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
                label={t('play.sessionForm.contentSettings.promptTypes.narratedDialogue')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
          </Grid2>
        </FormGroup>
      </FormControl>

      <Box mt={2}>
        <Typography 
          variant="body2" 
          color="white" 
          mb={1}
        >
          {t('play.sessionForm.contentSettings.difficultyLevel')}
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
          <MenuItem 
            value={GameSessionDifficulty.EASY}
          >
            {t('play.sessionForm.contentSettings.difficulty.easy')}
          </MenuItem>
          <MenuItem 
            value={GameSessionDifficulty.INTERMEDIATE}
          >
            {t('play.sessionForm.contentSettings.difficulty.intermediate')}
          </MenuItem>
          <MenuItem 
            value={GameSessionDifficulty.HARD}
          >
            {t('play.sessionForm.contentSettings.difficulty.hard')}
          </MenuItem>
        </Select>
      </Box>
    </Box>
  )
}

export default ContentSettingsSection

