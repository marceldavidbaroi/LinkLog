"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, ButtonGroup, Paper, useTheme } from "@mui/material";

type Tab = {
  label: string;
  href: string; // relative to root
};

interface TabChooserProps {
  root: string;
  tabs: Tab[];
}

export default function TabChooser({ root, tabs }: TabChooserProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === `${root}${href}`;

  return (
    <Paper
      elevation={0} // keeps the same MUI shadow
      sx={{
        borderRadius: 2,
        display: "inline-block",
        bgcolor: theme.palette.background.default + "CC", // semi-transparent
      }}
    >
      <ButtonGroup
        variant="contained"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          "& .MuiButton-root": {
            border: "none !important", // remove button separator lines
          },
        }}
      >
        {tabs.map((tab, idx) => {
          const active = isActive(tab.href);
          return (
            <Button
              key={idx}
              onClick={() => router.push(`${root}${tab.href}`)}
              disableRipple
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.2,
                borderRadius: 0,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                // Reverse colors on active
                backgroundColor: active
                  ? theme.palette.primary.main // active background = primary
                  : theme.palette.background.default, // inactive background = default
                color: active
                  ? theme.palette.background.default // active text = background color
                  : theme.palette.text.primary, // inactive text
                boxShadow: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: active
                    ? theme.palette.primary.dark
                    : theme.palette.grey[100],
                },
                "&:first-of-type": {
                  borderRadius: "8px 0 0 8px",
                },
                "&:last-of-type": {
                  borderRadius: "0 8px 8px 0",
                },
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </Paper>
  );
}
