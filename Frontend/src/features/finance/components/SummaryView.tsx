import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface SummaryViewProps {
  income: number;
  expense: number;
  netSavings: number;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  income,
  expense,
  netSavings,
}) => {
  const data = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: expense },
    { name: "Net Savings", amount: netSavings },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#555" />
        <YAxis stroke="#555" />
        <Tooltip />
        <Bar dataKey="amount" fill="#8884d8" radius={[6, 6, 0, 0]} />
      </BarChart>
    </div>
  );
};
