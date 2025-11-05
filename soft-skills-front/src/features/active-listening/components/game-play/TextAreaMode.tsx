import { Box, TextField, Typography, Card, Alert } from '@mui/material'
import { TextModePayload } from '../../types/game-sessions/gamePlay.models'
import { PlayMode } from '../../types/game-sessions/gameSession.models'

interface TextAreaModeProps {
  playMode: PlayMode
  modePayload: TextModePayload
  textResponse: string
  onTextChange: (value: string) => void
}

const getModeInfo = (mode: PlayMode) => {
  switch (mode) {
    case PlayMode.PARAPHRASE:
      return {
        title: 'Paraphrase the content',
        description: 'Restate the main ideas in your own words without changing the meaning.',
        prompt: 'Paraphrase what you heard:',
        color: '#FFF9C4',
        borderColor: '#FBC02D',
        textColor: '#F57F17',
      }
    case PlayMode.SUMMARIZE:
      return {
        title: 'Summarize the content',
        description: 'Provide a brief summary of the key points you heard.',
        prompt: 'Summarize what you heard:',
        color: '#F3E5F5',
        borderColor: '#9C27B0',
        textColor: '#6A1B9A',
      }
    case PlayMode.CLARIFY:
      return {
        title: 'Clarify the content',
        description: 'Ask clarifying questions about what you heard or provide additional context.',
        prompt: 'What would you like to clarify:',
        color: '#FCE4EC',
        borderColor: '#E91E63',
        textColor: '#AD1457',
      }
    default:
      return {
        title: 'Provide your response',
        description: 'Type your response here.',
        prompt: 'Your response:',
        color: '#F5F5F5',
        borderColor: '#9E9E9E',
        textColor: '#424242',
      }
  }
}

const TextAreaMode = ({ playMode, modePayload, textResponse, onTextChange }: TextAreaModeProps) => {
  const info = getModeInfo(playMode)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card
        sx={{
          p: 3,
          backgroundColor: info.color,
          borderRadius: '12px',
          borderLeft: `4px solid ${info.borderColor}`,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: info.textColor }}>
          {info.title}
        </Typography>
        <Typography variant="body2" sx={{ color: info.textColor, mb: 2 }}>
          {info.description}
        </Typography>
        {modePayload.instruction && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">{modePayload.instruction}</Typography>
          </Alert>
        )}
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {info.prompt}
        </Typography>
        <TextField
          value={textResponse}
          onChange={(e) => onTextChange(e.target.value)}
          multiline
          rows={8}
          placeholder="Type your response here..."
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              '&.Mui-focused fieldset': {
                borderColor: info.borderColor,
              },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '1rem',
              lineHeight: 1.6,
            },
          }}
        />
        <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          Word count: {textResponse.trim().split(/\s+/).filter(w => w.length > 0).length} words
        </Typography>
      </Box>
    </Box>
  )
}

export default TextAreaMode

