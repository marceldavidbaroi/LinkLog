"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth/store/authStore";
import { useHydrated } from "@/lib/useHydrated";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const token = useAuthStore((s) => s.token); // ✅ access just token

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/auth/sign-in");
    }
  }, [hydrated, token, router]);

  if (!hydrated) return null; // or loader

  if (!token) return null; // wait for redirect, no flashing

  return <div className="flex min-h-screen">{children}</div>;
}
