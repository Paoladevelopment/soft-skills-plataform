import { Box, Typography, Button } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderOpen } from '@mui/icons-material'

interface EmptyStateProps {
  title: string
  description: string
  image?: string
  icon?: ReactNode
  buttonText?: string
  onButtonClick?: () => void
  maxWidth?: string
  minHeight?: string
  fullHeight?: boolean
}

const EmptyState = ({ 
  title, 
  description, 
  image,
  icon,
  buttonText,
  onButtonClick,
  maxWidth = '500px',
  minHeight = '400px',
  fullHeight = false
}: EmptyStateProps) => {
  const { t } = useTranslation('common')
  
  const renderVisual = () => {
    if (image) {
      return (
        <Box
          component="img"
          src={image}
          alt={t('ui.emptyStateIllustration')}
          sx={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            mb: 2
          }}
        />
      )
    }

    return (
      <Box
        sx={{ 
          color: 'text.secondary',
          mb: 2
        }}
      >
        {
            icon || 
            <FolderOpen sx={{ 
                fontSize: '4rem' 
            }} />
        }
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth,
        mx: 'auto',
        px: 2,
        py: fullHeight ? 0 : 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullHeight ? 'calc(100vh - 176px)' : minHeight,
        textAlign: 'center',
        gap: 1,
      }}
    >
      {renderVisual()}

      <Typography 
        variant="h5" 
        component="h2" 
        fontWeight="600"
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
            mb: buttonText ? 3 : 0, 
            lineHeight: 1.6 
        }}
      >
        {description}
      </Typography>

      {buttonText && onButtonClick && (
        <Button 
          variant="contained" 
          color="secondary"
          onClick={onButtonClick}
          sx={{ 
            px: 3,
            py: 1,
            fontWeight: 500
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
