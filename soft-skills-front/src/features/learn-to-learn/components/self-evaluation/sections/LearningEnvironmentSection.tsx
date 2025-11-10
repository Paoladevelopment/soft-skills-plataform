import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useSelfEvaluationDraftStore } from '../../../store/useSelfEvaluationDraftStore'
import { StudyPlace, TimeOfDay, NoiseLevel, CollaborationMode } from '../../../types/self-evaluation/self-evaluation.enums'

type SelectChangeEvent = {
  target: {
    value: unknown
  }
}

const LearningEnvironmentSection = () => {
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
        <InputLabel id="study-place-label">Study Place</InputLabel>
        <Select
          labelId="study-place-label"
          id="study-place"
          value={formData.study_place || ''}
          label="Study place"
          onChange={handleStudyPlaceChange}
        >
          <MenuItem value={StudyPlace.HOME_DESK}>Home Desk</MenuItem>
          <MenuItem value={StudyPlace.HOME_COMMON_AREA}>Home Common Area</MenuItem>
          <MenuItem value={StudyPlace.OFFICE_DESK}>Office Desk</MenuItem>
          <MenuItem value={StudyPlace.COWORKING}>Coworking</MenuItem>
          <MenuItem value={StudyPlace.LIBRARY}>Library</MenuItem>
          <MenuItem value={StudyPlace.CLASSROOM}>Classroom</MenuItem>
          <MenuItem value={StudyPlace.UNIVERSITY_CAMPUS}>University Campus</MenuItem>
          <MenuItem value={StudyPlace.CAFE}>Cafe</MenuItem>
          <MenuItem value={StudyPlace.BOOKSTORE}>Bookstore</MenuItem>
          <MenuItem value={StudyPlace.DORM_ROOM}>Dorm Room</MenuItem>
          <MenuItem value={StudyPlace.DORM_COMMON_AREA}>Dorm Common Area</MenuItem>
          <MenuItem value={StudyPlace.OUTDOORS}>Outdoors</MenuItem>
          <MenuItem value={StudyPlace.TRANSIT}>Transit</MenuItem>
          <MenuItem value={StudyPlace.OTHER}>Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="time-of-day-label">Time of Day</InputLabel>
        <Select
          labelId="time-of-day-label"
          id="time-of-day"
          value={formData.time_of_day ?? TimeOfDay.MORNING}
          label="Time of day"
          onChange={handleTimeOfDayChange}
        >
          <MenuItem value={TimeOfDay.MORNING}>Morning</MenuItem>
          <MenuItem value={TimeOfDay.AFTERNOON}>Afternoon</MenuItem>
          <MenuItem value={TimeOfDay.EVENING}>Evening</MenuItem>
          <MenuItem value={TimeOfDay.NIGHT}>Night</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="noise-level-label">Noise Level</InputLabel>
        <Select
          labelId="noise-level-label"
          id="noise-level"
          value={formData.noise_level ?? NoiseLevel.QUIET}
          label="Noise level"
          onChange={handleNoiseLevelChange}
        >
          <MenuItem value={NoiseLevel.QUIET}>Quiet</MenuItem>
          <MenuItem value={NoiseLevel.MODERATE}>Moderate</MenuItem>
          <MenuItem value={NoiseLevel.NOISY}>Noisy</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="collaboration-mode-label">Collaboration Mode</InputLabel>
        <Select
          labelId="collaboration-mode-label"
          id="collaboration-mode"
          value={formData.collaboration_mode ?? CollaborationMode.SOLO}
          label="Collaboration mode"
          onChange={handleCollaborationModeChange}
        >
          <MenuItem value={CollaborationMode.SOLO}>Solo</MenuItem>
          <MenuItem value={CollaborationMode.PAIR}>Pair</MenuItem>
          <MenuItem value={CollaborationMode.GROUP}>Group</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default LearningEnvironmentSection
