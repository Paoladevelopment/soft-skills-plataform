import {
  Typography,
  Paper,
  Box,
  Stack,
  TextField,
  Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

const GoalsSection = () => {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          width: '100%',
        }}
      >
        <TextField
          variant="standard"
          placeholder="Add learning goal"
          fullWidth
          sx={{
            paddingLeft: 2,
            py: 1,
          }}
          slotProps={{
            input: {
              disableUnderline: true,
            }
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{
            flexBasis: '20%',
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          Add Goal
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          padding: 4,
          marginTop: 4,
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 'none',
      }}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          No learning goals yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first learning goal to get started on your educational journey
        </Typography>
      </Paper>
    </Box>
  )
}

export default GoalsSection