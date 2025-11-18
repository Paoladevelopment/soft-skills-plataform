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
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { Objective } from '../../types/planner/planner.models'
import { formatDateString } from '../../../../utils/formatDate'
import { getPriorityColor, getStatusChipColor, formatStatus, formatPriority } from '../../utils/objectiveUtils'



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
  onDeleteClick?: (objective: Objective) => void
  onViewClick?: (objective: Objective) => void
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
  hasFiltersApplied,
  onDeleteClick,
  onViewClick
}: ObjectivesTableProps) => {
  const { t } = useTranslation('goals')
  
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
          {t('objectives.table.errorLoading')}: {error.message}
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
            ? t('objectives.table.noObjectivesMatchFilters')
            : t('objectives.table.noObjectivesFound')}
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
                {t('objectives.table.objective')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                {t('objectives.table.status')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                {t('objectives.table.priority')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                {t('objectives.table.dueDate')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                {t('objectives.table.progress')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'semibold', color: 'text.primary' 
                }}
              >
                {t('objectives.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {objectives.map((objective, index) => (
              <TableRow 
                key={objective.objectiveId || `objective-${index}`} 
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
                    color={getStatusChipColor(objective.status)}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={formatPriority(objective.priority)} 
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
                      {formatDateString(objective.dueDate, t('objectives.table.noDueDate'), "")}
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
                      value={calculateProgress(objective.completedTasks, objective.totalTasks)}
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
                        {calculateProgress(objective.completedTasks, objective.totalTasks)}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      gap: 0.5
                    }}
                  >
                    {onViewClick && (
                      <Tooltip title={t('objectives.table.viewObjective')}>
                        <IconButton 
                          size="small" 
                          onClick={() => onViewClick(objective)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDeleteClick && (
                      <Tooltip title={t('objectives.table.deleteObjective')}>
                        <IconButton 
                          size="small" 
                          onClick={() => onDeleteClick(objective)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        id="objectives-pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={t('objectives.table.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => 
          t('objectives.table.pagination.displayedRows', { from, to, count })
        }
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
