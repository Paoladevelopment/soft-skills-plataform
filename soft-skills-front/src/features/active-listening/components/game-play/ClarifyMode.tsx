import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'

interface ClarifyModeProps {
  clarifyQuestions: string[]
  onQuestionChange: (index: number, value: string) => void
  onAddQuestion: () => void
  onRemoveQuestion: (index: number) => void
  borderColor: string
  backgroundColor: string
  textColor: string
}

const ClarifyMode = ({
  clarifyQuestions,
  onQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
  borderColor,
  backgroundColor,
  textColor,
}: ClarifyModeProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 'bold' 
        }}>
        What would you like to clarify:
      </Typography>
      {clarifyQuestions.map((question, index) => (
        <Box 
          key={index} 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'flex-start' 
          }}
        >
          <TextField
            value={question}
            onChange={(e) => onQuestionChange(index, e.target.value)}
            placeholder={`Question ${index + 1}...`}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: borderColor,
                },
              },
            }}
          />
          {clarifyQuestions.length > 1 && (
            <IconButton
              onClick={() => onRemoveQuestion(index)}
              sx={{
                color: '#F44336',
                mt: 0.5,
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        onClick={onAddQuestion}
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{
          color: textColor,
          borderColor: borderColor,
          '&:hover': {
            backgroundColor: backgroundColor,
          },
        }}
      >
        Add another question
      </Button>
    </Box>
  )
}

export default ClarifyMode

