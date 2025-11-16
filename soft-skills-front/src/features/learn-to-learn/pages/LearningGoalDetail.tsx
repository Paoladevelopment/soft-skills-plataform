import { Box, Typography, Breadcrumbs, Link, CircularProgress, Stack, Chip, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useLearningGoalStore } from '../store/useLearningGoalStore'
import { useLearningGoal, useUpdateLearningGoal } from '../hooks/useLearningGoals'
import ObjectivesList from '../components/objectives/ObjectivesList'
import InlineEditableField from '../components/ui/InlineEditableField'
import NoResults from '../components/ui/NoResults'
import DateDisplay from '../components/ui/DateDisplay'
import { Notes, AccessTime } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getLearningGoalStatusInfo, getStatusChipColor } from '../utils/learningGoalUtils'
import { useDebounce } from '../hooks/useDebounce'

const LearningGoalDetail = () => {
  const { t } = useTranslation('goals')
  const navigate = useNavigate()
  const { goalId } = useParams()
  const setSelectedGoalId = useLearningGoalStore(s => s.setSelectedGoalId)
  const setSelectedGoalTitle = useLearningGoalStore(s => s.setSelectedGoalTitle)
  
  const { data: goal, isLoading, error } = useLearningGoal(goalId || null)
  const { mutate: updateGoal, isPending: isSaving } = useUpdateLearningGoal()

  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    impact: ''
  })
  
  const [hasUserInteracted, setHasUserInteracted] = useState({
    title: false,
    description: false,
    impact: false
  })

  const debouncedTitle = useDebounce<string>(goalData.title)
  const debouncedDescription = useDebounce(goalData.description)
  const debouncedImpact = useDebounce(goalData.impact)

  useEffect(() => {
    if (goalId) {
      setSelectedGoalId(goalId)
    }
  }, [goalId, setSelectedGoalId])

  useEffect(() => {
    if (goal?.title) {
      setSelectedGoalTitle(goal.title)
    }
  }, [goal?.title, setSelectedGoalTitle])

  useEffect(() => {
    if (goal && !goalData.title && !goalData.description && !goalData.impact) {
      setGoalData({
        title: goal.title,
        description: goal.description,
        impact: goal.impact
      })
    }
  }, [goal, goalData.title, goalData.description, goalData.impact])

  useEffect(() => {
    if (hasUserInteracted.title && goalId && debouncedTitle !== goal?.title) {
      updateGoal({ id: goalId!, payload: { title: debouncedTitle } })
    }
  }, [debouncedTitle, hasUserInteracted.title, goalId, goal?.title, updateGoal])

  useEffect(() => {
    if (hasUserInteracted.description && goalId && debouncedDescription !== goal?.description) {
      updateGoal({ id: goalId!, payload: { description: debouncedDescription } })
    }
  }, [debouncedDescription, hasUserInteracted.description, goalId, goal?.description, updateGoal])

  useEffect(() => {
    if (hasUserInteracted.impact && goalId && debouncedImpact !== goal?.impact) {
      updateGoal({ id: goalId!, payload: { impact: debouncedImpact } })
    }
  }, [debouncedImpact, hasUserInteracted.impact, goalId, goal?.impact, updateGoal])

  const saveField = (field: 'title' | 'description' | 'impact', value: string) => {
    setGoalData(prev => ({
      ...prev,
      [field]: value
    }))
    
    setHasUserInteracted(prev => ({
      ...prev,
      [field]: true
    }))
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          maxWidth: '900px',
          mx: 'auto',
          px: 2,
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error || !goal) {
    return (
      <NoResults
        title={t('goalDetail.notFound.title')}
        description={t('goalDetail.notFound.description')}
        buttonText={t('goalDetail.notFound.button')}
        onButtonClick={() => navigate('/learn/planner')}
      />
    )
  }

  const statusInfo = getLearningGoalStatusInfo(goal.completedAt, goal.startedAt)
  
  const getStatusKey = (status: string): string => {
    const statusMap: Record<string, string> = {
      'Not started': 'notStarted',
      'In progress': 'inProgress',
      'Completed': 'completed'
    }
    
    return statusMap[status] || status.toLowerCase().replace(' ', '')
  }

  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/learn/planner')} 
          sx={{ 
            cursor: 'pointer', 
            flex: 1,
            textAlign: 'left'
          }}
        >
          {t('breadcrumbs.learningGoals')}
        </Link>
        <Typography color="text.primary">{goalData.title}</Typography>
      </Breadcrumbs>

      <Box>
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ 
            mb: 2, 
            width: '100%' 
          }} 
        >
          <Box sx={{ flex: 1 }}>
            <InlineEditableField
              label={t('goalDetail.title')}
              defaultValue={goalData.title}
              onSave={(val) => saveField('title', val)}
              disableDefaultDecoration
            />
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {isSaving && (
              <Chip
                label={t('goalDetail.saving')}
                size="small"
                color="info"
                variant="outlined"
              />
            )}

            <Chip
              label={t(`goalDetail.status.${getStatusKey(statusInfo.status)}`, { defaultValue: statusInfo.status })}
              color={getStatusChipColor(statusInfo.status)}
              size="small"
            />
            
            {statusInfo.elapsedTime && (
              <Chip
                icon={<AccessTime />}
                label={`${t('goalDetail.elapsed')} ${statusInfo.elapsedTime}`}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Stack>
        
        <InlineEditableField
          label={t('goalDetail.description')}
          defaultValue={goalData.description}
          onSave={(val) => saveField('description', val)}
          multiline
          icon={<Notes />}
        />

        <InlineEditableField
          label={t('goalDetail.impact')}
          defaultValue={goalData.impact}
          onSave={(val) => saveField('impact', val)}
          multiline
          icon={<Notes />}
        />

        <Divider sx={{ my: 3 }} />

        <DateDisplay
          title={t('goalDetail.dates.title')}
          readOnlyLabel={t('goalDetail.dates.readOnly')}
          dates={[
            {
              label: t('goalDetail.dates.createdAt'),
              value: goal.createdAt
            },
            {
              label: t('goalDetail.dates.updatedAt'),
              value: goal.updatedAt
            },
            {
              label: t('goalDetail.dates.startedAt'),
              value: goal.startedAt
            },
            {
              label: t('goalDetail.dates.completedAt'),
              value: goal.completedAt
            }
          ]}
        />

        <Divider sx={{ my: 3 }} />

        {goalId && <ObjectivesList learningGoalId={goalId} />}
      </Box>
    </Box>
  )
}

export default LearningGoalDetail