"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth/store/authStore";
import { useHydrated } from "@/lib/useHydrated";

import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KeyIcon from "@mui/icons-material/Key";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined";
import NightsStayIcon from "@mui/icons-material/NightsStay";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getTimeOfDayIcon = (hour: number) => {
  if (hour >= 5 && hour < 12)
    return <WbTwilightIcon sx={{ animation: "spin 10s linear infinite" }} />;
  if (hour >= 12 && hour < 17)
    return <WbSunnyIcon sx={{ animation: "spin 10s linear infinite" }} />;
  if (hour >= 17 && hour < 20)
    return (
      <WbTwilightOutlinedIcon sx={{ animation: "spin 10s linear infinite" }} />
    );
  return <NightsStayIcon sx={{ animation: "spin 10s linear infinite" }} />;
};

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

  const navLinks = [
    { icon: <DashboardIcon />, text: "Dashboard", href: "/dashboard" },
    { icon: <AccountBalanceWalletIcon />, text: "Finance", href: "/finance" },
    { icon: <KeyIcon />, text: "Vault", href: "/vault" },
    { icon: <AccountCircleIcon />, text: "Profile", href: "/profile" },
  ];

  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const isAM = hours < 12;
  const displayHour = hours % 12 || 12;
  const amPm = isAM ? "AM" : "PM";
  const day = days[time.getDay()];
  const date = time.getDate();
  const month = months[time.getMonth()];
  const timeIcon = getTimeOfDayIcon(hours);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        px: 2,
      }}
    >
      {/* Floating Glass Navbar */}
      <Paper
        elevation={8}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: theme.palette.primary.main + "CC",
          borderRadius: 3,
          px: 2,
          py: 1.5,
          mt: 2,
          width: isMobile ? "calc(100% - 40px)" : "calc(100% - 100px)",
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Left: Company */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon sx={{ color: "#fff" }} />
            <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
              MindVault
            </Typography>
          </Box>

          {/* Center: Navigation Icons */}
          {!isMobile ? (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {navLinks.map((link, idx) => (
                <IconButton
                  key={idx}
                  sx={{
                    color: "#fff",
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                  href={link.href}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          ) : (
            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Right: Clock + Date + Weather (always visible) */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#fff",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              >
                <Typography sx={{ animation: "flip 0.5s ease-in-out" }}>
                  {displayHour}:{minutes}
                </Typography>
                <Typography>{amPm}</Typography>
                <Typography sx={{ fontSize: "1.2rem" }}>{timeIcon}</Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: "auto auto",
                  gridTemplateColumns: "auto auto",
                  justifyItems: "center",
                  alignItems: "center",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  minWidth: 60,
                }}
              >
                <Typography
                  sx={{
                    gridRow: 1,
                    gridColumn: "1 / span 2",
                    fontWeight: "bold",
                  }}
                >
                  {day}
                </Typography>
                <Typography sx={{ gridRow: 2, gridColumn: 1 }}>
                  {date}
                </Typography>
                <Typography sx={{ gridRow: 2, gridColumn: 2 }}>
                  {month}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#fff",
                }}
              >
                <WbSunnyIcon sx={{ animation: "spin 10s linear infinite" }} />
                <Typography>28°C</Typography>
              </Box>
            </Box>
          )}
        </Toolbar>
      </Paper>

      {/* Overlay Drawer for mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: 200,
              mt: "80px",
              backgroundColor: theme.palette.primary.main + "CC",
            },
          }}
        >
          <List>
            {navLinks.map((link, idx) => (
              <ListItem
                button
                key={idx}
                component="a"
                href={link.href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.text} sx={{ color: "#fff" }} />
              </ListItem>
            ))}
          </List>
        </Drawer>
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
