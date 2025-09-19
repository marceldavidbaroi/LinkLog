import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReportsState } from "../types/Reports.type"; // make sure this points to your ReportsState interface

export const useReportStore = create(
  persist<ReportsState>(
    (set) => ({
      reportsList: [],
      report: null,
      loading: false,
      error: null,

      setReportsList: (reportsList) => set({ reportsList }),
      setReport: (report) => set({ report }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "reports-storage", // storage key
    }
  )
);
