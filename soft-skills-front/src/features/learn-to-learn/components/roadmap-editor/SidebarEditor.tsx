import {
  Box,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { EditorTab } from '../../types/roadmap/roadmap.options'
import PropertiesTab from './PropertiesTab'
import ContentAndLinksTab from './ContentLinksTab'

const SidebarEditor = () => {
  const { t } = useTranslation('roadmap')
  const [tab, setTab] = useState<EditorTab>('properties')

  const {
    selectedNodeId,
  } = useRoadmapStore()

  useEffect(() => {
    if (selectedNodeId) {
      setTab('properties')
    }
  }, [selectedNodeId])

  if (!selectedNodeId) return null

  const getTabButtonStyles = (currentTab: EditorTab) => {
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

  const isPropertiesTab = () => tab === 'properties'
  const isContentTab = () => tab === 'content'

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
          {t('editor.sidebarEditor.properties')}
        </Button>

        <Button
          onClick={() => setTab('content')}
          disableRipple
          sx={getTabButtonStyles('content')}
        >
          {t('editor.sidebarEditor.contentLinks')}
        </Button>
      </Box>

      <Box 
        sx={{ 
          p: 2, 
          overflowY: 'auto', 
          flex: 1 
        }}
      >
        {
          isPropertiesTab() && <PropertiesTab />
        }

        {
          isContentTab() && <ContentAndLinksTab />
        }
      </Box>
    </Box>
  )
}

export default SidebarEditor