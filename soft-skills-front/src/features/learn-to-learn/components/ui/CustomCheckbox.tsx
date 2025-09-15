import React from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'

interface CustomCheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  id?: string
}

const CustomCheckbox = ({ checked, onChange, label, id }: CustomCheckboxProps) => (
  <FormControlLabel
    control={
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        size="small"
      />
    }
    label={label}
  />
)

export default CustomCheckbox
