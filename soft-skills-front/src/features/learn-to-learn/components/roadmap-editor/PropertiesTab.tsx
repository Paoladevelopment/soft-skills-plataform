import {
  Box,
  TextField,
  Typography,
  Grid2,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { findNodeById, getNodeTitle } from '../../utils/roadmap/roadmapGraphHelpers'
import { colorOptions, FontSizeOption, fontSizeOptions } from '../../types/roadmap/roadmap.options'

const PropertiesTab = () => {
  const { t } = useTranslation('roadmap')
  const {
    selectedNodeId,
    editorNodes,
    updateEditorNode,
  } = useRoadmapStore()

  const node = selectedNodeId ? findNodeById(editorNodes, selectedNodeId) : null
  if (!node) return null

  const { x, y } = node.position

  const title = getNodeTitle(node) ?? ''
  const fontSize = node.data.fontSize ?? 'L'
  const backgroundColor = node.data.backgroundColor ?? '#FFFFFF'
  const width = node.data.width ?? node.width ?? 0
  const height = node.data.height ?? node.height ?? 0

  const updateNodeData = (updates: Partial<typeof node.data>) => {
    updateEditorNode({
      ...node,
      data: {
        ...node.data,
        ...updates,
      },
    })
  }

  const updateNodePosition = (newX?: number, newY?: number) => {
    updateEditorNode({
      ...node,
      position: {
        x: newX ?? node.position.x,
        y: newY ?? node.position.y,
      },
    })
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    updateNodeData({ title: newTitle })
  }
  
  const handleChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = Number(e.target.value)
    updateNodePosition(newX, undefined)
  }
  
  const handleChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = Number(e.target.value)
    updateNodePosition(undefined, newY)
  }
  
  const handleChangeWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = Number(e.target.value)
    updateNodeData({ width })
  }
  
  const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = e.target.value
    const numericHeight = height === '' ? undefined : Number(height)
    updateNodeData({ height: numericHeight })
  }
  
  const handleChangeFontSize = (_: unknown, newFontSize: FontSizeOption | null) => {
    if (newFontSize !== null) {
      updateNodeData({ fontSize: newFontSize })
    }
  }
  
  const handleChangeColor = (color: string) => {
    updateNodeData({ backgroundColor: color })
  }  

  return (
    <Box>
      <Typography fontWeight="bold" mb={1}>
        {t('editor.propertiesTab.label')}
      </Typography>
      <TextField
        size="small"
        fullWidth
        value={title}
        onChange={handleChangeTitle}
        sx={{ 
          mb: 4
        }}
        placeholder={t('editor.propertiesTab.labelPlaceholder')}
      />

      <Grid2 container spacing={1} sx={{ mb: 2 }}>
        <Grid2 size={{xs: 6}}> 
          <TextField
            label={t('editor.propertiesTab.x')}
            size="small"
            fullWidth
            type="number"
            value={x}
            onChange={handleChangeX}
          />
        </Grid2>
        <Grid2 size={{xs: 6}}>
          <TextField
            label={t('editor.propertiesTab.y')}
            size="small"
            fullWidth
            type="number"
            value={y}
            onChange={handleChangeY}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={1} sx={{ mb: 2 }}>
        <Grid2 size={{xs: 6}}>
          <TextField
            label={t('editor.propertiesTab.w')}
            size="small"
            fullWidth
            type="number"
            value={width}
            onChange={handleChangeWidth}
            placeholder={t('editor.propertiesTab.auto')}
          />
        </Grid2>
        <Grid2 size={{xs: 6}}>
          <TextField
            label={t('editor.propertiesTab.h')}
            size="small"
            fullWidth
            type="number"
            value={height}
            onChange={handleChangeHeight}
            placeholder={t('editor.propertiesTab.auto')}
          />
        </Grid2>
      </Grid2>

      <Divider sx={{ my: 2 }} />

      <Typography fontWeight="bold" mb={1}>
        {t('editor.propertiesTab.fontSize')}
      </Typography>
      <ToggleButtonGroup
        value={fontSize}
        exclusive
        size="small"
        onChange={handleChangeFontSize}
        sx={{ mb: 2 }}
      >
        {fontSizeOptions.map((size) => (
          <ToggleButton key={size} value={size}>
            {size}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography fontWeight="bold" mb={1}>
        {t('editor.propertiesTab.nodeColor')}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {colorOptions.map((color) => (
          <Box
            key={color}
            onClick={() => handleChangeColor(color)}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: color,
              border: color === backgroundColor ? '2px solid black' : '1px solid #ccc',
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PropertiesTab