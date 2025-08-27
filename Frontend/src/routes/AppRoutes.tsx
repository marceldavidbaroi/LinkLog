import { useRoutes } from "react-router-dom";
import { authRoutes } from "../features/auth/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import type { AppRouteObject } from "../types/route.type";

export default function AppRoutes() {
  const allRoutes: AppRouteObject[] = [...authRoutes, ...dashboardRoutes];

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
