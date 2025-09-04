import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (event: SelectChangeEvent<string>) => void
  options: SelectOption[]
  placeholder: string
}

const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => (
  <FormControl fullWidth size="small">
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      sx={{ 
        backgroundColor: 'white' 
      }}
    >
      <MenuItem value="">{placeholder}</MenuItem>

      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
      
    </Select>
  </FormControl>
)

export default CustomSelect
