import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import TransactionsIndex from "./pages/TransactionIndex";

export const FinanceRoutes: AppRouteObject[] = [
  {
    path: "/finance/transactions",
    element: <TransactionsIndex />,
    layout: MainLayout,
  },
];
