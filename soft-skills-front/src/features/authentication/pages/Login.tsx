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
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from "react-hook-form";
import {z} from 'zod'
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";

const Login = () => {
  const { t } = useTranslation('auth')
  const theme = useTheme()

  const login = useAuthStore(state => state.login)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  const clearError = useAuthStore(state => state.clearError)

  const signInSchema = z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(8, t('validation.passwordMinLength')),
  })

  type sigInFields = z.infer<typeof signInSchema>

  const {
    register, 
    handleSubmit,
    formState: {errors},
    reset,
    } = useForm<sigInFields>({
      resolver: zodResolver(signInSchema),
    })

  const [openError, setOpenError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleCloseSnackbar = () => {
    setOpenError(false)
    clearError()
  }

  const onSubmit: SubmitHandler<sigInFields> = async (data) => {
    clearError()
    
    await login(data.email, data.password)

    const { error } = useAuthStore.getState()
    if (error) {
      return setOpenError(true)
    }

    reset()
  }

  return (
    <>
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>

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
            {t('signIn.title')}
          </Typography>

          <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label={t('signIn.email')}
              type="email"
              fullWidth
              variant="outlined"
              margin="dense"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label={t('signIn.password')}
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        aria-label={showPassword ? t('signIn.hidePassword') : t('signIn.showPassword')}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }
              }
            />
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ 
                mt: 2, 
                py: 1.2, 
                borderRadius: 2 
              }}
            >
              {t('signIn.submit')}
            </Button>
          </Box>

          <Divider 
            sx={{ 
              my: 3 
            }}
          >
            {t('signIn.or')}
          </Divider>

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
            {t('signIn.continueWithGoogle')}
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default Login
