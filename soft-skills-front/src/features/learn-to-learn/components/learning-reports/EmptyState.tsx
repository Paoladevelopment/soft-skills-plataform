import { Paper, Typography } from '@mui/material'

const EmptyState = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        textAlign: "center",
        borderRadius: 2,
        boxShadow: "none",
        py: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium">
        No learning reports yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Complete tasks and reflect on them to see your learning reports here
      </Typography>
    </Paper>
  )
}

export default EmptyState

