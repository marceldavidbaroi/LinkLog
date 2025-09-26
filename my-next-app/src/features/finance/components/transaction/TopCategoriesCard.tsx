"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";

type CategoryItem = {
  category: string;
  total: number;
};

type TopCategoriesProps = {
  data?: {
    topExpenses?: CategoryItem[];
    topIncomes?: CategoryItem[];
  } | null;
};

const TopCategoriesCard: React.FC<TopCategoriesProps> = ({ data }) => {
  const theme = useTheme();

  const renderList = (
    title: string,
    items: CategoryItem[] = [],
    color: string
  ) => (
    <Box flex={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color, mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={0.5}>
        {items.length > 0 ? (
          items.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                bgcolor: theme.palette.action.hover,
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{item.category}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color }}>
                {item.total.toLocaleString()} Tk
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data
          </Typography>
        )}
      </Stack>
    </Box>
  );

  return (
    <Card sx={{ p: 1 }}>
      <CardContent sx={{ display: "flex", gap: 2 }}>
        {renderList(
          "Top Expenses",
          data?.topExpenses ?? [],
          theme.palette.error.main
        )}
        <Divider orientation="vertical" flexItem />
        {renderList(
          "Top Incomes",
          data?.topIncomes ?? [],
          theme.palette.success.main
        )}
      </CardContent>
    </Card>
  );
};

export default TopCategoriesCard;
