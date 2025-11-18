import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Add } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNoteStore } from '../../store/useNoteStore'
import AddNoteModal from './AddNoteModal'
import ConfirmDeleteModal from '../../../../components/ConfirmDeleteModal'
import NoteCard from './NoteCard'
import { Note } from '../../types/planner/note.api'

interface NotesSectionProps {
  taskId: string
}

const NotesSection = ({ taskId }: NotesSectionProps) => {
  const { t } = useTranslation(['tasks'])
  const { notes, isLoading, fetchTaskNotes, createNote, deleteNoteById } = useNoteStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  useEffect(() => {
    if (taskId) {
      fetchTaskNotes(taskId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  const handleCreateNote = async (payload: { title: string; content: string }) => {
    await createNote(taskId, payload)
    setIsAddModalOpen(false)
  }

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note)
  }

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      await deleteNoteById(taskId, noteToDelete.noteId)
      setNoteToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            py: 4 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ 
            mb: 2 
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {t('tasks:notes.title')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            {t('tasks:notes.addButton')}
          </Button>
        </Stack>

        {notes.length === 0 ? (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              py: 2 
            }}
          >
            {t('tasks:notes.empty', { defaultValue: 'No notes added yet' })}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {notes.map((note) => (
              <NoteCard
                key={note.noteId}
                note={note}
                onDelete={handleDeleteNote}
              />
            ))}
          </Stack>
        )}
      </Box>

      <AddNoteModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateNote}
      />

      <ConfirmDeleteModal
        open={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t('tasks:notes.deleteConfirm', { defaultValue: 'Delete note?' })}
        message={t('tasks:notes.deleteMessage', { 
          defaultValue: 'Are you sure you want to delete this note? This action cannot be undone.',
          note: noteToDelete?.title 
        })}
      />
    </>
  )
}

export default NotesSection

