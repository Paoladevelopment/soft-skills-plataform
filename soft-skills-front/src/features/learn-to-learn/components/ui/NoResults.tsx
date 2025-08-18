import { Box, Typography, Button } from '@mui/material'
import { ReactNode } from 'react'
import { SearchOff } from '@mui/icons-material'

interface NoResultsProps {
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void
  icon?: ReactNode
}

const NoResults = ({ 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  icon
}: NoResultsProps) => {
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Box
        sx={{ 
          color: 'text.secondary',
        }}
      >
        {icon || <SearchOff sx={{ fontSize: '4rem' }} />}
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Button 
        variant="contained" 
        color="secondary"
        onClick={onButtonClick}
        sx={{ px: 3 }}
      >
        {buttonText}
      </Button>
    </Box>
  )
}

export default NoResults