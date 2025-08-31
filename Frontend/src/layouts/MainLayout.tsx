import type { ReactNode } from "react";
import NavBar from "../components/NavBar";
import GlobalSnackbar from "../components/GlobalSnackbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <GlobalSnackbar />

      {/* Main content with top padding equal to NavBar height */}
      <main className="flex-1 bg-gray-50 pt-[64px]">{children}</main>
    </div>
  );
}
