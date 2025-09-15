import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Popover,
  Typography,
  Stack,
} from '@mui/material'
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
}

const DataFilter = ({
  searchPlaceholder = "Search...",
  filterButtonText = "Filter",
  searchValue = "",
  onSearchChange,
  filterOptions,
  selectedFilters,
  onFilterChange
}: DataFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

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

  const isValueSelected = (filterKey: string, value: string) => {
    return (selectedFilters[filterKey] || []).includes(value)
  }

  const getSelectedValue = (filterKey: string) => {
    return (selectedFilters[filterKey] || [])[0] || ""
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
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
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
              
              {option.type === 'checkbox' && (
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
                  options={option.values}
                  placeholder={option.placeholder || option.label}
                />
              )}
            </Box>
          ))}
        </Stack>
      </Popover>
    </Box>
  )
}

export default DataFilter
