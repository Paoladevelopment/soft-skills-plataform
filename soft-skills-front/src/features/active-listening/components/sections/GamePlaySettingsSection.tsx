import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid2,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'
import { PlayMode } from '../../types/game-sessions/gameSession.models'

const GamePlaySettingsSection = () => {
  const { t } = useTranslation('game')
  const selectedModes = useGameSessionDraftStore((state) => state.selectedModes)
  const togglePlayMode = useGameSessionDraftStore((state) => state.togglePlayMode)

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        {t('play.settings.title')}
      </Typography>
      <FormControl component="fieldset">
        <FormLabel 
          component="legend" 
          sx={{ 
            color: 'white !important', 
            mb: 1 
          }}
        >
          {t('play.settings.allowedModes')}
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
                    checked={selectedModes.includes(PlayMode.FOCUS)}
                    onChange={() => togglePlayMode(PlayMode.FOCUS)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label={t('play.settings.focus')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModes.includes(PlayMode.CLOZE)}
                    onChange={() => togglePlayMode(PlayMode.CLOZE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label={t('play.settings.cloze')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModes.includes(PlayMode.PARAPHRASE)}
                    onChange={() => togglePlayMode(PlayMode.PARAPHRASE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label={t('play.settings.paraphrase')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModes.includes(PlayMode.SUMMARIZE)}
                    onChange={() => togglePlayMode(PlayMode.SUMMARIZE)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label={t('play.settings.summarize')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModes.includes(PlayMode.CLARIFY)}
                    onChange={() => togglePlayMode(PlayMode.CLARIFY)}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: '#ED8936' },
                    }}
                  />
                }
                label={t('play.settings.clarify')}
                sx={{ alignItems: 'center', margin: 0 }}
              />
            </Grid2>
          </Grid2>
        </FormGroup>
      </FormControl>
    </Box>
  )
}

export default GamePlaySettingsSection

