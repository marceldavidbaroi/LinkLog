"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth/store/authStore";
import { useHydrated } from "@/lib/useHydrated";
import { useTheme, useMediaQuery, Box } from "@mui/material";

import FloatingNavbar from "@/components/navigation/FloatingNavbar";
import MobileDrawer from "@/components/navigation/MobileDrawer";

const navLinks = [
  { iconName: "Dashboard", text: "Dashboard", href: "/dashboard" },
  { iconName: "Finance", text: "Finance", href: "/finance" },
  { iconName: "Vault", text: "Vault", href: "/vault" },
  { iconName: "Profile", text: "Profile", href: "/profile" },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const token = useAuthStore((s) => s.token);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (hydrated && !token) router.replace("/auth/sign-in");
  }, [hydrated, token, router]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !token) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        px: 2,
      }}
    >
      {/* Floating Navbar */}
      <FloatingNavbar
        navLinks={navLinks}
        isMobile={isMobile}
        time={time}
        onMenuClick={() => setDrawerOpen(true)}
      />

      {/* Mobile Drawer with Clock + Weather */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navLinks={navLinks}
          time={time} // <-- Pass current time here
        />
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: { xs: "90px", md: "120px" } }}
      >
        {children}
      </Box>

      {/* Animations */}
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes flip {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>
    </Box>
  );
}
