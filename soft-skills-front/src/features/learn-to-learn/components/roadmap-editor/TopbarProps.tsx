import { Box, Typography } from '@mui/material'

type TopbarProps = {
  title: string
}

const Topbar = ({ title }: TopbarProps) => {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        width: '100%',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#fafafa',
        zIndex: 100,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        {title || 'Untitled Roadmap'}
      </Typography>
    </Box>
  )
}

export default Topbar