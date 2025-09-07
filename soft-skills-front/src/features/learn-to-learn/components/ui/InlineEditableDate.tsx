import { Box, Typography, TextField } from '@mui/material'
import { ReactNode, useState } from 'react'
import { generateFormFieldAttributes } from '../../../../utils/formUtils'

interface InlineEditableDateProps {
  label: string
  value: string | null
  onSave: (value: string | null) => void
  icon?: ReactNode
  id?: string
  name?: string
}

const InlineEditableDate = ({
  label,
  value,
  onSave,
  icon,
  id,
  name,
}: InlineEditableDateProps) => {
  const [hovered, setHovered] = useState(false)
  const fieldAttributes = generateFormFieldAttributes(label, 'inline-date', id, name)

  const handleChange = (newValue: string) => {
    onSave(newValue || null)
  }

  const inputBackgroundColor = hovered ? '#f9f9f9' : 'transparent'

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return dateString.split('T')[0]
    } catch {
      return ''
    }
  }

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

      <TextField
        type="date"
        value={formatDateForInput(value)}
        onChange={(e) => handleChange(e.target.value)}
        variant="standard"
        size="small"
        id={fieldAttributes.id}
        name={fieldAttributes.name}
        sx={{
          backgroundColor: inputBackgroundColor,
          transition: 'background-color 0.2s ease-in-out',
          padding: 1,
        }}
        slotProps={{
          input: {
            disableUnderline: true,
            sx: {
              fontSize: '0.875rem',
            },
          },
        }}
      />
    </Box>
  )
}

export default InlineEditableDate
