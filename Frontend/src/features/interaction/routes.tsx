import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import InteractionIndex from "./pages/InteractionIndex";

export const interactionRoutes: AppRouteObject[] = [
  {
    path: "/interaction",
    element: <InteractionIndex />,
    layout: MainLayout,
  },
  //   { path: "/logout", element: <LoginPage /> },
  //   { path: "/signup", element: <SignupPage /> },
];
