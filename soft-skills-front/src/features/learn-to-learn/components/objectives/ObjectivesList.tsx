import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useObjectives, useCreateObjective } from '../../hooks/useObjectives'
import { useObjectiveStore } from '../../store/useObjectiveStore'
import DataFilter from '../ui/DataFilter'
import ObjectivesTable from './ObjectivesTable'
import AddObjectiveModal from './AddObjectiveModal'
import { CreateObjectivePayload } from '../../types/planner/objectives.api'
import { FilterOption, TabValue } from '../../types/ui/filter.types'
import { Priority, Status } from '../../types/common.enums'

interface ObjectivesListProps {
  learningGoalId: string
}

const ObjectivesList = ({ learningGoalId }: ObjectivesListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    selectedTab,
    searchTerm,
    selectedFilters,
    objectivesPagination,
    setSelectedTab,
    setSearchTerm,
    updateFilter,
    setObjectivesOffset,
    setObjectivesLimit,
    setObjectivesTotal,
    resetAll
  } = useObjectiveStore()

  const { mutateAsync: createObjective } = useCreateObjective()

  const { offset, limit } = objectivesPagination
  const page = Math.floor(offset / limit)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const formatDateToDateTime = (dateString: string): string => {
    if (dateString.includes('T')) {
      return dateString
    }
    

    return `${dateString}T23:59:59Z`
  }

  const handleSubmit = async (objective: CreateObjectivePayload) => {
    const objectiveWithLearningGoal: CreateObjectivePayload = {
      title: objective.title,
      description: objective.description,
      priority: objective.priority,
      learning_goal_id: learningGoalId,
      order_index: 0
    }

    if (objective.due_date && objective.due_date.trim() !== '') {
      objectiveWithLearningGoal.due_date = formatDateToDateTime(objective.due_date)
    }

    await createObjective(objectiveWithLearningGoal)
    setIsModalOpen(false)
  }

  const getTabFilters = (tab: TabValue) => {
    switch (tab) {
      case 'incomplete':
        return { 
          status: 'not_started' 
        }
      case 'ongoing':
        return { 
          status: 'in_progress' 
        }
      case 'finished':
        return { 
          status: 'completed' 
        }
      case 'all':
      default:
        return { 
          status: undefined 
        }
    }
  }

  const tabFilters = getTabFilters(selectedTab)
  const priorityFilter = selectedFilters.priority.length > 0 ? selectedFilters.priority : undefined
  const statusFilter = tabFilters.status || (selectedFilters.status.length > 0 ? selectedFilters.status[0] : undefined)

  const { data: objectivesData, isLoading, error } = useObjectives(
    learningGoalId,
    offset,
    limit,
    statusFilter,
    priorityFilter,
    searchTerm
  )

  const objectives = objectivesData?.data || []

  useEffect(() => {
    setObjectivesTotal(objectivesData?.total)
  }, [objectivesData?.total, setObjectivesTotal])

  useEffect(() => {
    return () => {
      resetAll()
    }
  }, [learningGoalId, resetAll])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setSelectedTab(newValue)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    const newOffset = newPage * limit
    setObjectivesOffset(newOffset)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setObjectivesLimit(newLimit)
  }

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterChange = (filterKey: string, values: string[]) => {
    updateFilter(filterKey, values)
  }

  const getFilterOptions = (): FilterOption[] => {
    const baseOptions: FilterOption[] = [
      {
        key: 'priority',
        label: 'Priority Level',
        type: 'checkbox',
        values: [
          { value: Priority.High, label: 'High' },
          { value: Priority.Medium, label: 'Medium' },
          { value: Priority.Low, label: 'Low' }
        ]
      }
    ]

    if (selectedTab === 'all') {
      baseOptions.push({
        key: 'status',
        label: 'progress status',
        placeholder: 'Filter by progress',
        type: 'select',
        values: [
          { value: Status.NotStarted, label: 'Not started' },
          { value: Status.InProgress, label: 'In progress' },
          { value: Status.Completed, label: 'Completed' },
          { value: Status.Paused, label: 'Paused' }
        ]
      })
    }

    return baseOptions
  }

  const filterOptions = getFilterOptions()

  const hasFiltersApplied = searchTerm.length > 0 || 
                           selectedFilters.priority.length > 0 || 
                           selectedFilters.status.length > 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Objectives
        </Typography>
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
          Add Objective
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          <Tab 
            label="All"
            value="all" 
          />
          <Tab 
            label="Incomplete"
            value="incomplete" 
          />
          <Tab 
            label="Ongoing"
            value="ongoing" 
          />
          <Tab 
            label="Finished"
            value="finished" 
          />
        </Tabs>
      </Box>

      <DataFilter
        searchPlaceholder="Search objectives..."
        filterButtonText="Filter Column"
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <ObjectivesTable
        objectives={objectives}
        isLoading={isLoading}
        error={error}
        total={objectivesData?.total || 0}
        page={page}
        rowsPerPage={limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        hasFiltersApplied={hasFiltersApplied}
      />

      <AddObjectiveModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default ObjectivesList
