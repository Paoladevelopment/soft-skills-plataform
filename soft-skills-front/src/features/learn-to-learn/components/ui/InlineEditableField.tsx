import { Box, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface EditableFieldProps {
  label: string
  defaultValue: string
  onSave: (val: string) => void
  multiline?: boolean
  disableDefaultDecoration?: boolean
  customInputStyles?: object
}

const InlineEditableField = ({
  label,
  defaultValue,
  onSave,
  multiline = false,
  disableDefaultDecoration = false,
  customInputStyles,
}: EditableFieldProps) => {
  const [value, setValue] = useState(defaultValue)
  const [hovered, setHovered] = useState(false)

  const shouldShowShadow = !disableDefaultDecoration && hovered
  const shouldShowLabel = !disableDefaultDecoration

  const inputBackgroundColor = shouldShowShadow ? '#f9f9f9' : 'transparent'

  const defaultTitleInputStyles = {
    fontSize: '2rem',
    fontWeight: 700,
  }

  const inputTextStyles = customInputStyles || (disableDefaultDecoration ? defaultTitleInputStyles : {})

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        transition: 'box-shadow 0.2s ease-in-out',
        borderRadius: 1,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}
    >
      {shouldShowLabel && (
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            minWidth: '100px', 
            flexShrink: 0 
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        variant="standard"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSave(value)
          }
        }}
        multiline={multiline}
        slotProps={{
          input: {
            disableUnderline: true,
            sx: inputTextStyles,
          },
        }}
        sx={{
          backgroundColor: inputBackgroundColor,
          transition: 'background-color 0.2s ease-in-out',
          padding: 1,
        }}
      />
    </Box>
  )
}

export default InlineEditableField