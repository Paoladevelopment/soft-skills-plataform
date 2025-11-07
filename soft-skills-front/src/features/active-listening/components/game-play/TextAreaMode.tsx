import { Box, Typography, Card, Alert } from '@mui/material'
import { TextModePayload } from '../../types/game-sessions/gamePlay.models'
import { PlayMode } from '../../types/game-sessions/gameSession.models'
import { getModeInfo } from '../../utils/getModeInfo'
import ClarifyMode from './ClarifyMode'
import TextInput from './TextInput'

interface TextAreaModeProps {
  playMode: PlayMode
  modePayload: TextModePayload
  textResponse: string
  onTextChange?: (value: string) => void
  clarifyQuestions?: string[]
  onClarifyQuestionsChange?: (questions: string[]) => void
  disabled?: boolean
}

const TextAreaMode = ({ 
  playMode, 
  modePayload, 
  textResponse, 
  onTextChange,
  clarifyQuestions = [],
  onClarifyQuestionsChange,
  disabled = false
}: TextAreaModeProps) => {
  const info = getModeInfo(playMode)
  const isClarifyMode = playMode === PlayMode.CLARIFY

  const handleAddQuestion = () => {
    if (onClarifyQuestionsChange) {
      onClarifyQuestionsChange([...clarifyQuestions, ''])
    }
  }

  const handleRemoveQuestion = (index: number) => {
    if (onClarifyQuestionsChange) {
      onClarifyQuestionsChange(clarifyQuestions.filter((_, i) => i !== index))
    }
  }

  const handleQuestionChange = (index: number, value: string) => {
    if (onClarifyQuestionsChange) {
      const newQuestions = [...clarifyQuestions]
      newQuestions[index] = value
      onClarifyQuestionsChange(newQuestions)
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3 
      }}
    >
      <Card
        sx={{
          p: 3,
          backgroundColor: info.color,
          borderRadius: '12px',
          borderLeft: `4px solid ${info.borderColor}`,
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: info.textColor 
          }}
        >
          {info.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: info.textColor, mb: 2 
          }}
        >
          {info.description}
        </Typography>
        {modePayload.instruction && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">{modePayload.instruction}</Typography>
          </Alert>
        )}
      </Card>

      {isClarifyMode ? (
        <ClarifyMode
          clarifyQuestions={clarifyQuestions}
          onQuestionChange={!disabled ? handleQuestionChange : undefined}
          onAddQuestion={!disabled ? handleAddQuestion : undefined}
          onRemoveQuestion={!disabled ? handleRemoveQuestion : undefined}
          borderColor={info.borderColor}
          backgroundColor={info.color}
          textColor={info.textColor}
          disabled={disabled}
        />
      ) : (
        <TextInput
          textResponse={textResponse}
          onTextChange={!disabled ? onTextChange : undefined}
          borderColor={info.borderColor}
          prompt={info.prompt}
          disabled={disabled}
        />
      )}
    </Box>
  )
}

export default TextAreaMode

