import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import ProfileIndex from "./pages/ProfileIndex";

export const MeRoutes: AppRouteObject[] = [
  { path: "/me", element: <ProfileIndex />, layout: MainLayout },
];
