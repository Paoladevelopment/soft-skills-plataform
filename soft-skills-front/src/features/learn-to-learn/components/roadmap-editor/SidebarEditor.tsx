import {
  Box,
  TextField,
  Typography,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { findNodeById } from '../../utils/roadmap/roadmap_graph_helpers'
import { LayoutNodeType } from '../../types/roadmap/roadmap.enums'
import { EditorTab } from '../../types/roadmap/roadmap.options'

const SidebarEditor = () => {
  const [tab, setTab] = useState<EditorTab>('properties')

  const {
    selectedNodeId,
    editorNodes,
    setSelectedNodeId,
  } = useRoadmapStore()

  if (!selectedNodeId) return null

  const node = findNodeById(editorNodes, selectedNodeId)
  if (!node || node.type !== LayoutNodeType.Objective) return null

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
  }

  const getTabButtonStyles = (currentTab: EditorTab) =>  {
    const isActive = currentTab === tab
  
    return {
      borderRadius: '999px',
      px: 1.5,
      py: 0.5,
      fontWeight: 500,
      fontSize: '0.875rem',
      color: isActive ? '#000' : '#666',
      backgroundColor: isActive ? '#d0e8ff' : 'transparent',
      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
      '&:hover': {
        backgroundColor: isActive ? '#d0e8ff' : 'transparent',
      },
    }
  }
  

  return (
    <Box
      sx={{
        width: 350,
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2,
          gap: 1 
        }}
      >
        <Button
          onClick={() => setTab('properties')}
          disableRipple
          sx={getTabButtonStyles('properties')}
        >
          Properties
        </Button>

        <Button
          onClick={() => setTab('content')}
          disableRipple
          sx={getTabButtonStyles('content')}
        >
          Content & Links
        </Button>
      </Box>

      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
        {tab === 'properties' && (
          <>
            <Typography fontWeight="bold" mb={1}>
              Label
            </Typography>

            <TextField
              size="small"
              fullWidth
              value={node.data.title}
              onChange={handleChangeTitle}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {tab === 'content' && (
          <>
            <Typography fontWeight="bold" mb={1}>
              Title
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Enter Title"
              value={node.data.title}
              onChange={handleChangeTitle}
              sx={{ mb: 2 }}
            />

            <Typography fontWeight="bold" mb={1}>
              Description
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={6}
              placeholder="Enter description"
              value={node.data.description || ''}
              onChange={handleChangeDescription}
              sx={{ mb: 2 }}
            />

            <Typography fontWeight="bold" mb={1}>
              Links
            </Typography>
            <Button variant="outlined" fullWidth>
              Add Link
            </Button>
          </>
        )}
      </Box>

      <Button
        onClick={() => setSelectedNodeId(null)}
        fullWidth
        sx={{ borderTop: '1px solid #eee' }}
      >
        Close
      </Button>
    </Box>
  )
}

export default SidebarEditor