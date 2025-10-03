"use client";

import { Box } from "@mui/material";
import CategoryTable from "@/features/finance/components/category/CategoryTable";
import StatusCard from "@/features/finance/components/category/StatusCard";
import ScrollContainer from "@/components/ScrollContainer";

const CategoryIndex = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        height: { xs: "auto", md: "calc(100vh - 260px)" },
      }}
    >
      {/* Left small column */}
      <Box
        sx={{
          width: { xs: "100%", md: 250 },
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
          flexShrink: 0,
          borderColor: "primary.main",
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)", // subtle shadow
        }}
      >
        <StatusCard />
      </Box>

      {/* Right big column */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "background.default",
          borderRadius: 2,
          p: 2,
          overflowY: { xs: "visible", md: "auto" },
          height: { xs: "auto", md: "100%" },
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)", // subtle shadow
        }}
      >
        <ScrollContainer
          sx={{
            height: { xs: "auto", md: "100%" },
          }}
        >
          <CategoryTable />
        </ScrollContainer>
      </Box>
    </Box>
  );
};

export default CategoryIndex;
