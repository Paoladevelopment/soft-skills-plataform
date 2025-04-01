import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F3437",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2383E2",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F9F9F9",
    },
    text: {
      primary: "#2F3437",
      secondary: "#666666",
    },
    divider: "#D1D1D1",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D1D1D1",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2383E2",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2383E2",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#3F6FE8",
          },
        },
      },
    },
  },
  shadows: [
    "none", // 0 - No shadow
    "0px 1px 2px rgba(149, 157, 165, 0.08)",
    "0px 2px 4px rgba(149, 157, 165, 0.1)",
    "0px 3px 6px rgba(149, 157, 165, 0.12)",
    "0px 4px 8px rgba(149, 157, 165, 0.15)",
    "0px 5px 10px rgba(149, 157, 165, 0.16)",
    "0px 6px 12px rgba(149, 157, 165, 0.18)",
    "0px 7px 14px rgba(149, 157, 165, 0.19)",
    "0px 8px 24px rgba(149, 157, 165, 0.2)",
    "0px 9px 28px rgba(149, 157, 165, 0.21)",
    "0px 10px 30px rgba(149, 157, 165, 0.22)",
    "0px 11px 32px rgba(149, 157, 165, 0.23)",
    "0px 12px 36px rgba(149, 157, 165, 0.24)",
    "0px 14px 40px rgba(149, 157, 165, 0.25)",
    "0px 16px 44px rgba(149, 157, 165, 0.26)",
    "0px 18px 48px rgba(149, 157, 165, 0.27)",
    "0px 20px 52px rgba(149, 157, 165, 0.28)",
    "0px 22px 56px rgba(149, 157, 165, 0.29)",
    "0px 24px 60px rgba(149, 157, 165, 0.3)",
    "0px 26px 64px rgba(149, 157, 165, 0.31)",
    "0px 28px 68px rgba(149, 157, 165, 0.32)",
    "0px 30px 72px rgba(149, 157, 165, 0.33)",
    "0px 32px 76px rgba(149, 157, 165, 0.34)",
    "0px 34px 80px rgba(149, 157, 165, 0.35)",
    "0px 36px 90px rgba(149, 157, 165, 0.36)",
  ],
});

export default responsiveFontSizes(theme);
