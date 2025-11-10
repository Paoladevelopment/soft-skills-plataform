import { Paper, Typography } from '@mui/material'

interface ErrorStateProps {
  error: Error | unknown
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #f44336",
        textAlign: "center",
        borderRadius: 2,
        boxShadow: "none",
        py: 2,
        backgroundColor: "#ffebee",
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" color="error">
        Error loading learning reports
      </Typography>
      <Typography variant="body2" color="error" mt={1}>
        {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
      </Typography>
    </Paper>
  )
}

export default ErrorState

