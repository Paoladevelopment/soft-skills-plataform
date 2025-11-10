import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  Typography,
  Divider,
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useSelfEvaluationStore } from '../../store/useSelfEvaluationStore'
import { useSelfEvaluationDraftStore } from '../../store/useSelfEvaluationDraftStore'
import { selfEvaluationSchema, type ValidationErrors } from './schema'
import LearningEnvironmentSection from './sections/LearningEnvironmentSection'
import IntentionSection from './sections/IntentionSection'
import ReflectionSection from './sections/ReflectionSection'
import SessionAssessmentSection from './sections/SessionAssessmentSection'
import type { SelfEvaluationCreated } from '../../types/self-evaluation/self-evaluation.api'

const BACKDROP_CLICK_REASON = 'backdropClick'

interface SelfEvaluationModalProps {
  onAfterCreate?: (created: SelfEvaluationCreated) => void
  onCancel?: () => void
}

const SelfEvaluationModal = ({ onAfterCreate, onCancel }: SelfEvaluationModalProps) => {
  const { t } = useTranslation('reports')
  const { 
    isOpen, 
    close, 
    submitting, 
    submit 
  } = useSelfEvaluationStore()

  const draftStore = useSelfEvaluationDraftStore()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const handleSubmit = async () => {
    const snapshot = draftStore.getSnapshot()

    if (!snapshot.task_id) {
      return
    }

    if (!snapshot.study_place) {
      return
    }

    if (!snapshot.perceived_difficulty) {
      return
    }

    if (!snapshot.mood) {
      return
    }

    const payload = {
      task_id: snapshot.task_id,
      study_place: snapshot.study_place,
      time_of_day: snapshot.time_of_day ?? undefined,
      noise_level: snapshot.noise_level ?? undefined,
      collaboration_mode: snapshot.collaboration_mode ?? undefined,
      learning_intention: snapshot.learning_intention,
      what_went_well: snapshot.what_went_well,
      challenges_encountered: snapshot.challenges_encountered,
      improvement_plan: snapshot.improvement_plan,
      perceived_difficulty: snapshot.perceived_difficulty,
      concentration_level: snapshot.concentration_level,
      mood: snapshot.mood,
      knowledge_connection: snapshot.knowledge_connection,
      learning_methods: snapshot.learning_methods.length > 0 ? snapshot.learning_methods : undefined,
    }

    const validationResult = selfEvaluationSchema.safeParse(payload)
    
    if (!validationResult.success) {
      const errors: ValidationErrors = {}

      validationResult.error.errors.forEach((error) => {
        const path = error.path.join('.')
        errors[path] = error.message
      })

      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    const created = await submit(validationResult.data)
    onAfterCreate?.(created)
    close()
    draftStore.reset()
  }

  const handleClose = () => {
    if (!submitting) {
      setValidationErrors({})
      close()
      draftStore.reset()
      onCancel?.()
    }
  }

  const handleDialogClose = (_event: unknown, reason?: string) => {
    if (reason === BACKDROP_CLICK_REASON) {
      return
    }
    
    handleClose()
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleDialogClose}
      fullWidth 
      maxWidth="md"
    >
      <DialogTitle>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography fontWeight="bold">
            {t('selfEvaluation.title')}
          </Typography>
          <IconButton onClick={handleClose} disabled={submitting}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
              mb={3}
            >
              {t('selfEvaluation.sections.yourEnvironment')}
            </Typography>
            <Stack spacing={2}>
              <LearningEnvironmentSection />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
            >
              {t('selfEvaluation.sections.yourLearningIntention')}
            </Typography>
            <IntentionSection error={validationErrors['learning_intention']} />
          </Box>

          <Divider />

          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
            >
              {t('selfEvaluation.sections.yourExperienceDuringTask')}
            </Typography>
            <ReflectionSection 
              errors={{
                what_went_well: validationErrors['what_went_well'],
                challenges_encountered: validationErrors['challenges_encountered'],
                improvement_plan: validationErrors['improvement_plan'],
              }}
            />
          </Box>

          <Divider />

          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
            >
              {t('selfEvaluation.sections.howWasYourSession')}
            </Typography>
            <SessionAssessmentSection />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3, 
          pb: 3 
        }}
      >
        <Button 
          variant="outlined" 
          onClick={handleClose} 
          disabled={submitting}
        >
          {t('selfEvaluation.buttons.cancel')}
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? t('selfEvaluation.buttons.saving') : t('selfEvaluation.buttons.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelfEvaluationModal
