import { Box, Checkbox, FormControlLabel, Slider, Stack, Typography } from '@mui/material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'

const AudioEffectsSection = () => {
  const reverb = useRoomDraftStore((state) => state.reverb)
  const echo = useRoomDraftStore((state) => state.echo)
  const noise = useRoomDraftStore((state) => state.noise)
  const speedVar = useRoomDraftStore((state) => state.speedVar)
  const setAudio = useRoomDraftStore((state) => state.setAudio)

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        Audio Effects (Optional)
      </Typography>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={reverb > 0}
              onChange={(e) => setAudio('reverb', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label="Reverb (0.0 - 1.0)"
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
              onChange={(_, value) => setAudio('reverb', value as number)}
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
              onChange={(e) => setAudio('echo', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label="Echo (0.0 - 1.0)"
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
              onChange={(_, value) => setAudio('echo', value as number)}
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
              checked={noise > 0}
              onChange={(e) => setAudio('noise', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label="Background Noise (0.0 - 1.0)"
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {noise > 0 && (
          <Box px={2}>
            <Slider
              value={noise}
              onChange={(_, value) => setAudio('noise', value as number)}
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
              checked={speedVar > 0}
              onChange={(e) => setAudio('speedVar', e.target.checked ? 0.3 : 0)}
              sx={{
                color: 'white',
                '&.Mui-checked': { color: '#ED8936' },
              }}
            />
          }
          label="Speed Variation (0.0 - 1.0)"
          sx={{
            color: 'white',
            '& .MuiFormControlLabel-label': { color: 'white' },
            alignItems: 'center',
          }}
        />
        {speedVar > 0 && (
          <Box px={2}>
            <Slider
              value={speedVar}
              onChange={(_, value) => setAudio('speedVar', value as number)}
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

