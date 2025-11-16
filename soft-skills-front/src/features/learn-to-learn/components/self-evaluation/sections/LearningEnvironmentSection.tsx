import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { StudyPlace, TimeOfDay, NoiseLevel, CollaborationMode } from '../../../types/self-evaluation/self-evaluation.enums'
import { formatStudyPlace, formatTimeOfDay, formatNoiseLevel, formatCollaborationMode } from '../../../utils/selfEvaluationFormatters'

type SelectChangeEvent = {
  target: {
    value: unknown
  }
}

const LearningEnvironmentSection = () => {
  const { t } = useTranslation('reports')
  const formData = useSelfEvaluationDraftStore((state) => state)
  const setStudyPlace = useSelfEvaluationDraftStore((state) => state.setStudyPlace)
  const setTimeOfDay = useSelfEvaluationDraftStore((state) => state.setTimeOfDay)
  const setNoiseLevel = useSelfEvaluationDraftStore((state) => state.setNoiseLevel)
  const setCollaborationMode = useSelfEvaluationDraftStore((state) => state.setCollaborationMode)

  const handleStudyPlaceChange = (e: SelectChangeEvent) => {
    const value = e.target.value as StudyPlace
    setStudyPlace(value)
  }

  const handleTimeOfDayChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string
    setTimeOfDay(value ? (value as TimeOfDay) : null)
  }

  const handleNoiseLevelChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string
    setNoiseLevel(value ? (value as NoiseLevel) : null)
  }

  const handleCollaborationModeChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string
    setCollaborationMode(value ? (value as CollaborationMode) : null)
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="study-place-label">{t('selfEvaluation.fields.studyPlace')}</InputLabel>
        <Select
          labelId="study-place-label"
          id="study-place"
          value={formData.study_place || ''}
          label={t('selfEvaluation.fields.studyPlace')}
          onChange={handleStudyPlaceChange}
        >
          <MenuItem value={StudyPlace.HOME_DESK}>{formatStudyPlace(StudyPlace.HOME_DESK)}</MenuItem>
          <MenuItem value={StudyPlace.HOME_COMMON_AREA}>{formatStudyPlace(StudyPlace.HOME_COMMON_AREA)}</MenuItem>
          <MenuItem value={StudyPlace.OFFICE_DESK}>{formatStudyPlace(StudyPlace.OFFICE_DESK)}</MenuItem>
          <MenuItem value={StudyPlace.COWORKING}>{formatStudyPlace(StudyPlace.COWORKING)}</MenuItem>
          <MenuItem value={StudyPlace.LIBRARY}>{formatStudyPlace(StudyPlace.LIBRARY)}</MenuItem>
          <MenuItem value={StudyPlace.CLASSROOM}>{formatStudyPlace(StudyPlace.CLASSROOM)}</MenuItem>
          <MenuItem value={StudyPlace.UNIVERSITY_CAMPUS}>{formatStudyPlace(StudyPlace.UNIVERSITY_CAMPUS)}</MenuItem>
          <MenuItem value={StudyPlace.CAFE}>{formatStudyPlace(StudyPlace.CAFE)}</MenuItem>
          <MenuItem value={StudyPlace.BOOKSTORE}>{formatStudyPlace(StudyPlace.BOOKSTORE)}</MenuItem>
          <MenuItem value={StudyPlace.DORM_ROOM}>{formatStudyPlace(StudyPlace.DORM_ROOM)}</MenuItem>
          <MenuItem value={StudyPlace.DORM_COMMON_AREA}>{formatStudyPlace(StudyPlace.DORM_COMMON_AREA)}</MenuItem>
          <MenuItem value={StudyPlace.OUTDOORS}>{formatStudyPlace(StudyPlace.OUTDOORS)}</MenuItem>
          <MenuItem value={StudyPlace.TRANSIT}>{formatStudyPlace(StudyPlace.TRANSIT)}</MenuItem>
          <MenuItem value={StudyPlace.OTHER}>{formatStudyPlace(StudyPlace.OTHER)}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="time-of-day-label">{t('selfEvaluation.fields.timeOfDay')}</InputLabel>
        <Select
          labelId="time-of-day-label"
          id="time-of-day"
          value={formData.time_of_day ?? TimeOfDay.MORNING}
          label={t('selfEvaluation.fields.timeOfDay')}
          onChange={handleTimeOfDayChange}
        >
          <MenuItem value={TimeOfDay.MORNING}>{formatTimeOfDay(TimeOfDay.MORNING)}</MenuItem>
          <MenuItem value={TimeOfDay.AFTERNOON}>{formatTimeOfDay(TimeOfDay.AFTERNOON)}</MenuItem>
          <MenuItem value={TimeOfDay.EVENING}>{formatTimeOfDay(TimeOfDay.EVENING)}</MenuItem>
          <MenuItem value={TimeOfDay.NIGHT}>{formatTimeOfDay(TimeOfDay.NIGHT)}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="noise-level-label">{t('selfEvaluation.fields.noiseLevel')}</InputLabel>
        <Select
          labelId="noise-level-label"
          id="noise-level"
          value={formData.noise_level ?? NoiseLevel.QUIET}
          label={t('selfEvaluation.fields.noiseLevel')}
          onChange={handleNoiseLevelChange}
        >
          <MenuItem value={NoiseLevel.QUIET}>{formatNoiseLevel(NoiseLevel.QUIET)}</MenuItem>
          <MenuItem value={NoiseLevel.MODERATE}>{formatNoiseLevel(NoiseLevel.MODERATE)}</MenuItem>
          <MenuItem value={NoiseLevel.NOISY}>{formatNoiseLevel(NoiseLevel.NOISY)}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="collaboration-mode-label">{t('selfEvaluation.fields.collaborationMode')}</InputLabel>
        <Select
          labelId="collaboration-mode-label"
          id="collaboration-mode"
          value={formData.collaboration_mode ?? CollaborationMode.SOLO}
          label={t('selfEvaluation.fields.collaborationMode')}
          onChange={handleCollaborationModeChange}
        >
          <MenuItem value={CollaborationMode.SOLO}>{formatCollaborationMode(CollaborationMode.SOLO)}</MenuItem>
          <MenuItem value={CollaborationMode.PAIR}>{formatCollaborationMode(CollaborationMode.PAIR)}</MenuItem>
          <MenuItem value={CollaborationMode.GROUP}>{formatCollaborationMode(CollaborationMode.GROUP)}</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default LearningEnvironmentSection
