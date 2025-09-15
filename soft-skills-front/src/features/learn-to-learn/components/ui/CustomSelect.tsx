import { FormControl, Select, MenuItem, SelectChangeEvent, InputLabel } from '@mui/material'

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (event: SelectChangeEvent<string>) => void
  options: SelectOption[]
  placeholder: string
  id?: string
  label?: string
}

const CustomSelect = ({ value, onChange, options, placeholder, id, label }: CustomSelectProps) => (
  <FormControl fullWidth size="small">
    {label && (
      <InputLabel id={`${id}-label`} sx={{ display: 'none' }}>
        {label}
      </InputLabel>
    )}
    <Select
      id={id}
      labelId={label ? `${id}-label` : undefined}
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
