import { type ReactNode, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  // Update CSS variables for Tailwind
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  // MUI theme
  const muiTheme = createTheme({
    palette: {
      primary: { main: theme.colors.primary },
      secondary: { main: theme.colors.secondary },
      error: { main: theme.colors.error },
      background: {
        default: theme.colors.background,
        paper: theme.colors.surface,
      },
      text: { primary: theme.colors.text },
    },
  });

  return <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>;
}
