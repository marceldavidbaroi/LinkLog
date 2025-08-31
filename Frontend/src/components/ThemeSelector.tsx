import { useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { themes } from "../themes";
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  ListItemText,
  Box,
  Stack,
  Typography,
  ListItemButton,
  Collapse,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ThemeSelectorProps {
  mobile?: boolean;
}

export default function ThemeSelector({ mobile }: ThemeSelectorProps) {
  const { theme, setTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMobile, setOpenMobile] = useState(false); // For collapsible mobile

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (themeName: string) => {
    setTheme(themeName);
    handleClose();
    if (mobile) setOpenMobile(false); // collapse after selection on mobile
  };

  if (mobile) {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        <ListItemButton onClick={() => setOpenMobile(!openMobile)}>
          <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
            <Stack direction="row" spacing={0.5}>
              <Box
                sx={{ width: 14, height: 14, bgcolor: theme.colors.primary }}
              />
              <Box
                sx={{ width: 14, height: 14, bgcolor: theme.colors.secondary }}
              />
              <Box
                sx={{ width: 14, height: 14, bgcolor: theme.colors.accent }}
              />
            </Stack>
            <ListItemText primary={theme.name} />
          </Stack>
          {openMobile ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={openMobile} timeout="auto" unmountOnExit>
          <Stack sx={{ mt: 1, pl: 2 }}>
            {themes.map((t) => (
              <ListItemButton
                key={t.name}
                selected={t.name === theme.name}
                onClick={() => handleSelect(t.name)}
              >
                <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
                  <Box
                    sx={{ width: 14, height: 14, bgcolor: t.colors.primary }}
                  />
                  <Box
                    sx={{ width: 14, height: 14, bgcolor: t.colors.secondary }}
                  />
                  <Box
                    sx={{ width: 14, height: 14, bgcolor: t.colors.accent }}
                  />
                </Stack>
                <ListItemText primary={t.name} />
              </ListItemButton>
            ))}
          </Stack>
        </Collapse>
      </Box>
    );
  }

  // Desktop dropdown
  return (
    <>
      <Tooltip title="Select Theme">
        <IconButton color="inherit" onClick={handleOpen}>
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {themes.map((t) => (
          <MenuItem
            key={t.name}
            selected={t.name === theme.name}
            onClick={() => handleSelect(t.name)}
          >
            <Stack direction="row" spacing={0.5} mr={1} alignItems="center">
              <Box sx={{ width: 14, height: 14, bgcolor: t.colors.primary }} />
              <Box
                sx={{ width: 14, height: 14, bgcolor: t.colors.secondary }}
              />
              <Box sx={{ width: 14, height: 14, bgcolor: t.colors.accent }} />
            </Stack>
            <ListItemText primary={t.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
