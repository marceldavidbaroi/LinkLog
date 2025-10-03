"use client";

import { useEffect } from "react";
import { Card, Typography, Box } from "@mui/material";
import { AttachMoney, TrendingUp, TrendingDown } from "@mui/icons-material";
import { useCategory } from "@/features/finance/hooks/categoryAuth";
import { useCategoryStore } from "@/features/finance/store/categoryStore";

export default function CategoryStatsCards() {
  const categoryStore = useCategoryStore();
  const { getStats } = useCategory();

  const fetchCategoryStats = async () => {
    const response = await getStats();
    categoryStore.setCategoryStatus(response);
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const stats = categoryStore.categoryStatus;

  const cardData = [
    {
      title: "Total",
      value: stats?.total ?? 0,
      icon: <AttachMoney fontSize="small" />,
    },
    {
      title: "Income",
      value: stats?.income.total ?? 0,
      details: stats?.income
        ? [
            { label: "S", val: stats.income.system },
            { label: "U", val: stats.income.user },
          ]
        : [],
      icon: <TrendingUp fontSize="small" />,
    },
    {
      title: "Expense",
      value: stats?.expense.total ?? 0,
      details: stats?.expense
        ? [
            { label: "S", val: stats.expense.system },
            { label: "U", val: stats.expense.user },
          ]
        : [],
      icon: <TrendingDown fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // distribute evenly
        height: "100%", // take full height of parent (250px column)
        gap: 1.5, // spacing between cards
      }}
    >
      {cardData.map((item, idx) => (
        <Card
          key={idx}
          sx={{
            flexGrow: 1, // make cards expand equally
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            minHeight: { xs: 100, md: 0 }, // a bit taller on mobile
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
          >
            {item.icon}
            <Typography variant="subtitle2" fontWeight="bold">
              {item.title}
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold">
            {item.value}
          </Typography>

          {item.details && (
            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
              {item.details.map((d, i) => (
                <Typography key={i} variant="caption" sx={{ opacity: 0.9 }}>
                  {d.label}:{d.val}
                </Typography>
              ))}
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
}
