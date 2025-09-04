import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Objective } from '../../types/planner/objectives.api'
import { formatDateString } from '../../../../utils/formatDate'

const formatStatus = (status: string): string => {
  return status.replace('_', ' ')
}

const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'default' => {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'info'
  if (status === 'paused') return 'warning'
  
  return 'default'
}

const getPriorityColor = (priority: string): 'error' | 'warning' | 'default' => {
  if (priority === 'high') return 'error'
  if (priority === 'medium') return 'warning'
  
  return 'default'
}

const calculateProgress = (completedTasks: number, totalTasks: number): number => {
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
}

interface ObjectivesTableProps {
  objectives: Objective[]
  isLoading: boolean
  error: Error | null
  total: number
  page: number
  rowsPerPage: number
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  hasFiltersApplied: boolean
}

const ObjectivesTable = ({
  objectives,
  isLoading,
  error,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  hasFiltersApplied
}: ObjectivesTableProps) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">
          Error loading objectives: {error.message}
        </Typography>
      </Box>
    )
  }

  if (objectives.length === 0) {
    return (
      <Paper
        variant="outlined"
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          border: '1px dashed #ccc',
          boxShadow: 'none'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {hasFiltersApplied
            ? 'No objectives match your current filters.'
            : 'No objectives found for this learning goal.'}
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <TableContainer 
        component={Paper} 
        elevation={1}
        variant="outlined" 
        sx={{ 
          borderRadius: '8px 8px 0 0',
          boxShadow: 'none',
          '& .MuiPaper-root': {
            boxShadow: 'none'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow 
              sx={{ 
                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                },
                '& th': {
                  borderBottom: '1px solid #e6e6e6'
                }
              }}
            >
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Objective
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Status
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Priority
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Due Date
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Progress
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {objectives.map((objective, index) => (
              <TableRow 
                key={objective.objective_id || `objective-${index}`} 
                hover
                sx={{
                  backgroundColor: '#fcfcfc',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  },
                  '& td': {
                    borderBottom: '1px solid #e6e6e6'
                  },
                  '&:last-child td': {
                    borderBottom: 'none'
                  }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="semibold" 
                      sx={{ 
                        mb: 0.5 
                      }}
                    >
                      {objective.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.875rem' 
                      }}>
                        {objective.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={formatStatus(objective.status)} 
                    size="small" 
                    color={getStatusColor(objective.status)}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={objective.priority} 
                    size="small" 
                    color={getPriorityColor(objective.priority)}
                  />
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateString(objective.due_date, "No due date", "")}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={50}
                      thickness={4}
                      sx={{ 
                        color: '#e0e0e0',
                        position: 'absolute'
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={calculateProgress(objective.completed_tasks, objective.total_tasks)}
                      size={50}
                      thickness={4}
                      sx={{ color: 'primary.main' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">
                        {calculateProgress(objective.completed_tasks, objective.total_tasks)}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ 
                        minWidth: 'auto',
                        padding: 1,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          border: '1px solid #d1d1d1',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          backgroundColor: '#5AA3F0',
          color: '#fff',
          '& .MuiTablePagination-toolbar': {
            color: '#fff'
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            color: '#fff'
          },
          '& .MuiSelect-select, & .MuiIconButton-root': {
            color: '#fff'
          },
          '& .MuiSelect-icon': {
            color: '#fff'
          }
        }}
      />
    </Box>
  )
}

export default ObjectivesTable
