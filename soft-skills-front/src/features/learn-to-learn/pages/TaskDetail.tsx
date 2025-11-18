import { Box, Typography, Breadcrumbs, Link, CircularProgress, Stack, Chip, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useTask, useUpdateTask } from '../hooks/useTasks'
import NoResults from '../components/ui/NoResults'
import InlineEditableField from '../components/ui/InlineEditableField'
import InlineEditableSelect from '../components/ui/InlineEditableSelect'
import DateDisplay from '../components/ui/DateDisplay'
import PomodoroField from '../components/tasks/PomodoroField'
import ResourcesSection from '../components/tasks/ResourcesSection'
import NotesSection from '../components/tasks/NotesSection'
import { formatStatus, getStatusChipColor, getPriorityColor } from '../utils/objectiveUtils'
import { Notes, Flag, WorkOutline } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { Priority, TaskType, Status } from '../types/common.enums'
import { usePomodoroPreferencesStore } from '../store/usePomodoroPreferencesStore'

const TaskDetail = () => {
  const { t } = useTranslation(['goals', 'tasks'])
  
  const navigate = useNavigate()
  const { goalId, objectiveId, taskId } = useParams()
  const { isConfigured, effectivePomodoroLengthMinutes } = usePomodoroPreferencesStore()

  const { data: task, isLoading, error } = useTask(taskId || null)
  const { mutate: updateTask, isPending: isSaving } = useUpdateTask()

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: Priority.Medium,
    taskType: TaskType.Other,
    estimatedPomodoros: 1,
    actualPomodoros: 0
  })

  const [hasUserInteracted, setHasUserInteracted] = useState({
    title: false,
    description: false,
    estimatedPomodoros: false,
    actualPomodoros: false
  })

  const debouncedTitle = useDebounce<string>(taskData.title)
  const debouncedDescription = useDebounce(taskData.description)
  const debouncedEstimatedPomodoros = useDebounce<number>(taskData.estimatedPomodoros)
  const debouncedActualPomodoros = useDebounce<number>(taskData.actualPomodoros)

  const priorityOptions = [
    { value: Priority.Low, label: t('tasks:priority.low') },
    { value: Priority.Medium, label: t('tasks:priority.medium') },
    { value: Priority.High, label: t('tasks:priority.high') }
  ]

  const taskTypeOptions = [
    { value: TaskType.Reading, label: t('tasks:taskTypes.reading') },
    { value: TaskType.Practice, label: t('tasks:taskTypes.practice') },
    { value: TaskType.Writing, label: t('tasks:taskTypes.writing') },
    { value: TaskType.Research, label: t('tasks:taskTypes.research') },
    { value: TaskType.Listening, label: t('tasks:taskTypes.listening') },
    { value: TaskType.Discussion, label: t('tasks:taskTypes.discussion') },
    { value: TaskType.ProblemSolving, label: t('tasks:taskTypes.problem_solving') },
    { value: TaskType.Experimenting, label: t('tasks:taskTypes.experimenting') },
    { value: TaskType.Teaching, label: t('tasks:taskTypes.teaching') },
    { value: TaskType.Other, label: t('tasks:taskTypes.other') }
  ]

  useEffect(() => {
    if (task && !taskData.title && !taskData.description) {
      const pomodoroLengthSeconds = task.pomodoroLengthSecondsSnapshot || (isConfigured ? effectivePomodoroLengthMinutes * 60 : 60 * 60)
      const estimatedPomodoros = task.estimatedSeconds && pomodoroLengthSeconds 
        ? task.estimatedSeconds / pomodoroLengthSeconds 
        : 1
        
      const actualPomodoros = task.actualSeconds && pomodoroLengthSeconds 
        ? task.actualSeconds / pomodoroLengthSeconds 
        : 0

      setTaskData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        taskType: task.taskType,
        estimatedPomodoros,
        actualPomodoros
      })
    }
  }, [task, taskData.title, taskData.description, isConfigured, effectivePomodoroLengthMinutes])

  useEffect(() => {
    if (hasUserInteracted.title && taskId && debouncedTitle !== task?.title) {
      updateTask({
        id: taskId,
        payload: { title: debouncedTitle }
      })
    }
  }, [debouncedTitle, hasUserInteracted.title, taskId, task?.title, updateTask])

  useEffect(() => {
    if (hasUserInteracted.description && taskId && debouncedDescription !== task?.description) {
      updateTask({
        id: taskId,
        payload: { description: debouncedDescription }
      })
    }
  }, [debouncedDescription, hasUserInteracted.description, taskId, task?.description, updateTask])

  useEffect(() => {
    if (hasUserInteracted.estimatedPomodoros && taskId) {
      const pomodoroLengthSeconds = task?.pomodoroLengthSecondsSnapshot || (isConfigured ? effectivePomodoroLengthMinutes * 60 : 60 * 60)
      const estimatedSeconds = debouncedEstimatedPomodoros * pomodoroLengthSeconds
      const currentEstimatedSeconds = task?.estimatedSeconds || 0

      if (estimatedSeconds !== currentEstimatedSeconds) {
        updateTask({
          id: taskId,
          payload: { estimated_seconds: estimatedSeconds }
        })
      }
    }
  }, [debouncedEstimatedPomodoros, hasUserInteracted.estimatedPomodoros, taskId, task?.estimatedSeconds, task?.pomodoroLengthSecondsSnapshot, isConfigured, effectivePomodoroLengthMinutes, updateTask])

  useEffect(() => {
    if (hasUserInteracted.actualPomodoros && taskId) {
      const pomodoroLengthSeconds = task?.pomodoroLengthSecondsSnapshot || (isConfigured ? effectivePomodoroLengthMinutes * 60 : 60 * 60)
      const actualSeconds = debouncedActualPomodoros * pomodoroLengthSeconds
      const currentActualSeconds = task?.actualSeconds || 0

      if (actualSeconds !== currentActualSeconds) {
        updateTask({
          id: taskId,
          payload: { actual_seconds: actualSeconds }
        })
      }
    }
  }, [debouncedActualPomodoros, hasUserInteracted.actualPomodoros, taskId, task?.actualSeconds, task?.pomodoroLengthSecondsSnapshot, isConfigured, effectivePomodoroLengthMinutes, updateTask])

  const saveField = (field: 'title' | 'description', value: string) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }))
    
    setHasUserInteracted(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const savePriority = (value: string) => {
    const priority = value as Priority
    setTaskData(prev => ({
      ...prev,
      priority
    }))

    if (taskId && priority !== task?.priority) {
      updateTask({
        id: taskId,
        payload: { priority }
      })
    }
  }

  const saveTaskType = (value: string) => {
    const taskType = value as TaskType
    setTaskData(prev => ({
      ...prev,
      taskType
    }))

    if (taskId && taskType !== task?.taskType) {
      updateTask({
        id: taskId,
        payload: { task_type: taskType }
      })
    }
  }

  const saveEstimatedPomodoros = (value: number) => {
    setTaskData(prev => ({
      ...prev,
      estimatedPomodoros: value
    }))
    
    setHasUserInteracted(prev => ({
      ...prev,
      estimatedPomodoros: true
    }))
  }

  const saveActualPomodoros = (value: number) => {
    setTaskData(prev => ({
      ...prev,
      actualPomodoros: value
    }))
    
    setHasUserInteracted(prev => ({
      ...prev,
      actualPomodoros: true
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

  if (error || !task || !goalId || !objectiveId) {
    return (
      <NoResults
        title={t('tasks:detail.notFound.title')}
        description={t('tasks:detail.notFound.description')}
        buttonText={t('tasks:detail.notFound.button')}
        onButtonClick={() => navigate(`/learn/planner/goals/${goalId || ''}/objectives/${objectiveId || ''}`)}
      />
    )
  }

  const statusLabel = formatStatus(task.status)

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
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/learn/planner/goals/${goalId}`)}
          sx={{
            cursor: 'pointer',
            flex: 1,
            textAlign: 'left'
          }}
        >
          {t('objectives.title')}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/learn/planner/goals/${goalId}/objectives/${objectiveId}`)}
          sx={{
            cursor: 'pointer',
            flex: 1,
            textAlign: 'left'
          }}
        >
          {t('objectives.detail.taskBreakdown.title')}
        </Link>
        <Typography 
          color="text.primary"
        >
          {taskData.title}
        </Typography>
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
              label={t('tasks:detail.title')}
              defaultValue={taskData.title}
              onSave={(val) => saveField('title', val)}
              disableDefaultDecoration
            />
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {isSaving && (
              <Chip
                label={t('tasks:detail.saving')}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            <Chip
              label={statusLabel}
              color={getStatusChipColor(task.status)}
              size="small"
            />
          </Stack>
        </Stack>

        <InlineEditableField
          label={t('tasks:detail.description')}
          defaultValue={taskData.description}
          onSave={(val) => saveField('description', val)}
          multiline
          icon={<Notes />}
        />

        <InlineEditableSelect
          label={t('tasks:detail.priority')}
          value={taskData.priority}
          options={priorityOptions}
          onSave={savePriority}
          icon={<Flag />}
          getColor={getPriorityColor}
        />

        <InlineEditableSelect
          label={t('objectives.addTaskModal.taskTypeLabel')}
          value={taskData.taskType}
          options={taskTypeOptions}
          onSave={saveTaskType}
          icon={<WorkOutline />}
        />

        <PomodoroField
          label={t('objectives.addTaskModal.estimatedPomodorosLabel')}
          value={taskData.estimatedPomodoros}
          onChange={saveEstimatedPomodoros}
          min={0.5}
          step={0.5}
        />

        {task.status === Status.Completed && (
          <PomodoroField
            label={t('tasks:detail.actualPomodoros')}
            value={taskData.actualPomodoros}
            onChange={saveActualPomodoros}
            min={0}
            step={0.5}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <DateDisplay
          title={t('tasks:detail.dates.title')}
          readOnlyLabel={t('goalDetail.dates.readOnly')}
          dates={[
            {
              label: t('tasks:detail.dates.createdAt'),
              value: task.createdAt
            },
            {
              label: t('tasks:detail.dates.updatedAt'),
              value: task.updatedAt
            },
            {
              label: t('tasks:detail.dates.startedAt'),
              value: task.startedAt
            },
            {
              label: t('tasks:detail.dates.completedAt'),
              value: task.completedAt
            }
          ]}
        />

        <Divider sx={{ my: 3 }} />

        {taskId && (
          <>
            <ResourcesSection taskId={taskId} />
            <NotesSection taskId={taskId} />
          </>
        )}

      </Box>
    </Box>
  )
}

export default TaskDetail

