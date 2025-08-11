import { Box, TextField, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useState } from 'react'

interface EditableFieldProps {
  label: string
  defaultValue: string
  onSave: (val: string) => void
  multiline?: boolean
  /**
   * When true, disables the default decoration of the field:
   * - No label is shown
   * - Field is styled as a title (Larger font, bold)
   */
  disableDefaultDecoration?: boolean
  customInputStyles?: object
  customTextFieldStyles?: object
  icon?: ReactNode
}

const InlineEditableField = ({
  label,
  defaultValue,
  onSave,
  multiline = false,
  disableDefaultDecoration = false,
  customInputStyles,
  customTextFieldStyles,
  icon,
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

  const withLabelTitleInputStyles = {
    fontSize: '0.875rem',
  }

  const defaultTextFieldStyles = {
    backgroundColor: inputBackgroundColor,
    transition: 'background-color 0.2s ease-in-out',
    paddingY: 1,
  }

  const withLabelTextFieldStyles = {
    backgroundColor: inputBackgroundColor,
    transition: 'background-color 0.2s ease-in-out',
    padding: 1,
  }

  const inputTextStyles = customInputStyles || (disableDefaultDecoration ? defaultTitleInputStyles : withLabelTitleInputStyles)
  const textFieldStyles = customTextFieldStyles || (disableDefaultDecoration ? defaultTextFieldStyles : withLabelTextFieldStyles)

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
            gutterBottom
          >
            {label}
          </Typography>
        </Box>
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
        sx={textFieldStyles}
      />
    </Box>
  )
}

export default InlineEditableField