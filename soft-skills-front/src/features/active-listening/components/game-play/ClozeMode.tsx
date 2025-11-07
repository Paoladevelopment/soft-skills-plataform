import { Box, TextField, Typography, Card} from '@mui/material'
import { ClozeModePayload } from '../../types/game-sessions/gamePlay.models'
import { splitTextByBlanks, getBlankIndices, isBlank } from '../../utils/clozeUtils'

interface ClozeModeProps {
  modePayload: ClozeModePayload
  filledBlanks: string[]
  onBlankChange?: (index: number, value: string) => void
  disabled?: boolean
}

const ClozeMode = ({ modePayload, filledBlanks, onBlankChange, disabled = false }: ClozeModeProps) => {
  const parts = splitTextByBlanks(modePayload.textWithBlanks)
  const blankIndices = getBlankIndices(parts)

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3 
      }}>
      <Card
        sx={{
          p: 3,
          backgroundColor: '#E3F2FD',
          borderRadius: '12px',
          borderLeft: '4px solid #2196F3',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1565C0' }}>
          Fill in the blanks
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Listen carefully and complete the missing words in the following text:
        </Typography>
      </Card>

      <Card
        sx={{
          p: 3,
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
        }}
      >
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            gap: 1, 
            lineHeight: 1.8 
            }}
        >
          {parts.map((part, index) => {
            if (isBlank(part)) {
              const blankIndex = blankIndices.indexOf(index)
              return (
                <TextField
                  key={index}
                  value={filledBlanks[blankIndex] || ''}
                  onChange={(e) => onBlankChange?.(blankIndex, e.target.value)}
                  placeholder={`Blank ${blankIndex + 1}`}
                  variant="outlined"
                  size="small"
                  disabled={disabled}
                  sx={{
                    width: '150px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFACD',
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196F3',
                      },
                    },
                  }}
                />
              )
            }
            return (
              <Typography
                key={index}
                component="span"
                variant="body1"
                sx={{ whiteSpace: 'pre-wrap' }}
              >
                {part}
              </Typography>
            )
          })}
        </Box>
      </Card>
    </Box>
  )
}

export default ClozeMode

