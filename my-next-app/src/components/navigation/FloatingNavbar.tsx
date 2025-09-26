import {
  Paper,
  Toolbar,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import NavLinkButton from "./NavLinkButton";
import ClockDisplay from "./ClockDisplay";

interface NavLink {
  iconName: string;
  text: string;
  href: string;
}

interface FloatingNavbarProps {
  navLinks: NavLink[];
  isMobile: boolean;
  time: Date;
  onMenuClick: () => void;
}

export default function FloatingNavbar({
  navLinks,
  isMobile,
  time,
  onMenuClick,
}: FloatingNavbarProps) {
  const theme = useTheme();

  return (
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

        {/* Center: Navigation */}
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
              <NavLinkButton
                key={idx}
                iconName={link.iconName}
                href={link.href}
              />
            ))}
          </Box>
        ) : (
          <IconButton sx={{ color: "#fff" }} onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Right: Clock */}
        {!isMobile && <ClockDisplay time={time} />}
      </Toolbar>
    </Paper>
  );
}
