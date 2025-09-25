// src/theme.ts
import { createTheme } from "@mui/material/styles";

// Custom MUI theme configuration
const theme = createTheme({
  palette: {
    mode: "light", // Light mode theme
    primary: {
      main: "#4E7D96", // Primary color: cool gray-blue, used for main buttons, links, and accents
    },
    secondary: {
      main: "#FF844B", // Secondary color: soft orange, used for highlights or secondary actions
    },
    background: {
      default: "#E3EDF2", // Page background: very light gray-blue for overall layout
      paper: "#FFFFFF", // Card and paper components background: clean white for contrast
    },
    text: {
      primary: "#0A0D25", // Main text color: very dark blue/black for readability
      secondary: "#4E7D96", // Secondary text color: medium gray-blue for subtle text
    },
  },
  typography: {
    fontFamily: "'Geist Sans', Arial, Helvetica, sans-serif", // Custom font family
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Rounded buttons
          textTransform: "none", // Disable uppercase text transformation
        },
      },
    },
  },
});

export default theme;
