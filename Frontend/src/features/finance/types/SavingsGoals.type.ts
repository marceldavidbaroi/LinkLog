import { type Transaction } from "./Transaction.type";
export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: string;
  saved_amount: string | null;
  priority: Priority;
  transactions: Partial<Transaction>[] | null;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface FindSavingsGoalsParams {
  name?: string;
  priority?: Priority;
  month?: number; // 1–12
  year?: number; // YYYY
  page?: number; // default 1
  limit?: number; // default 25
}

export interface SavingsGoalsState {
  savingsGoalsList: SavingsGoal[];
  savingsGoal: SavingsGoal | null;
  loading: boolean;
  error: string | null;

  setSavingsGoalsList: (list: SavingsGoal[]) => void;
  setSavingsGoal: (budget: SavingsGoal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
