import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardState } from "../types/Dashboard.type";

export const useDashboardStore = create(
  persist<DashboardState>(
    (set) => ({
      overview: null,
      compareMonth: null,
      loading: false,
      error: null,

      setDashboardOverview: (overview) => set({ overview }),
      setCompareMonth: (compareMonth) => set({ compareMonth }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "finance-dashboard-storage", // storage key
    }
  )
);
