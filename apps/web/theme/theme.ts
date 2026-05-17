import { createTheme, ThemeOptions } from "@mui/material/styles";

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#005cbb",
      light: "#4285f4",
      dark: "#003d7a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e91e63",
      light: "#ff6090",
      dark: "#b0003a",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#202124",
      secondary: "#5f6368",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#42a5f5",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: lightThemeOptions.typography,
  shape: lightThemeOptions.shape,
  components: lightThemeOptions.components,
};

export const getTheme = (mode: "light" | "dark") => {
  return createTheme(mode === "light" ? lightThemeOptions : darkThemeOptions);
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
