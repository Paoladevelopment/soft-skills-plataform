import { Box, Typography, Select, MenuItem, FormControl, Chip } from '@mui/material'
import { ReactNode, useState } from 'react'
import { PriorityColorValue } from '../../types/ui/colors'
import { generateFormFieldAttributes } from '../../../../utils/formUtils'

interface SelectOption {
  value: string
  label: string
}

interface InlineEditableSelectProps {
  label: string
  value: string
  options: SelectOption[]
  onSave: (value: string) => void
  icon?: ReactNode
  getColor?: (value: string) => PriorityColorValue
  id?: string
  name?: string
}

const InlineEditableSelect = ({
  label,
  value,
  options,
  onSave,
  icon,
  getColor,
  id,
  name,
}: InlineEditableSelectProps) => {
  const [hovered, setHovered] = useState(false)
  const fieldAttributes = generateFormFieldAttributes(label, 'inline-select', id, name)

  const handleChange = (newValue: string) => {
    onSave(newValue)
  }

  const inputBackgroundColor = hovered ? '#f9f9f9' : 'transparent'
  
  const currentOption = options.find(option => option.value === value)
  const currentLabel = currentOption?.label || value
  
  const chipColor = getColor ? getColor(value) : 'default'

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        transition: 'box-shadow 0.2s ease-in-out',
        borderRadius: 1,
        display: 'flex',
        gap: 3,
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: '100px',
          flexShrink: 0,
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              fontSize: '1.2rem',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{
            fontWeight: 400,
          }}
          gutterBottom
        >
          {label}
        </Typography>
      </Box>

      <FormControl 
        size="small" 
        sx={{
          backgroundColor: inputBackgroundColor,
          transition: 'background-color 0.2s ease-in-out',
          padding: 1,
        }}
      >
        <Select
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          variant="standard"
          disableUnderline
          id={fieldAttributes.id}
          name={fieldAttributes.name}
          sx={{
            fontSize: '0.875rem',
            '& .MuiSelect-select': {
              padding: '4px 0',
            },
          }}
          renderValue={() => (
            <Chip
              label={currentLabel}
              size="small"
              color={chipColor}
              sx={{
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          )}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Chip
                label={option.label}
                size="small"
                color={getColor ? getColor(option.value) : 'default'}
                sx={{
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default InlineEditableSelect
