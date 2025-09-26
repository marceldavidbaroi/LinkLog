// components/ui/ScrollContainer.tsx
"use client";

import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  overflowY: "auto",
  scrollbarWidth: "thin", // Firefox
  scrollbarColor: `${theme.palette.primary.main} transparent`,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    border: "2px solid transparent",
    backgroundClip: "content-box",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function ScrollContainer({ children, ...props }: BoxProps) {
  return <StyledBox {...props}>{children}</StyledBox>;
}
