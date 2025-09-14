import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface FullCategoriesViewProps {
  income: { category: string; total: number }[];
  expense: { category: string; total: number }[];
}

export const FullCategoriesView: React.FC<FullCategoriesViewProps> = ({
  income,
  expense,
}) => {
  return (
    <div style={{ overflowX: "auto", paddingBottom: "2rem" }}>
      <h4>All Income Categories</h4>
      <BarChart
        width={Math.max(income.length * 60, 600)}
        height={250}
        data={income.map((i) => ({ name: i.category, amount: i.total }))}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" />
        <YAxis stroke="#555" />
        <Tooltip />
        <Bar dataKey="amount" fill="#A3D5FF" radius={[4, 4, 0, 0]} />
      </BarChart>

      <h4 style={{ marginTop: "1.5rem" }}>All Expense Categories</h4>
      <BarChart
        width={Math.max(expense.length * 60, 600)}
        height={250}
        data={expense.map((e) => ({ name: e.category, amount: e.total }))}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" />
        <YAxis stroke="#555" />
        <Tooltip />
        <Bar dataKey="amount" fill="#FFB8B8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </div>
  );
};
