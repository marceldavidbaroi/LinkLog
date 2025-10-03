import { User } from "@/features/auth/types/auth";

export enum CategoryType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface Category {
  id: number;
  user?: User | null;
  name: string;
  displayName: string;
  type: CategoryType;
  createdAt: Date;
}

export interface FilterCategoriesParams {
  /** Ownership filter: system or user */
  ownership?: "system" | "user";

  /** Category type filter: income or expense */
  categoryType?: "income" | "expense";
}

export interface CategoryStatsDetail {
  total: number;
  system: number;
  user: number;
}

export interface CategoryStats {
  total: number;
  income: CategoryStatsDetail;
  expense: CategoryStatsDetail;
}

export interface CategoryState {
  allCategoryList: Category[] | [];
  incomeCategoryList: Category[] | [];
  expenseCategoryList: Category[] | [];
  category: Category | null;
  categoryStatus: CategoryStats | null;
  loading: boolean;
  error: string | null;

  setCategoryList: (list: Category[]) => void;
  setIncomeCategoryList: (list: Category[]) => void;
  setExpenseCategoryList: (list: Category[]) => void;
  setCategory: (category: Category | null) => void;
  setCategoryStatus: (categoryStatus: CategoryStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
