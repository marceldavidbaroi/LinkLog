import type { ReactNode } from "react";
import NavBar from "../components/NavBar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1  bg-gray-50">{children}</main>
    </div>
  );
}
