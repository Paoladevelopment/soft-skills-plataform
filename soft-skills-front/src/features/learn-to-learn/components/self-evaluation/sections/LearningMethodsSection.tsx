import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
  Grid2,
} from '@mui/material'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { LearningMethod } from '../../../types/self-evaluation/self-evaluation.enums'

const LearningMethodsSection = () => {
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
        What strategies did you use?
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
              label="Practice"
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
              label="Note Taking"
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
              label="Spaced Repetition"
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
              label="Summarization"
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
              label="Teach Back"
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
              label="Flashcards"
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
              label="Other"
              sx={{ alignItems: 'center', margin: 0 }}
            />
          </Grid2>
        </Grid2>
      </FormGroup>
    </FormControl>
  )
}

export default LearningMethodsSection
