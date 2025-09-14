import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = [
  "#A3D5FF",
  "#B8F1D4",
  "#FFD8B8",
  "#FFB8B8",
  "#D4A3FF",
  "#FFE5A3",
  "#FFC2E2",
  "#A3FFD5",
  "#FFDAA3",
];

interface CategorySummaryViewProps {
  income: { category: string; total: number }[];
  expense: { category: string; total: number }[];
}

export const CategorySummaryView: React.FC<CategorySummaryViewProps> = ({
  income,
  expense,
}) => {
  const preparePieData = (
    categories: { name: string; value: number }[],
    topN = 6
  ) => {
    const sorted = [...categories].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const otherTotal = sorted.slice(topN).reduce((sum, c) => sum + c.value, 0);
    if (otherTotal > 0) top.push({ name: "Other", value: otherTotal });
    return top;
  };

  const incomePieData = preparePieData(
    income.map((i) => ({ name: i.category, value: i.total }))
  );
  const expensePieData = preparePieData(
    expense.map((e) => ({ name: e.category, value: e.total }))
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        flexWrap: "wrap",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div style={{ minWidth: "300px", textAlign: "center" }}>
        <h4>Top Income Categories</h4>
        <PieChart width={300} height={300}>
          <Pie
            data={incomePieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {incomePieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>

      <div style={{ minWidth: "300px", textAlign: "center" }}>
        <h4>Top Expense Categories</h4>
        <PieChart width={300} height={300}>
          <Pie
            data={expensePieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {expensePieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};
