import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import InteractionIndex from "./pages/InteractionIndex";
import AddInteractionIndex from "./pages/AddInteractionIndex";

export const interactionRoutes: AppRouteObject[] = [
  {
    path: "/interactions",
    element: <InteractionIndex />,
    layout: MainLayout,
  },
  {
    path: "/interactions/create",
    element: <AddInteractionIndex />,
    layout: MainLayout,
  },
  //   { path: "/logout", element: <LoginPage /> },
  //   { path: "/signup", element: <SignupPage /> },
];
