import { ObjectiveBoard } from '../types/kanban/board.types'

export const createObjectiveBoardData = (objectiveId: string, objectiveTitle: string): ObjectiveBoard => ({
  objectiveId,
  objectiveTitle,
  columns: [
    {
      id: 'todo',
      title: 'TO DO',
      tasks: [
        {
          id: 'subtask-1',
          title: 'Research learning methodologies',
          description: 'Study different approaches to effective learning',
          priority: 'HIGH',
          status: 'TODO',
          dueDate: '2024-02-15'
        },
        {
          id: 'subtask-2',
          title: 'Create study schedule',
          description: 'Plan daily and weekly study sessions',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: '2024-02-10'
        },
        {
          id: 'subtask-3',
          title: 'Gather learning resources',
          description: 'Collect books, articles, and online materials',
          priority: 'LOW',
          status: 'TODO',
          dueDate: '2024-02-20'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'IN PROGRESS',
      tasks: [
        {
          id: 'subtask-4',
          title: 'Practice active reading techniques',
          description: 'Apply note-taking and summarization methods',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          dueDate: '2024-02-12'
        },
        {
          id: 'subtask-5',
          title: 'Set up learning environment',
          description: 'Organize workspace and eliminate distractions',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          dueDate: '2024-02-08'
        }
      ]
    },
    {
      id: 'done',
      title: 'DONE',
      tasks: [
        {
          id: 'subtask-6',
          title: 'Define learning objectives',
          description: 'Establish clear, measurable learning goals',
          priority: 'HIGH',
          status: 'DONE',
          dueDate: '2024-02-05'
        },
        {
          id: 'subtask-7',
          title: 'Install productivity apps',
          description: 'Set up tools for time tracking and note-taking',
          priority: 'LOW',
          status: 'DONE',
          dueDate: '2024-02-03'
        }
      ]
    },
    {
      id: 'paused',
      title: 'PAUSED',
      tasks: [
        {
          id: 'subtask-8',
          title: 'Review learning materials',
          description: 'Go through collected resources and organize them',
          priority: 'MEDIUM',
          status: 'PAUSED',
          dueDate: '2024-02-18'
        },
        {
          id: 'subtask-9',
          title: 'Create flashcards',
          description: 'Design digital flashcards for key concepts',
          priority: 'LOW',
          status: 'PAUSED',
          dueDate: '2024-02-25'
        }
      ]
    }
  ]
})
