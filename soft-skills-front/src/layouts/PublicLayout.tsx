import { Box, Typography, Button, useTheme } from "@mui/material"
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import Logo from "../features/authentication/assets/skill-development.png"

const PublicLayout = () => {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const isLoginPage = location.pathname === "/login"

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
        flexDirection: "column",
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
          py: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" src={Logo} alt="Logo" sx={{ height: 50, mr: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              color: theme.palette.secondary.main,
              letterSpacing: "0.05em",
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
            {isLoginPage ? t('layout.dontHaveAccount') : t('layout.alreadyHaveAccount')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ py: 0.75, borderRadius: 2 }}
            onClick={() => navigate(isLoginPage ? "/register" : "/login")}
          >
            {isLoginPage ? t('layout.signUp') : t('layout.signIn')}
          </Button>
        </Box>
      </Box>
      <Outlet />
      <Typography 
        variant="body2" 
        fontWeight="light" 
        sx={{ mt: 4 }}
      >
        {isLoginPage ? t('layout.dontHaveAccount') : t('layout.alreadyHaveAccount')}
        <Typography
          component="span"
          color="secondary"
          sx={{ 
            cursor: "pointer", 
            ml: 1,
            textDecoration: "none", 
            ":hover": {
              textDecoration: "underline",
            },
            ":active": {
              textDecoration: "underline",
            },
          }}

          onClick={() => navigate(isLoginPage ? "/register" : "/login")}
        >
          {isLoginPage ? t('layout.signUp') : t('layout.signIn')}
        </Typography>
      </Typography>
    </Box>
  )
}

export default PublicLayout
