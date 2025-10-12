import { Container, Typography, Paper, Grid2, CircularProgress, Box, Alert } from "@mui/material";
import useAuthStore from "./features/authentication/store/useAuthStore";
import { useModules } from "./hooks/useModules";
import ModuleCard from "./components/ModuleCard";

const Home = () => {
  const user = useAuthStore(state => state.user)
  const { data: modulesResponse, isLoading, error } = useModules(0, 10)

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Alert severity="error">
          Failed to load modules. Please try again later.
        </Alert>
      </Container>
    )
  }

  const modules = modulesResponse?.data || []

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3,
          backgroundColor:"#BBDEFB",
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          color="primary" 
          gutterBottom
          fontWeight="bold"
          sx={{
            letterSpacing: "0.05em",
          }}
        >
          Welcome back, {user?.name} 🤗
        </Typography>

        <Typography 
          variant="h6" 
          color="text.primary"
          sx={{
            fontWeight: 300
          }}
        >
          Choose a module below to continue developing your soft skills.
        </Typography>
      </Paper>

      {modules.length === 0 ? (
        <Alert severity="info">
          No modules available at the moment.
        </Alert>
      ) : (
        <Grid2 
          container 
          spacing={3}
        >
          {modules.map((module) => (
            <Grid2 
              size={{ 
                xs: 12, 
                sm: 6, 
                md: 4 
              }} 
              key={module.id}
            >
              <ModuleCard module={module} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default Home;
