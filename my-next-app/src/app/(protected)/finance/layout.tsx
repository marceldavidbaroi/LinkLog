"use client";

import { Box, Skeleton } from "@mui/material";
import TabChooser from "@/components/navigation/TabChooser";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("/dashboard");
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/transaction" },
    { label: "Budget", href: "/budget" },
    { label: "Collection", href: "/collection" },
    { label: "Category", href: "/category" },
  ];

  useEffect(() => {
    // Whenever pathname changes, stop showing skeleton
    setLoading(false);
  }, [pathname]);

  const handleTabClick = (href: string) => {
    if (href === activeTab) return; // no action if same tab
    setActiveTab(href);
    setLoading(true);
    router.push(`/finance${href}`); // client-side navigation
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <TabChooser
          root="/finance"
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          loading={loading}
        />
      </Box>

      {/* Page content */}
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
