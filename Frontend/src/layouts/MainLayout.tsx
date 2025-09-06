import type { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";
import NavBar from "../components/NavBar";
import GlobalSnackbar from "../components/GlobalSnackbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Fixed NavBar */}
      <Box position="fixed" top={0} left={0} right={0} zIndex={50}>
        <NavBar />
      </Box>

      <GlobalSnackbar />

      {/* Main content */}
      <Box
        component="main"
        flex={1}
        pt="64px" // padding-top equal to NavBar height
        bgcolor={theme.palette.background.paper} // dynamic theme background
        minHeight={`calc(100vh - 64px)`} // ensures it covers full viewport minus NavBar
      >
        {children}
      </Box>
    </Box>
  );
}
