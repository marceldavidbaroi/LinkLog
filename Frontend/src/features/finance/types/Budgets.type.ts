import { type ExpenseCategory } from "./Transaction.type";

export interface Budget {
  id: number;
  category: ExpenseCategory;
  amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

// Query params type for GET /budgets
export interface FindBudgetsParams {
  category?: string; // ExpenseCategory enum (string-based)
  month?: number; // 1–12
  year?: number; // YYYY
  page?: number; // default 1
  limit?: number; // default 25
}

// Query params type for GET /budgets/alerts
export interface BudgetAlertsParams {
  threshold?: number; // default 0.9 (90%)
  month?: number; // 1–12
  year?: number; // YYYY
}

export interface BudgetState {
  budgetList: Budget[];
  budget: Budget | null;
  loading: boolean;
  error: string | null;

  setBudgetList: (list: Budget[]) => void;
  setBudget: (budget: Budget | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
