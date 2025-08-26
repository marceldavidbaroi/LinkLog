// features/auth/routes.tsx
import type { RouteObject } from "react-router-dom";
import LoginPage from "./pages/LoginIndex";
// import SignupPage from "./pages/SignupPage";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
  //   { path: "/logout", element: <LoginPage /> },
  //   { path: "/signup", element: <SignupPage /> },
];
