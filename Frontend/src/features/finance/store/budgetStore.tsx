import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetState } from "../types/Budgets.type";

export const useBudgetStore = create(
  persist<BudgetState>(
    (set) => ({
      budgetList: [],
      budget: null,
      loading: false,
      error: null,

      setBudgetList: (budgetList) => set({ budgetList }),
      setBudget: (budget) => set({ budget }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "budgets-storage", // storage key
    }
  )
);
