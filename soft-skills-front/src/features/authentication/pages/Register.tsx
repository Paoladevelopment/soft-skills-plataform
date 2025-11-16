import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  Grid2,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from "react-hook-form";
import {z} from 'zod'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";

const Register = () => {
  const { t } = useTranslation('auth')
  const theme = useTheme();

  const signUp = useAuthStore(state => state.signUp)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  const successMessage = useAuthStore(state => state.successMessage)
  const clearError = useAuthStore(state => state.clearError)
  const clearSuccessMessage = useAuthStore(state => state.clearSuccessMessage)

  const signUpSchema = z.object({
    name: z.string().nonempty(t('validation.nameRequired')),
    username: z.string().nonempty(t('validation.usernameRequired')),
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(8, t('validation.passwordMinLength')),
    confirm_password: z.string().min(8, t('validation.confirmPasswordRequired'))
  }).refine(
    (data) => data.password === data.confirm_password, {
      message: t('validation.passwordsDoNotMatch'),
      path: ["confirm_password"]
    }
  )

  type sigUpFields = z.infer<typeof signUpSchema>

  const {
    register, 
    handleSubmit,
    formState: {errors},
    reset,
    } = useForm<sigUpFields>({
      resolver: zodResolver(signUpSchema),
    })

  const [openError, setOpenError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)
  const handleCloseSnackbar = () => {
    setOpenError(false)
    clearError()
  }

  const onSubmit: SubmitHandler<sigUpFields> = async (data) => {
    clearError()
    clearSuccessMessage()
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password: _, ...userData } = data

    await signUp(userData)
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: "top", 
          horizontal: "center" 
        }}
      >
        <Alert 
          severity="error" 
          variant="filled" 
          onClose={handleCloseSnackbar}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={clearSuccessMessage}
        anchorOrigin={{ 
          vertical: "top", 
          horizontal: "center" 
        }}
      >
        <Alert 
          severity="success" 
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Container maxWidth="sm">
        <Paper
          elevation={1}
          sx={{
            p: 4,
            backgroundColor: theme.palette.background.default,
            borderRadius: 4,
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight="bold"
          >
            {t('signUp.title')}
          </Typography>

          <Box 
            component="form" 
            sx={{ 
              mt: 3 
            }} 
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <TextField
                  label={t('signUp.name')}
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name")}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  label={t('signUp.username')}
                  fullWidth
                  variant="outlined"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...register("username")}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  label={t('signUp.email')}
                  type="email"
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email")}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  label={t('signUp.password')}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
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
                            aria-label={showPassword ? t('signUp.hidePassword') : t('signUp.showPassword')}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }
                  }
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  label={t('signUp.confirmPassword')}
                  type={showConfirmPassword? "text": "password"}
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  {...register("confirm_password")}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            aria-label={showConfirmPassword ? t('signUp.hidePassword') : t('signUp.showPassword')}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }
                  }
                />
              </Grid2>
            </Grid2>
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
              {t('signUp.submit')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default Register
