import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import ContactIndex from "./pages/Profile";

export const ContactRoutes: AppRouteObject[] = [
  { path: "/me", element: <ContactIndex />, layout: MainLayout },
];
