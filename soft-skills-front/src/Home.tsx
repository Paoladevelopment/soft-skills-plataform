import { Container, Typography, Button, Paper } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Paper (Card) for a clean UI section */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome to Your Soft Skills App
        </Typography>

        <Typography variant="body1" color="text.secondary">
          A minimalistic platform to help you improve your soft skills through
          practice and reflection.
        </Typography>

        {/* Primary Action Button */}
        <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
          Get started
        </Button>
      </Paper>
    </Container>
  );
};

export default Home;
