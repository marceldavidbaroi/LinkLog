import { useRoutes } from "react-router-dom";
import type { AppRouteObject } from "../types/route.type";
import { authRoutes } from "../features/auth/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import { MeRoutes } from "../features/me/routes";
import { FinanceRoutes } from "../features/finance/routes";

export default function AppRoutes() {
  const allRoutes: AppRouteObject[] = [
    ...authRoutes,
    ...dashboardRoutes,
    ...MeRoutes,
    ...FinanceRoutes,
  ];

  const element = useRoutes(
    allRoutes.map((route) => {
      const Layout = route.layout ?? (({ children }: any) => <>{children}</>);
      return {
        path: route.path,
        element: <Layout>{route.element}</Layout>,
      };
    })
  );

  return element;
}
