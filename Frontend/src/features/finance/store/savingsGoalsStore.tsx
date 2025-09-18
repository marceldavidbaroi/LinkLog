import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavingsGoalsState } from "../types/SavingsGoals.type";

export const useSavingsGoalsStore = create(
  persist<SavingsGoalsState>(
    (set) => ({
      savingsGoalsList: [],
      savingsGoal: null,
      loading: false,
      error: null,

      setSavingsGoalsList: (savingsGoalsList) => set({ savingsGoalsList }),
      setSavingsGoal: (savingsGoal) => set({ savingsGoal }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "savingsGoals-storage", // storage key
    }
  )
);
