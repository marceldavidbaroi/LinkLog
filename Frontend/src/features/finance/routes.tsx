import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import BudgetsIndex from "./pages/BudgetIndex";
import FinanceDashboardIndex from "./pages/DashboardIndex";
import SavingsGoalsIndex from "./pages/SavingsGoalsIndex";
import TransactionsIndex from "./pages/TransactionIndex";

export const FinanceRoutes: AppRouteObject[] = [
  {
    path: "/finance/dashboard",
    element: <FinanceDashboardIndex />,
    layout: MainLayout,
  },
  {
    path: "/finance/transactions",
    element: <TransactionsIndex />,
    layout: MainLayout,
  },
  {
    path: "/finance/budgets",
    element: <BudgetsIndex />,
    layout: MainLayout,
  },
  {
    path: "/finance/savings-goals",
    element: <SavingsGoalsIndex />,
    layout: MainLayout,
  },
];
