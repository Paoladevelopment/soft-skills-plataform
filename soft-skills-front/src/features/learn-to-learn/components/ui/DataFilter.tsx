import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Popover,
  Typography,
  Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CustomSelect from './CustomSelect';
import CustomCheckbox from './CustomCheckbox';
import { FilterOption } from '../../types/ui/filter.types'

export interface SelectedFilters {
  [key: string]: string[]
}

export interface DataFilterProps {
  searchPlaceholder?: string
  filterButtonText?: string
  searchValue?: string
  onSearchChange: (search: string) => void
  filterOptions: FilterOption[]
  selectedFilters: SelectedFilters
  onFilterChange: (filterKey: string, values: string[]) => void
  onApplyFilters?: () => void
  applyButtonText?: string
}

const DataFilter = ({
  searchPlaceholder = "Search...",
  filterButtonText = "Filter",
  searchValue = "",
  onSearchChange,
  filterOptions,
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  applyButtonText = "Aplicar filtros"
}: DataFilterProps) => {
  const { t } = useTranslation('roadmap')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [rangeErrors, setRangeErrors] = useState<{[key: string]: string}>({})

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleCheckboxChange = (filterKey: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[filterKey] || []
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value)
    
    onFilterChange(filterKey, newValues)
  }

  const handleSelectChange = (filterKey: string, value: string) => {
    onFilterChange(filterKey, value ? [value] : [])
  }

  const handleTextChange = (filterKey: string, value: string) => {
    onFilterChange(filterKey, value ? [value] : [])
  }

  const handleRangeChange = (filterKey: string, minValue: string, maxValue: string) => {
    setRangeErrors(prev => ({ ...prev, [filterKey]: '' }))
    
    const minNum = minValue ? parseInt(minValue) : null
    const maxNum = maxValue ? parseInt(maxValue) : null
    
    const validMin = minNum !== null && minNum < 0 ? 0 : minNum
    const validMax = maxNum !== null && maxNum < 0 ? 0 : maxNum
    
    const finalMinStr = validMin !== null ? validMin.toString() : ''
    const finalMaxStr = validMax !== null ? validMax.toString() : ''
    
    const rangeValue = finalMinStr || finalMaxStr ? 
      [`${finalMinStr}-${finalMaxStr}`] : 
      []

    onFilterChange(filterKey, rangeValue)
  }

  const isValueSelected = (filterKey: string, value: string) => {
    return (selectedFilters[filterKey] || []).includes(value)
  }

  const getSelectedValue = (filterKey: string) => {
    return (selectedFilters[filterKey] || [])[0] || ""
  }

  const getTextValue = (filterKey: string) => {
    return (selectedFilters[filterKey] || [])[0] || ""
  }

  const getRangeValues = (filterKey: string) => {
    const rangeString = (selectedFilters[filterKey] || [])[0] || ""
    if (!rangeString) return { 
      min: "", 
      max: "" 
    }
    
    const [min, max] = rangeString.split('-')
    return { 
      min: min || "", 
      max: max || "" 
    }
  }

  const validateRanges = () => {
    const errors: {[key: string]: string} = {}
    
    filterOptions.forEach(option => {
      if (option.type === 'range') {
        const { min, max } = getRangeValues(option.key)
        if (min && max) {
          const minNum = parseInt(min)
          const maxNum = parseInt(max)
          
          if (maxNum < minNum) {
            errors[option.key] = t('explore.errors.rangeError')
          }
        }
      }
    })
    
    setRangeErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyFilters = () => {
    if (validateRanges() && onApplyFilters) {
      onApplyFilters()
      handleFilterClose()
    }
  }



  const open = Boolean(anchorEl)
  const id = open ? 'data-filter-popover' : undefined

  return (
    <Box
      sx={{
        borderRadius: 2,
        mb: 3,
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}
    >
      <TextField
        id="objectives-search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: 2
          },
          '& .MuiOutlinedInput-input': {
            padding: '0.5rem 0.75rem'
          }
        }}
        slotProps={{
          input: {
            startAdornment: (
              <SearchIcon 
                sx={{ 
                  color: 'text.secondary', 
                  mr: 1 
                }} 
              />
            ),
          },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleFilterClick}
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          textTransform: 'none'
        }}
      >
        {filterButtonText}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: 2,
            p: 2,
            minWidth: 250,
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'white'
          }
        }}
      >
        <Stack spacing={1}>
          {filterOptions.map((option) => (
            <Box key={option.key}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                {option.label}
              </Typography>
              
              {option.type === 'checkbox' && option.values && (
                <Stack>
                  {option.values.map((item) => (
                    <CustomCheckbox
                      key={`${option.key}-${item.value}`}
                      id={`filter-${option.key}-${item.value}`}
                      checked={isValueSelected(option.key, item.value)}
                      onChange={(e) => handleCheckboxChange(option.key, item.value, e.target.checked)}
                      label={item.label}
                    />
                  ))}
                </Stack>
              )}

              {option.type === 'select' && (
                <CustomSelect
                  id={`filter-${option.key}`}
                  label={option.label}
                  value={getSelectedValue(option.key)}
                  onChange={(e) => handleSelectChange(option.key, e.target.value)}
                  options={option.values || []}
                  placeholder={option.placeholder || option.label}
                />
              )}

              {option.type === 'text' && (
                <TextField
                  id={`filter-${option.key}`}
                  placeholder={option.placeholder || option.label}
                  value={getTextValue(option.key)}
                  onChange={(e) => handleTextChange(option.key, e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 1
                    }
                  }}
                />
              )}

              {option.type === 'range' && (
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      id={`filter-${option.key}-min`}
                      placeholder={option.minPlaceholder || "Min"}
                      value={getRangeValues(option.key).min}
                      onChange={(e) => {
                        const { max } = getRangeValues(option.key)
                        handleRangeChange(option.key, e.target.value, max)
                      }}
                      size="small"
                      type="number"
                      slotProps={{ 
                        htmlInput: { min: 0 } 
                      }}
                      error={!!rangeErrors[option.key]}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 1
                        }
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t('explore.range.to')}
                    </Typography>
                    <TextField
                      id={`filter-${option.key}-max`}
                      placeholder={option.maxPlaceholder || "Max"}
                      value={getRangeValues(option.key).max}
                      onChange={(e) => {
                        const { min } = getRangeValues(option.key)
                        handleRangeChange(option.key, min, e.target.value)
                      }}
                      size="small"
                      type="number"
                      slotProps={{ 
                        htmlInput: { min: 0 } 
                      }}
                      error={!!rangeErrors[option.key]}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 1
                        }
                      }}
                    />
                  </Stack>
                  {rangeErrors[option.key] && (
                    <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem' }}>
                      {rangeErrors[option.key]}
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          ))}
          
          {onApplyFilters && (
            <Box 
              sx={{ 
                mt: 2, 
                pt: 2, 
                borderTop: '1px solid #e0e0e0' 
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleApplyFilters}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {applyButtonText}
              </Button>
            </Box>
          )}
        </Stack>
      </Popover>
    </Box>
  )
}

export default DataFilter
