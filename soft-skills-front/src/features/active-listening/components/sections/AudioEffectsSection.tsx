import { Box, Checkbox, FormControlLabel, Slider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'

const AudioEffectsSection = () => {
  const { t } = useTranslation('game')
  
  const audioEffects = useGameSessionDraftStore((state) => state.audioEffects)
  const setAudioEffect = useGameSessionDraftStore((state) => state.setAudioEffect)
  
  const reverb = audioEffects.reverb || 0
  const echo = audioEffects.echo || 0
  const backgroundNoise = audioEffects.backgroundNoise || 0
  const speedVariation = audioEffects.speedVariation || 0

  return (
    <Box>
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        color="white" 
        mb={2}
      >
        {t('play.sessionForm.audioEffects.title')}
      </Typography>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={reverb > 0}
              onChange={(e) => setAudioEffect('reverb', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label={t('play.sessionForm.audioEffects.reverb')}
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {reverb > 0 && (
          <Box px={2}>
            <Slider
              value={reverb}
              onChange={(_, value) => setAudioEffect('reverb', value as number)}
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="on"
              sx={{
                color: '#ED8936',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#ED8936',
                  '&::before': {
                    borderTopColor: '#ED8936',
                  },
                },
              }}
            />
          </Box>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={echo > 0}
              onChange={(e) => setAudioEffect('echo', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label={t('play.sessionForm.audioEffects.echo')}
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {echo > 0 && (
          <Box px={2}>
            <Slider
              value={echo}
              onChange={(_, value) => setAudioEffect('echo', value as number)}
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="on"
              sx={{
                color: '#ED8936',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#ED8936',
                  '&::before': {
                    borderTopColor: '#ED8936',
                  },
                },
              }}
            />
          </Box>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={backgroundNoise > 0}
              onChange={(e) => setAudioEffect('backgroundNoise', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label={t('play.sessionForm.audioEffects.backgroundNoise')}
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {backgroundNoise > 0 && (
          <Box px={2}>
            <Slider
              value={backgroundNoise}
              onChange={(_, value) => setAudioEffect('backgroundNoise', value as number)}
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="on"
              sx={{
                color: '#ED8936',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#ED8936',
                  '&::before': {
                    borderTopColor: '#ED8936',
                  },
                },
              }}
            />
          </Box>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={speedVariation > 0}
              onChange={(e) => setAudioEffect('speedVariation', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label={t('play.sessionForm.audioEffects.speedVariation')}
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {speedVariation > 0 && (
          <Box px={2}>
            <Slider
              value={speedVariation}
              onChange={(_, value) => setAudioEffect('speedVariation', value as number)}
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="on"
              sx={{
                color: '#ED8936',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#ED8936',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#ED8936',
                  '&::before': {
                    borderTopColor: '#ED8936',
                  },
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default AudioEffectsSection

