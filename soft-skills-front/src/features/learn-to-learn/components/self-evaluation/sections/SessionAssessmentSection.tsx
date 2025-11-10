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
import { useTranslation } from 'react-i18next'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { PerceivedDifficulty, Mood } from '../../../types/self-evaluation/self-evaluation.enums'
import { formatDifficulty, formatMood } from '../../../utils/selfEvaluationFormatters'
import LearningMethodsSection from './LearningMethodsSection'

const SessionAssessmentSection = () => {
  const { t } = useTranslation('reports')
  const formData = useSelfEvaluationDraftStore((state) => state)
  const setPerceivedDifficulty = useSelfEvaluationDraftStore((state) => state.setPerceivedDifficulty)
  const setConcentrationLevel = useSelfEvaluationDraftStore((state) => state.setConcentrationLevel)
  const setMood = useSelfEvaluationDraftStore((state) => state.setMood)
  const setKnowledgeConnection = useSelfEvaluationDraftStore((state) => state.setKnowledgeConnection)

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="perceived-difficulty-label">{t('selfEvaluation.fields.howHardDidThisFeel')}</InputLabel>
        <Select
          labelId="perceived-difficulty-label"
          id="perceived-difficulty"
          value={formData.perceived_difficulty ?? PerceivedDifficulty.MODERATE}
          label={t('selfEvaluation.fields.howHardDidThisFeel')}
          onChange={(e) => setPerceivedDifficulty(e.target.value as PerceivedDifficulty)}
        >
          <MenuItem value={PerceivedDifficulty.EASY}>{formatDifficulty(PerceivedDifficulty.EASY)}</MenuItem>
          <MenuItem value={PerceivedDifficulty.MODERATE}>{formatDifficulty(PerceivedDifficulty.MODERATE)}</MenuItem>
          <MenuItem value={PerceivedDifficulty.HARD}>{formatDifficulty(PerceivedDifficulty.HARD)}</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Typography gutterBottom>
          {t('selfEvaluation.fields.concentrationLevel', { level: formData.concentration_level })}
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
        <InputLabel id="mood-label">{t('selfEvaluation.fields.mood')}</InputLabel>
        <Select
          labelId="mood-label"
          id="mood"
          value={formData.mood ?? Mood.NEUTRAL}
          label={t('selfEvaluation.fields.mood')}
          onChange={(e) => setMood(e.target.value as Mood)}
        >
          <MenuItem value={Mood.ENERGIZED}>{formatMood(Mood.ENERGIZED)}</MenuItem>
          <MenuItem value={Mood.CALM}>{formatMood(Mood.CALM)}</MenuItem>
          <MenuItem value={Mood.NEUTRAL}>{formatMood(Mood.NEUTRAL)}</MenuItem>
          <MenuItem value={Mood.TIRED}>{formatMood(Mood.TIRED)}</MenuItem>
          <MenuItem value={Mood.FRUSTRATED}>{formatMood(Mood.FRUSTRATED)}</MenuItem>
          <MenuItem value={Mood.STRESSED}>{formatMood(Mood.STRESSED)}</MenuItem>
          <MenuItem value={Mood.OTHER}>{formatMood(Mood.OTHER)}</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.knowledge_connection}
            onChange={(e) => setKnowledgeConnection(e.target.checked)}
          />
        }
        label={t('selfEvaluation.fields.knowledgeConnection')}
      />

      <LearningMethodsSection />
    </Stack>
  )
}

export default SessionAssessmentSection
