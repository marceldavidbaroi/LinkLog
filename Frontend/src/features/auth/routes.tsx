// features/auth/routes.tsx
import LoginPage from "./pages/LoginIndex";
import AuthLayout from "../../layouts/AuthLayout";
import type { AppRouteObject } from "../../types/route.type";
import SignupPage from "./pages/SignupPage";
import LogoutIndex from "./pages/LogoutIndex";

export const authRoutes: AppRouteObject[] = [
  { path: "/auth/login", element: <LoginPage />, layout: AuthLayout },
  //   { path: "/logout", element: <LoginPage /> },
  { path: "/auth/signup", element: <SignupPage />, layout: AuthLayout },
  { path: "/logout", element: <LogoutIndex />, layout: AuthLayout },
];
