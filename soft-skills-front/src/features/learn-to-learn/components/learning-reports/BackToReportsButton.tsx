import { Stack, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackToReportsButton = () => {
  const navigate = useNavigate()

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={1}
    >
      <IconButton 
        onClick={() => navigate('/learn/reports')} 
        size="small"
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="body2"
        fontWeight={500}
        color="text.secondary"
      >
        Back to Reports
      </Typography>
    </Stack>
  )
}

export default BackToReportsButton

