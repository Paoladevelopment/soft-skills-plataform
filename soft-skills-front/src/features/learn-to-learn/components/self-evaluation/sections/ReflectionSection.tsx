import { TextField, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'

interface ReflectionSectionProps {
  errors?: {
    what_went_well?: string
    challenges_encountered?: string
    improvement_plan?: string
  }
}

const ReflectionSection = ({ errors }: ReflectionSectionProps) => {
  const { t } = useTranslation('reports')
  const formData = useSelfEvaluationDraftStore((state) => state)
  const setWhatWentWell = useSelfEvaluationDraftStore((state) => state.setWhatWentWell)
  const setChallengesEncountered = useSelfEvaluationDraftStore((state) => state.setChallengesEncountered)
  const setImprovementPlan = useSelfEvaluationDraftStore((state) => state.setImprovementPlan)

  return (
    <Stack spacing={2}>
      <TextField
        label={t('selfEvaluation.fields.whatWorkedWellThisTime')}
        placeholder={t('selfEvaluation.fields.whatWorkedWellThisTimePlaceholder')}
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.what_went_well}
        onChange={(e) => setWhatWentWell(e.target.value)}
        error={!!errors?.what_went_well}
        helperText={errors?.what_went_well || t('selfEvaluation.fields.whatWorkedWellHelper')}
      />

      <TextField
        label={t('selfEvaluation.fields.whatWasDifficult')}
        placeholder={t('selfEvaluation.fields.whatWasDifficultPlaceholder')}
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.challenges_encountered}
        onChange={(e) => setChallengesEncountered(e.target.value)}
        error={!!errors?.challenges_encountered}
        helperText={errors?.challenges_encountered || t('selfEvaluation.fields.challengesEncounteredHelper')}
      />

      <TextField
        label={t('selfEvaluation.fields.whatWouldYouDoDifferently')}
        placeholder={t('selfEvaluation.fields.whatWouldYouDoDifferentlyPlaceholder')}
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={formData.improvement_plan}
        onChange={(e) => setImprovementPlan(e.target.value)}
        error={!!errors?.improvement_plan}
        helperText={errors?.improvement_plan || t('selfEvaluation.fields.improvementPlanHelper')}
      />
    </Stack>
  )
}

export default ReflectionSection
