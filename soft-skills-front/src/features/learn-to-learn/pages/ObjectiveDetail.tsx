import { Box, Typography, Breadcrumbs, Link, CircularProgress, Stack, Chip, Divider, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLearningGoalStore } from '../store/useLearningGoalStore'
import { useObjective, useUpdateObjective } from '../hooks/useObjectives'
import NoResults from '../components/ui/NoResults'
import InlineEditableField from '../components/ui/InlineEditableField'
import InlineEditableSelect from '../components/ui/InlineEditableSelect'
import InlineEditableDate from '../components/ui/InlineEditableDate'
import DateDisplay from '../components/ui/DateDisplay'
import Board from '../components/kanban/Board'
import AddTaskModal from '../components/objectives/AddTaskModal'
import { Notes, AccessTime, Flag, CalendarToday, Add as AddIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getObjectiveStatusInfo, getObjectiveStatusChipColor, getPriorityColor } from '../utils/objectiveUtils'
import { useDebounce } from '../hooks/useDebounce'
import { Priority } from '../types/common.enums'
import { formatDateToDateTime, normalizeDate } from '../utils/dateUtils'
import { useKanbanTasks } from '../hooks/useKanbanTasks'
import { useCreateTask } from '../hooks/useTasks'
import { CreateTaskPayload } from '../types/planner/task.api'
import { usePomodoroPreferencesStore } from '../store/usePomodoroPreferencesStore'
import { AddTaskFields } from '../components/objectives/AddTaskModal'

