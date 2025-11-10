import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Module } from '../types/modules.api'
import { resolveModuleImage } from '../utils/resolveModuleImage'
interface ModuleCardProps {
  module: Module
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const { t } = useTranslation('common')
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleExplore = () => {
    navigate(module.routePath)
  }

  const imageSrc = resolveModuleImage(module.imageUrl)

  return (
    <Card 
      variant='outlined'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: hovered ? "#a9a9a9" : "divider",
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: "none",
        height: '100%',
        minHeight: 360,
        width: '100%',
        cursor: 'default'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardMedia
        component="img"
        height="240"
        image={imageSrc}
        alt={module.title}
        sx={{
          objectFit: 'contain',
        }}
      />

      <CardContent 
        sx={{ 
          flexGrow: 1, 
          pb: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h6" 
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 1.5
          }}
        >
          {module.title}
        </Typography>

        <Typography 
          variant='body2' 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
            maxHeight: '4.5em'
          }}
        >
          {module.description}
        </Typography>
      </CardContent>

      <CardActions 
        sx={{ 
            justifyContent: "center", 
            p: 1, 
        }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleExplore}
          endIcon={<ArrowForwardIcon />}
          sx={{
            fontWeight: 500,
          }}
        >
          {t('actions.explore')}
        </Button>
      </CardActions>
    </Card>
  )
}

export default ModuleCard

