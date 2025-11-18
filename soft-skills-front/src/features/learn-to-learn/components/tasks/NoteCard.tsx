import { Card, CardContent, Typography, Button, Stack, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Delete as DeleteIcon, Description } from '@mui/icons-material'
import { Note } from '../../types/planner/note.api'
import { formatDateString } from '../../../../utils/formatDate'

interface NoteCardProps {
  note: Note
  onDelete: (note: Note) => void
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const { t } = useTranslation(['tasks', 'common'])

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="flex-start"
          >
            <Description 
              sx={{ 
                color: 'text.secondary', mt: 0.5 
                }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="medium" 
                sx={{ 
                  mb: 1 
                }}
              >
                {note.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  whiteSpace: 'pre-wrap' 
                }}
              >
                {note.content}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 1, 
                  display: 'block' 
                }}
              >
                {formatDateString(note.createdAt, '', '')}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(note)}
            fullWidth
          >
            {t('actions.delete', { ns: 'common' })}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NoteCard