const ObjectiveDetail = () => {
  const navigate = useNavigate()
  const { goalId, objectiveId } = useParams()
  const selectedGoalTitle = useLearningGoalStore(s => s.selectedGoalTitle)
  
  const { data: objective, isLoading, error } = useObjective(objectiveId || null)
  const { mutate: updateObjective, isPending: isSaving } = useUpdateObjective()
  const { mutateAsync: createTask } = useCreateTask()
  const { isConfigured, effectivePomodoroLengthMinutes } = usePomodoroPreferencesStore()

  const [objectiveData, setObjectiveData] = useState({
    title: '',
    description: '',
    priority: Priority.Medium,
    dueDate: null as string | null
  })

  const { data: kanbanBoard, isLoading: isKanbanLoading, error: kanbanError } = useKanbanTasks(objectiveId || null, objectiveData.title)
  
  const [hasUserInteracted, setHasUserInteracted] = useState({
    title: false,
    description: false
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const debouncedTitle = useDebounce<string>(objectiveData.title)
  const debouncedDescription = useDebounce(objectiveData.description)

  const priorityOptions = [
    { value: Priority.Low, label: 'low' },
    { value: Priority.Medium, label: 'medium' },
    { value: Priority.High, label: 'high' }
  ]

  const saveField = (field: 'title' | 'description', value: string) => {
    setObjectiveData(prev => ({
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
    setObjectiveData(prev => ({
      ...prev,
      priority
    }))

    if (objectiveId && priority !== objective?.priority) {
      updateObjective({
        id: objectiveId,
        payload: { priority }
      })
    }
  }

  const saveDueDate = (value: string | null) => {
    const formattedDate = normalizeDate(value)
    
    setObjectiveData(prev => ({
      ...prev,
      dueDate: formattedDate
    }))

    if (objectiveId) {
      const normalizedObjectiveDate = normalizeDate(objective?.dueDate || null)
      
      if (formattedDate !== normalizedObjectiveDate) {
        const apiFormattedDate = formattedDate ? formatDateToDateTime(formattedDate) : undefined
        
        updateObjective({
          id: objectiveId,
          payload: { due_date: apiFormattedDate }
        })
      }
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCreateTask = async (taskData: AddTaskFields) => {
    const pomodoroLengthSeconds = isConfigured ? effectivePomodoroLengthMinutes * 60 : 60 * 60
    
    const taskPayload: CreateTaskPayload = {
      title: taskData.title,
      description: taskData.description,
      task_type: taskData.task_type,
      priority: taskData.priority,
      estimated_seconds: taskData.estimated_pomodoros * pomodoroLengthSeconds,
      pomodoro_length_seconds_snapshot: pomodoroLengthSeconds,
      objective_id: objectiveId || '',
      is_optional: taskData.is_optional || false
    }
    
    if (taskData.due_date && taskData.due_date.trim() !== '') {
      taskPayload.due_date = formatDateToDateTime(taskData.due_date)
    }
    
    await createTask(taskPayload)
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (objective && !objectiveData.title && !objectiveData.description) {
      setObjectiveData({
        title: objective.title,
        description: objective.description,
        priority: objective.priority,
        dueDate: normalizeDate(objective.dueDate)
      })
    }
  }, [objective, objectiveData.title, objectiveData.description])

  useEffect(() => {
    if (hasUserInteracted.title && objectiveId && debouncedTitle !== objective?.title) {
      updateObjective({
        id: objectiveId,
        payload: { title: debouncedTitle }
      })
    }
  }, [debouncedTitle, hasUserInteracted.title, objectiveId, objective?.title, updateObjective])

  useEffect(() => {
    if (hasUserInteracted.description && objectiveId && debouncedDescription !== objective?.description) {
      updateObjective({
        id: objectiveId,
        payload: { description: debouncedDescription }
      })
    }
  }, [debouncedDescription, hasUserInteracted.description, objectiveId, objective?.description, updateObjective])

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

  if (error || !objective) {
    return (
      <NoResults
        title="Objective not found"
        description="The objective you're looking for doesn't exist or may have been removed."
        buttonText="Back to Learning Goal"
        onButtonClick={() => navigate(`/learn/planner/goals/${goalId}`)}
      />
    )
  }

  const statusInfo = getObjectiveStatusInfo(objective.status, objective.startedAt, objective.completedAt)

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
          Learning Goals
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
          {selectedGoalTitle || 'Learning Goal'}
        </Link>
        <Typography color="text.primary">{objectiveData.title}</Typography>
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
              label="Title"
              defaultValue={objectiveData.title}
              onSave={(val) => saveField('title', val)}
              disableDefaultDecoration
            />
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {isSaving && (
              <Chip
                label="Saving..."
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            
            <Chip
              label={statusInfo.status}
              color={getObjectiveStatusChipColor(objective.status)}
              size="small"
            />
            
            {statusInfo.elapsedTime && (
              <Chip
                icon={<AccessTime />}
                label={`Elapsed: ${statusInfo.elapsedTime}`}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Stack>
        
        <InlineEditableField
          label="Description"
          defaultValue={objectiveData.description}
          onSave={(val) => saveField('description', val)}
          multiline
          icon={<Notes />}
        />

        <InlineEditableSelect
          label="Priority"
          value={objectiveData.priority}
          options={priorityOptions}
          onSave={savePriority}
          icon={<Flag />}
          getColor={getPriorityColor}
        />

        <InlineEditableDate
          label="Due Date"
          value={objectiveData.dueDate}
          onSave={saveDueDate}
          icon={<CalendarToday />}
        />

        <Divider sx={{ my: 3 }} />

        <DateDisplay
          title="Dates"
          dates={[
            {
              label: 'Created at',
              value: objective.createdAt
            },
            {
              label: 'Updated at',
              value: objective.updatedAt
            },
            {
              label: 'Started at',
              value: objective.startedAt
            },
            {
              label: 'Completed at',
              value: objective.completedAt
            },
            {
              label: 'Due date',
              value: objective.dueDate
            }
          ]}
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ 
              mb: 2 
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1
                }}
              >
                Task Breakdown
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Break down this objective into manageable sub-tasks and track their progress
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 500,
              }}
            >
              Add Task
            </Button>
          </Stack>
          
          {isKanbanLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : kanbanError ? (
            <Typography color="error" variant="body2">
              Failed to load tasks. Please try again.
            </Typography>
          ) : kanbanBoard ? (
            <Board board={kanbanBoard} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tasks found for this objective.
            </Typography>
          )}
        </Box>
      </Box>

      <AddTaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateTask}
      />
    </Box>
  )
}

export default ObjectiveDetail