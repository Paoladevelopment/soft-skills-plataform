import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {z} from 'zod'
import { Google } from "@mui/icons-material";
import { AuthProps } from "../types/auth";
import Logo from "../assets/skill-development.png"
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type sigInFields = z.infer<typeof signInSchema>

function Auth({ defaultMode }: AuthProps) {
  const theme = useTheme();
  const isLogin = defaultMode === "login";

  const login = useAuthStore(state => state.login)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)

  const {
    register, 
    handleSubmit,
    formState: {errors},
    reset,
    } = useForm<sigInFields>({
      resolver: zodResolver(signInSchema),
    })

  const [openError, setOpenError] = useState(false)
  const onSubmit: SubmitHandler<sigInFields> = async (data) => {
    await login(data.email, data.password)
    if (useAuthStore.getState().error) {
      return setOpenError(true)
    }

    reset()
  }

  return (
    <>
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setOpenError(false)}>
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          position: "relative"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 6,
            py: 4
          }}
        >
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center" 
            }}>

            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{ height: 50, mr: 1 }}
            />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{
                color: theme.palette.secondary.main,
                letterSpacing: "0.05em"
              }}
            >
              SoftSkills
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="subtitle1" 
              component="span" 
              fontWeight="light"
              sx={{ mr: 3 }}
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <Button 
                variant="contained"
                color="secondary"
                sx={{ py: 0.75, borderRadius: 2 }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </Box>
        </Box>
        <Container maxWidth="xs">
          <Paper
            elevation={1}
            sx={{
              p: 4,
              backgroundColor: theme.palette.background.default,
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold">
              {isLogin ? "Sign In" : "Sign Up"}
            </Typography>

            <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                margin="dense"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
              <Button
                disabled={isLoading}
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              variant="outlined"
              startIcon={<Google />}
              fullWidth
              sx={{
                borderColor: "#D1D1D1",
                color: "#2F3437",
                fontWeight: 500,
                py: 1.2,
                "&:hover": {
                  backgroundColor: "#F7F6F3",
                  borderColor: "#C4C4C4",
                },
              }}
            >
              Continue with Google
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Typography>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Auth;
