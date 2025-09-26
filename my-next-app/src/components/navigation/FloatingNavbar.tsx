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
        sx={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        {/* Left: Company */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon sx={{ color: "#fff" }} />
          <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
            MindVault
          </Typography>
        </Box>

        {/* Center: Navigation */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              gap: 3,
              transform: "translateX(-50%)",
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
        )}

        {/* Right: Clock or Menu */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            pr: 2,
            bottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isMobile ? (
            <ClockDisplay time={time} />
          ) : (
            <IconButton sx={{ color: "#fff" }} onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </Paper>
  );
}
