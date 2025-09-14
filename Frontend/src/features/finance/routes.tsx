import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import FinanceDashboardIndex from "./pages/DashboardIndex";
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
];
