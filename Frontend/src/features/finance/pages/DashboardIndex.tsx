import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useTransactions } from "../hooks/transactionsAuth";
import { useTransactionsStore } from "../store/transactionsStore";

import { KpiCards } from "../components/KpiCards";
import { ViewSelector } from "../components/ViewSelector";
import { SummaryView } from "../components/SummaryView";
import { CategorySummaryView } from "../components/CategorySummaryView";
import { FullCategoriesView } from "../components/FullCategoriesView";

type ViewType = "summary" | "category" | "full";

const FinanceDashboardIndex = () => {
  const { summary } = useTransactions();
  const transactionStore = useTransactionsStore();
  const [view, setView] = useState<ViewType>("summary");

  const getSummary = async () => {
    const now = new Date();
    const startDate = format(startOfMonth(now), "yyyy-MM-dd");
    const endDate = format(endOfMonth(now), "yyyy-MM-dd");
    await summary({ startDate, endDate });
  };

  useEffect(() => {
    getSummary();
  }, []);

  const data = transactionStore.summary;
  if (!data)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  const { income, expense, total } = data;
  const netSavings = total.income - total.expense;

  const kpis = [
    { title: "Income", value: total.income, color: "#A3D5FF" },
    { title: "Expenses", value: total.expense, color: "#FFB8B8" },
    { title: "Net Savings", value: netSavings, color: "#B8F1D4" },
  ];

  const renderView = () => {
    switch (view) {
      case "summary":
        return (
          <SummaryView
            income={total.income}
            expense={total.expense}
            netSavings={netSavings}
          />
        );
      case "category":
        return <CategorySummaryView income={income} expense={expense} />;
      case "full":
        return <FullCategoriesView income={income} expense={expense} />;
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Finance Dashboard
      </h1>
      <KpiCards kpis={kpis} />
      <ViewSelector view={view} setView={setView} />
      {renderView()}
    </div>
  );
};

export default FinanceDashboardIndex;
