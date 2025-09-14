export interface Transaction {
  id: number;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory | null;
  amount: number | null;
  date: string | null;
  description?: string;
  recurring?: boolean;
  recurring_interval?: RecurringInterval | null;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "income" | "expense";

export type IncomeCategory =
  | "salary"
  | "freelance"
  | "business"
  | "investment"
  | "rental_income"
  | "gift"
  | "refund"
  | "other_income";

export type ExpenseCategory =
  | "food_groceries"
  | "food_dining"
  | "housing_rent"
  | "housing_mortgage"
  | "utilities"
  | "transportation"
  | "health_medical"
  | "education"
  | "entertainment"
  | "shopping"
  | "travel"
  | "personal_care"
  | "insurance"
  | "debt_repayment"
  | "savings_investments"
  | "charity_donation"
  | "other_expense";

export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly";
export const transactionTypes: TransactionType[] = ["income", "expense"];

export const incomeCategoriesList: IncomeCategory[] = [
  "salary",
  "freelance",
  "business",
  "investment",
  "rental_income",
  "gift",
  "refund",
  "other_income",
];

export const expenseCategoriesList: ExpenseCategory[] = [
  "food_groceries",
  "food_dining",
  "housing_rent",
  "housing_mortgage",
  "utilities",
  "transportation",
  "health_medical",
  "education",
  "entertainment",
  "shopping",
  "travel",
  "personal_care",
  "insurance",
  "debt_repayment",
  "savings_investments",
  "charity_donation",
  "other_expense",
];

export const recurringIntervals: RecurringInterval[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

export interface TransactionSummary {
  income: {
    category: string;
    total: number;
  }[];
  expense: {
    category: string;
    total: number;
  }[];
  total: {
    income: number;
    expense: number;
  };
}

export interface FindTransactionsParams {
  type?: TransactionType;
  category?: IncomeCategory | ExpenseCategory;
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  page?: number;
  limit?: number;
}

export interface TransactionsState {
  transactionList: Transaction[] | [];
  transaction: Transaction | null;
  summary: TransactionSummary | null;
  loading: boolean;
  error: string | null;

  setTransactionList: (list: Transaction[]) => void;
  setTransaction: (transaction: Transaction | null) => void;
  setTransactionSummary: (summary: TransactionSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
