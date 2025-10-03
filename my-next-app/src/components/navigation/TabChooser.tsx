"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Paper,
  ButtonGroup,
  Button,
  useTheme,
  Box,
  Skeleton,
} from "@mui/material";

interface Tab {
  label: string;
  href: string;
}

interface TabChooserProps {
  root: string;
  tabs: Tab[];
  loading?: boolean;
  onTabClick: (href: string) => void; // callback to parent
}

export default function TabChooser({
  root,
  tabs,
  loading = false,
  onTabClick,
}: TabChooserProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  // Set active tab based on pathname
  useEffect(() => {
    const matchingTab = tabs.find((tab) => pathname.includes(tab.href));
    setActiveTab(matchingTab ? matchingTab.href : tabs[0]?.href || "");
  }, [pathname, tabs]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {tabs.map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" width={100} height={40} />
        ))}
      </Box>
    );
  }

  const isActive = (href: string) => activeTab === href;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        display: "inline-block",
        bgcolor: theme.palette.background.default + "CC",
      }}
    >
      <ButtonGroup
        variant="contained"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          "& .MuiButton-root": { border: "none !important" },
        }}
      >
        {tabs.map((tab, idx) => {
          const active = isActive(tab.href);
          return (
            <Button
              key={idx}
              onClick={() => {
                setActiveTab(tab.href); // update local state
                onTabClick(tab.href);
              }}
              disableRipple
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                backgroundColor: active
                  ? theme.palette.primary.main
                  : theme.palette.background.default,
                color: active
                  ? theme.palette.background.default
                  : theme.palette.text.primary,
                boxShadow: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: active
                    ? theme.palette.primary.dark
                    : theme.palette.grey[100],
                },
                "&:first-of-type": { borderRadius: "8px 0 0 8px" },
                "&:last-of-type": { borderRadius: "0 8px 8px 0" },
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
