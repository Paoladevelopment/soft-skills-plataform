import { useState } from 'react'
import DataFilter from './DataFilter'
import { FilterOption } from '../../types/ui/filter.types'

export const LearningGoalsFilterExample = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    category: []
  })

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'checkbox',
      values: [
        { value: 'not_started', label: 'Not Started' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      values: [
        { value: 'technical', label: 'Technical Skills' },
        { value: 'soft_skills', label: 'Soft Skills' },
        { value: 'leadership', label: 'Leadership' }
      ]
    }
  ]

  return (
    <DataFilter
      searchPlaceholder="Search learning goals..."
      filterButtonText="Filter Goals"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={(key, values) => {
        setSelectedFilters(prev => ({ ...prev, [key]: values }))
      }}
    />
  )
}

export const TasksFilterExample = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    priority: [],
    assignee: [],
    dueDate: []
  })

  const filterOptions: FilterOption[] = [
    {
      key: 'priority',
      label: 'Priority',
      type: 'checkbox',
      values: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'select',
      values: [
        { value: 'john', label: 'John Doe' },
        { value: 'jane', label: 'Jane Smith' },
        { value: 'bob', label: 'Bob Johnson' }
      ]
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'select',
      values: [
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'this_week', label: 'This Week' },
        { value: 'overdue', label: 'Overdue' }
      ]
    }
  ]

  return (
    <DataFilter
      searchPlaceholder="Search tasks..."
      filterButtonText="Filter Tasks"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={(key, values) => {
        setSelectedFilters(prev => ({ ...prev, [key]: values }))
      }}
    />
  )
}

export const ResourcesFilterExample = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    type: [],
    difficulty: [],
    language: []
  })

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Resource Type',
      type: 'checkbox',
      values: [
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'book', label: 'Book' },
        { value: 'course', label: 'Course' }
      ]
    },
    {
      key: 'difficulty',
      label: 'Difficulty Level',
      type: 'select',
      values: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    },
    {
      key: 'language',
      label: 'Language',
      type: 'select',
      values: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' }
      ]
    }
  ]

  return (
    <DataFilter
      searchPlaceholder="Search resources..."
      filterButtonText="Filter Resources"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={(key, values) => {
        setSelectedFilters(prev => ({ ...prev, [key]: values }))
      }}
    />
  )
}
