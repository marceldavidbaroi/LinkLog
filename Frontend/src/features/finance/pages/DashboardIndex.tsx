import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useDashboard } from "../hooks/dashboardAuth";
import { useDashboardStore } from "../store/dashboardStore";

import { KpiCards } from "../components/KpiCards";
import { ViewSelector } from "../components/ViewSelector";
import { SummaryView } from "../components/SummaryView";
import { CategorySummaryView } from "../components/CategorySummaryView";
import { FullCategoriesView } from "../components/FullCategoriesView";
import MonthlyComparison from "../components/MonthlyComparison";
import { useBudgets } from "../hooks/budgetAuth";
import BudgetAlerts from "../components/BudgetAlerts";

type ViewType = "summary" | "category" | "full";

const FinanceDashboardIndex = () => {
  const { overview, comparison } = useDashboard();
  const { getAlerts } = useBudgets();
  const dashboardStore = useDashboardStore();
  const [view, setView] = useState<ViewType>("summary");
  const [alerts, setAlerts] = useState<any[]>([]);

  const getOverview = async () => {
    const now = new Date();
    const startDate = format(startOfMonth(now), "yyyy-MM-dd");
    const endDate = format(endOfMonth(now), "yyyy-MM-dd");
    await overview({ startDate, endDate });
  };

  const getcomparison = async () => {
    const now = new Date();
    const startDate = format(startOfMonth(now), "yyyy-MM-dd");
    await comparison({ startDate });
  };

  const fetchAlerts = async () => {
    const query = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
    const alert = await getAlerts(query);
    setAlerts(alert.data ?? []);
  };
  useEffect(() => {
    getOverview();
    getcomparison();
    fetchAlerts();
  }, []);

  const data = dashboardStore.overview;
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
      {alerts.length > 0 && <BudgetAlerts alerts={alerts} />}
      <MonthlyComparison data={dashboardStore.compareMonth ?? null} />
      <ViewSelector view={view} setView={setView} />
      {renderView()}
    </div>
  );
};

export default FinanceDashboardIndex;
