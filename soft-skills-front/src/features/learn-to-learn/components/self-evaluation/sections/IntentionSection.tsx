import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'

interface IntentionSectionProps {
  error?: string
}

const IntentionSection = ({ error }: IntentionSectionProps) => {
  const { t } = useTranslation('reports')
  const learningIntention = useSelfEvaluationDraftStore((state) => state.learning_intention)
  const setLearningIntention = useSelfEvaluationDraftStore((state) => state.setLearningIntention)

  return (
    <TextField
      label={t('selfEvaluation.fields.whatWereYouTryingToGetBetterAt')}
      fullWidth
      multiline
      minRows={3}
      maxRows={6}
      value={learningIntention}
      onChange={(e) => setLearningIntention(e.target.value)}
      error={!!error}
      helperText={error || t('selfEvaluation.fields.whatWereYouTryingToGetBetterAtHelper')}
    />
  )
}

export default IntentionSection
