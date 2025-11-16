import { Box, Typography, Chip, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FilterOption, FilterType } from '../../types/ui/filter.types'

export interface SelectedFilters {
  [key: string]: string[]
}

interface ActiveFiltersProps {
  appliedFilters: SelectedFilters
  filterOptions: FilterOption[]
  onRemoveFilter: (filterKey: string) => void
  onClearAllFilters: () => void
}

const ActiveFilters = ({
  appliedFilters,
  filterOptions,
  onRemoveFilter,
  onClearAllFilters
}: ActiveFiltersProps) => {
  const { t } = useTranslation('roadmap')
  const getFilterChips = () => {
    const chipLabelGenerators: Record<FilterType, (option: FilterOption, value: string) => string> = {
      text: (option: FilterOption, value: string) => `${option.label}: ${value}`,
      
      range: (option: FilterOption, value: string) => {
        const [min, max] = value.split('-')
        const minText = min || ''
        const maxText = max || ''
        
        if (minText && maxText) return `${option.label}: ${minText}-${maxText}`
        if (minText) return `${option.label}: ≥${minText}`
        if (maxText) return `${option.label}: ≤${maxText}`
        return ''
      },
      
      select: (option: FilterOption, value: string) => {
        const optionValue = option.values?.find(v => v.value === value)
        return `${option.label}: ${optionValue?.label || value}`
      },
      
      checkbox: (option: FilterOption, value: string) => {
        const optionValue = option.values?.find(v => v.value === value)
        return `${option.label}: ${optionValue?.label || value}`
      }
    }

    return filterOptions.flatMap(option => {
      const values = appliedFilters[option.key] || []
      const labelGenerator = chipLabelGenerators[option.type]
      
      return values
        .map(value => labelGenerator(option, value))
        .filter(label => label)
        .map((label, index) => ({
          key: `${option.key}-${values[index]}`,
          label,
          onDelete: () => onRemoveFilter(option.key)
        }))
    })
  }

  const filterChips = getFilterChips()

  if (filterChips.length === 0) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
      <Typography 
        variant="body1" 
        color="secondary.800" 
        fontWeight="500"
        sx={{ mr: 1 }}
      >
        {t('explore.activeFilters')}
      </Typography>
      
      {filterChips.map(chip => (
        <Chip
          key={chip.key}
          label={chip.label}
          onDelete={chip.onDelete}
          size="small"
          variant="outlined"
          sx={{
            borderColor: 'secondary.500',
            color: 'secondary.800',
            '& .MuiChip-deleteIcon': {
              color: 'secondary.800',
              '&:hover': {
                color: 'secondary.900'
              }
            },
            '&:hover': {
              backgroundColor: 'secondary.50'
            }
          }}
        />
      ))}
      
      <Button
        variant="text"
        size="small"
        onClick={onClearAllFilters}
        sx={{
          textTransform: 'none',
          color: 'secondary.800',
          fontSize: '0.75rem',
          minWidth: 'auto',
          p: 0.5,
          ml: 1
        }}
      >
        {t('explore.clearAllFilters')}
      </Button>
    </Box>
  )
}

export default ActiveFilters
