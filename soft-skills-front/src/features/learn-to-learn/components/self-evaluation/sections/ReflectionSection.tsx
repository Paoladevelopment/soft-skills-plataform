import { TextField, Stack } from '@mui/material'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'

interface ReflectionSectionProps {
  errors?: {
    what_went_well?: string
    challenges_encountered?: string
    improvement_plan?: string
  }
}

const ReflectionSection = ({ errors }: ReflectionSectionProps) => {
  const formData = useSelfEvaluationDraftStore((state) => state)
  const setWhatWentWell = useSelfEvaluationDraftStore((state) => state.setWhatWentWell)
  const setChallengesEncountered = useSelfEvaluationDraftStore((state) => state.setChallengesEncountered)
  const setImprovementPlan = useSelfEvaluationDraftStore((state) => state.setImprovementPlan)

  return (
    <Stack spacing={2}>
      <TextField
        label="What worked well this time? *"
        placeholder="What aspects of your learning went well?"
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.what_went_well}
        onChange={(e) => setWhatWentWell(e.target.value)}
        error={!!errors?.what_went_well}
        helperText={errors?.what_went_well || "What went well? (max 2000 characters)"}
      />

      <TextField
        label="What was difficult? *"
        placeholder="What challenges did you face?"
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.challenges_encountered}
        onChange={(e) => setChallengesEncountered(e.target.value)}
        error={!!errors?.challenges_encountered}
        helperText={errors?.challenges_encountered || "Challenges encountered (max 2000 characters)"}
      />

      <TextField
        label="What would you do differently next time? *"
        placeholder="How do you plan to improve next time?"
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.improvement_plan}
        onChange={(e) => setImprovementPlan(e.target.value)}
        error={!!errors?.improvement_plan}
        helperText={errors?.improvement_plan || "Improvement plan (max 2000 characters)"}
      />
    </Stack>
  )
}

export default ReflectionSection
