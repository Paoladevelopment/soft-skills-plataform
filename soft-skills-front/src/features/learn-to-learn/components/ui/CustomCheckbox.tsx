import React from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'

interface CustomCheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}

const CustomCheckbox = ({ checked, onChange, label }: CustomCheckboxProps) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={checked}
        onChange={onChange}
        size="small"
      />
    }
    label={label}
  />
)

export default CustomCheckbox
