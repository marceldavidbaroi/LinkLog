import React, { type ReactNode } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SlidingPanelProps {
  open: boolean;
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  width?: string | number;
  onClose: () => void;
  side?: "left" | "right";
  sx?: object; // allow custom overrides
}

const SlidingPanel = ({
  open,
  title,
  actions,
  children,
  width = "400px",
  side = "right",
  onClose,
  sx = {},
}: SlidingPanelProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: open ? width : 0,
        transition: "width 0.3s ease",
        overflow: "hidden",
        bgcolor: "sidebarBackground", // 👈 light grey + transparency
        borderLeft:
          side === "right" ? `1px solid ${theme.palette.divider}` : "none",
        borderRight:
          side === "left" ? `1px solid ${theme.palette.divider}` : "none",
        display: "flex",
        flexDirection: "column",
        ...sx,
        minHeight: "85vh",
        borderRadius: "8px",
      }}
    >
      {open && (
        <>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {actions}
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>
        </>
      )}
    </Box>
  );
};

export default SlidingPanel;
