import MainLayout from "../../layouts/MainLayout";
import type { AppRouteObject } from "../../types/route.type";
import ContactIndex from "./pages/ContactIndex";

export const ContactRoutes: AppRouteObject[] = [
  { path: "/contact", element: <ContactIndex />, layout: MainLayout },
];
