import { Box, TextField, Typography } from '@mui/material'
import { TimerOutlined } from '@mui/icons-material'

interface PomodoroFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
}

const PomodoroField = ({ label, value, onChange, min = 0.5, step = 0.5 }: PomodoroFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '' || inputValue === '-') {
      onChange(0)
      
      return
    }
    
    const newValue = parseFloat(inputValue)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value === 0) {
      e.target.select()
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        mb: 2
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
        <TimerOutlined
          sx={{
            color: 'text.secondary',
            fontSize: '1.2rem',
          }}
        />
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
        type="number"
        value={value || ''}
        onChange={handleChange}
        onFocus={handleFocus}
        variant="standard"
        size="small"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: {
              fontSize: '0.875rem',
            },
          },
          htmlInput: {
            min,
            step,
          },
        }}
        sx={{
          flex: 1,
          backgroundColor: 'transparent',
          transition: 'background-color 0.2s ease-in-out',
          padding: 1,
          '&:hover': {
            backgroundColor: '#f9f9f9',
          },
        }}
      />
    </Box>
  )
}

export default PomodoroField

