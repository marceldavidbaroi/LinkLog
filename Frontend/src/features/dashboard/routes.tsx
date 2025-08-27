import AuthLayout from "../../layouts/AuthLayout";
import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import DashboardIndex from "./pages/DashboardIndex";

export const dashboardRoutes: AppRouteObject[] = [
  { path: "/dashboard", element: <DashboardIndex />, layout: MainLayout },
  //   { path: "/logout", element: <LoginPage /> },
  //   { path: "/signup", element: <SignupPage /> },
];
