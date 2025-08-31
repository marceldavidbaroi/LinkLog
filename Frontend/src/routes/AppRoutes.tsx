import { useRoutes } from "react-router-dom";
import type { AppRouteObject } from "../types/route.type";
import { authRoutes } from "../features/auth/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import { interactionRoutes } from "../features/interaction/routes";
import { ContactRoutes } from "../features/contact/routes";

export default function AppRoutes() {
  const allRoutes: AppRouteObject[] = [
    ...authRoutes,
    ...dashboardRoutes,
    ...interactionRoutes,
    ...ContactRoutes,
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
