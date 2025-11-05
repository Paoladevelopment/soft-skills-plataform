import { Box, TextField, Typography, Card, Chip } from '@mui/material'
import { ClozeModePayload } from '../../types/game-sessions/gamePlay.models'

interface ClozeModeProps {
  modePayload: ClozeModePayload
  filledBlanks: string[]
  onBlankChange: (index: number, value: string) => void
}

const ClozeMode = ({ modePayload, filledBlanks, onBlankChange }: ClozeModeProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {modePayload.blanks?.map((placeholder: string, index: number) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              borderRadius: '8px',
              backgroundColor: '#F5F5F5',
              border: '1px solid #E0E0E0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`Blank #${index + 1}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                {placeholder}
              </Typography>
            </Box>
            <TextField
              placeholder="Type your answer here..."
              value={filledBlanks[index] || ''}
              onChange={(e) => onBlankChange(index, e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196F3',
                  },
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ClozeMode

