import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface ClarifyModeProps {
  clarifyQuestions: string[]
  onQuestionChange?: (index: number, value: string) => void
  onAddQuestion?: () => void
  onRemoveQuestion?: (index: number) => void
  borderColor: string
  backgroundColor: string
  textColor: string
  disabled?: boolean
}

const ClarifyMode = ({
  clarifyQuestions,
  onQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
  borderColor,
  backgroundColor,
  textColor,
  disabled = false,
}: ClarifyModeProps) => {
  const { t } = useTranslation('game')
  
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
        {t('play.clarify.title')}
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
            onChange={(e) => onQuestionChange?.(index, e.target.value)}
            placeholder={t('play.clarify.questionPlaceholder', { number: index + 1 })}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            disabled={disabled}
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
              onClick={() => onRemoveQuestion?.(index)}
              disabled={disabled}
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
        disabled={disabled}
        sx={{
          color: textColor,
          borderColor: borderColor,
          '&:hover': {
            backgroundColor: backgroundColor,
          },
        }}
      >
        {t('play.clarify.addQuestion')}
      </Button>
    </Box>
  )
}

export default ClarifyMode

