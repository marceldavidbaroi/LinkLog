import React from "react";
import { Box, Typography, useTheme, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CategoryData = {
  category: string;
  value: number;
};

type CategoryChartProps = {
  data?: {
    expenses?: CategoryData[];
    incomes?: CategoryData[];
  } | null;
};

const CategoryOverviewChart: React.FC<CategoryChartProps> = ({ data }) => {
  const theme = useTheme();

  // Prepare chart data: merge categories
  const allCategories = Array.from(
    new Set([
      ...(data?.expenses?.map((e) => e.category) ?? []),
      ...(data?.incomes?.map((i) => i.category) ?? []),
    ])
  );

  const chartData = allCategories.map((category) => ({
    category: category.replace("_", " "),
    expense: data?.expenses?.find((e) => e.category === category)?.value ?? 0,
    income: data?.incomes?.find((i) => i.category === category)?.value ?? 0,
  }));

  if (!chartData.length) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expenses & Incomes by Category
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="expense"
              fill={theme.palette.error.main}
              name="Expense"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="income"
              fill={theme.palette.success.main}
              name="Income"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryOverviewChart;
