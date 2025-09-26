"use client";

import { Box, Container } from "@mui/material";
import TabChooser from "@/components/navigation/TabChooser";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 3 }}>
      {/* Tab Chooser */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TabChooser
          root="/finance"
          tabs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Transactions", href: "/transaction" },
            { label: "Budget", href: "/budget" },
            { label: "Collection", href: "/collection" },
          ]}
        />
      </Box>

      {/* Page content */}
      <Box sx={{ mt: 3 }}>{children}</Box>
    </Box>
  );
}
