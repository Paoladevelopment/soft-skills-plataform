import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
  Grid2,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { LearningMethod } from '../../../types/self-evaluation/self-evaluation.enums'
import { formatLearningMethod } from '../../../utils/selfEvaluationFormatters'

const LearningMethodsSection = () => {
  const { t } = useTranslation('reports')
  const learningMethods = useSelfEvaluationDraftStore((state) => state.learning_methods)
  const toggleLearningMethod = useSelfEvaluationDraftStore((state) => state.toggleLearningMethod)

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel 
        component="legend" 
        sx={{ 
          mb: 1, 
          color: 'text.primary' 
        }}
      >
        {t('selfEvaluation.fields.whatStrategiesDidYouUse')}
      </FormLabel>
      <FormGroup>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.PRACTICE)}
                  onChange={() => toggleLearningMethod(LearningMethod.PRACTICE)}
                />
              }
              label={formatLearningMethod(LearningMethod.PRACTICE)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.NOTE_TAKING)}
                  onChange={() => toggleLearningMethod(LearningMethod.NOTE_TAKING)}
                />
              }
              label={formatLearningMethod(LearningMethod.NOTE_TAKING)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.SPACED_REPETITION)}
                  onChange={() => toggleLearningMethod(LearningMethod.SPACED_REPETITION)}
                />
              }
              label={formatLearningMethod(LearningMethod.SPACED_REPETITION)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.SUMMARIZATION)}
                  onChange={() => toggleLearningMethod(LearningMethod.SUMMARIZATION)}
                />
              }
              label={formatLearningMethod(LearningMethod.SUMMARIZATION)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.TEACH_BACK)}
                  onChange={() => toggleLearningMethod(LearningMethod.TEACH_BACK)}
                />
              }
              label={formatLearningMethod(LearningMethod.TEACH_BACK)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.FLASHCARDS)}
                  onChange={() => toggleLearningMethod(LearningMethod.FLASHCARDS)}
                />
              }
              label={formatLearningMethod(LearningMethod.FLASHCARDS)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={learningMethods.includes(LearningMethod.OTHER)}
                  onChange={() => toggleLearningMethod(LearningMethod.OTHER)}
                />
              }
              label={formatLearningMethod(LearningMethod.OTHER)}
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
        </Grid2>
      </FormGroup>
    </FormControl>
  )
}

export default LearningMethodsSection
