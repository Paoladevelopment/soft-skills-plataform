import { Box, TextField, Typography } from '@mui/material'

interface TextInputProps {
  textResponse: string
  onTextChange?: (value: string) => void
  borderColor: string
  prompt: string
  disabled?: boolean
}

const TextInput = ({ textResponse, onTextChange, borderColor, prompt, disabled = false }: TextInputProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {prompt}
      </Typography>
      <TextField
        value={textResponse}
        onChange={(e) => onTextChange?.(e.target.value)}
        multiline
        rows={8}
        placeholder="Type your response here..."
        fullWidth
        variant="outlined"
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            '&.Mui-focused fieldset': {
              borderColor: borderColor,
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
        }}
      />
    </Box>
  )
}

export default TextInput

