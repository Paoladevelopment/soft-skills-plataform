import { Box, FormControl, FormControlLabel, RadioGroup, Radio, Typography, Card } from '@mui/material'
import { FocusModePayload } from '../../types/game-sessions/gamePlay.models'

interface FocusModeProps {
  modePayload: FocusModePayload
  selectedIndex: number | null
  onAnswerChange: (index: number) => void
}

const FocusMode = ({ modePayload, selectedIndex, onAnswerChange }: FocusModeProps) => {
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
          backgroundColor: '#F3E5F5',
          borderRadius: '12px',
          borderLeft: '4px solid #9C27B0',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#5E35B1' 
          }}>
          Question
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#333', 
            whiteSpace: 'pre-wrap' 
          }}>
          {modePayload.question}
        </Typography>
      </Card>

      <FormControl sx={{ width: '100%' }}>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2 
          }}>
            Select your answer:
        </Typography>
        <RadioGroup
          value={selectedIndex !== null ? selectedIndex.toString() : ''}
          onChange={(e) => onAnswerChange(parseInt(e.target.value))}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {modePayload.answerChoices?.map((choice, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                cursor: 'pointer',
                backgroundColor: selectedIndex === index ? '#C8E6C9' : '#FFFFFF',
                borderRadius: '8px',
                border: selectedIndex === index ? '2px solid #4CAF50' : '1px solid #E0E0E0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: selectedIndex === index ? '#C8E6C9' : '#F5F5F5',
                  borderColor: '#4CAF50',
                },
              }}
            >
              <FormControlLabel
                value={index.toString()}
                control={<Radio />}
                label={
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {choice}
                  </Typography>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Card>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default FocusMode

