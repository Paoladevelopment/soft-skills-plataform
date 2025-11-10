import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
} from '@mui/material'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { PerceivedDifficulty, Mood } from '../../../types/self-evaluation/self-evaluation.enums'
import LearningMethodsSection from './LearningMethodsSection'

const SessionAssessmentSection = () => {
  const formData = useSelfEvaluationDraftStore((state) => state)
  const setPerceivedDifficulty = useSelfEvaluationDraftStore((state) => state.setPerceivedDifficulty)
  const setConcentrationLevel = useSelfEvaluationDraftStore((state) => state.setConcentrationLevel)
  const setMood = useSelfEvaluationDraftStore((state) => state.setMood)
  const setKnowledgeConnection = useSelfEvaluationDraftStore((state) => state.setKnowledgeConnection)

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="perceived-difficulty-label">How hard did this feel?</InputLabel>
        <Select
          labelId="perceived-difficulty-label"
          id="perceived-difficulty"
          value={formData.perceived_difficulty ?? PerceivedDifficulty.MODERATE}
          label="How hard did this feel?"
          onChange={(e) => setPerceivedDifficulty(e.target.value as PerceivedDifficulty)}
        >
          <MenuItem value={PerceivedDifficulty.EASY}>Easy</MenuItem>
          <MenuItem value={PerceivedDifficulty.MODERATE}>Moderate</MenuItem>
          <MenuItem value={PerceivedDifficulty.HARD}>Hard</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Typography gutterBottom>
          Concentration Level: {formData.concentration_level}/10
        </Typography>
        <Slider
          value={formData.concentration_level}
          onChange={(_, value) => setConcentrationLevel(value as number)}
          min={1}
          max={10}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <FormControl fullWidth>
        <InputLabel id="mood-label">Mood</InputLabel>
        <Select
          labelId="mood-label"
          id="mood"
          value={formData.mood ?? Mood.NEUTRAL}
          label="Mood"
          onChange={(e) => setMood(e.target.value as Mood)}
        >
          <MenuItem value={Mood.ENERGIZED}>Energized</MenuItem>
          <MenuItem value={Mood.CALM}>Calm</MenuItem>
          <MenuItem value={Mood.NEUTRAL}>Neutral</MenuItem>
          <MenuItem value={Mood.TIRED}>Tired</MenuItem>
          <MenuItem value={Mood.FRUSTRATED}>Frustrated</MenuItem>
          <MenuItem value={Mood.STRESSED}>Stressed</MenuItem>
          <MenuItem value={Mood.OTHER}>Other</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.knowledge_connection}
            onChange={(e) => setKnowledgeConnection(e.target.checked)}
          />
        }
        label="I was able to connect this knowledge with previous learning"
      />

      <LearningMethodsSection />
    </Stack>
  )
}

export default SessionAssessmentSection
