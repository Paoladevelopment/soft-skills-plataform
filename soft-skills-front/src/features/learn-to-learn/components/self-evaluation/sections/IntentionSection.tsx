import { TextField } from '@mui/material'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'

interface IntentionSectionProps {
  error?: string
}

const IntentionSection = ({ error }: IntentionSectionProps) => {
  const learningIntention = useSelfEvaluationDraftStore((state) => state.learning_intention)
  const setLearningIntention = useSelfEvaluationDraftStore((state) => state.setLearningIntention)

  return (
    <TextField
      label="What were you trying to get better at?"
      fullWidth
      multiline
      minRows={3}
      maxRows={6}
      value={learningIntention}
      onChange={(e) => setLearningIntention(e.target.value)}
      error={!!error}
      helperText={error || "What did you intend to learn? (max 800 characters)"}
    />
  )
}

export default IntentionSection
