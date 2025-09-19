export type ReportType = "monthly" | "half_yearly" | "yearly";

export interface Period {
  type: ReportType;
  start: string;
  end: string;
}

export interface IncomeCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface IncomeTrend {
  period: string;
  amount: number;
}

export interface ExpensesCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpensesTrend {
  period: string;
  amount: number;
}

export interface BudgetCategory {
  category: string;
  budgeted: number;
  spent: number;
  percentage_used: number;
}

export interface BudgetOverallUsage {
  budgeted: number;
  spent: number;
  percentage_used: number;
}

export interface SavingsProgress {
  target_amount: string;
  saved_amount: number;
  percentage: number;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  net_savings: number;
  budgeted_amount: number;
  budget_difference: number;
  savings_progress: SavingsProgress;
}

export interface SavingsGoal {
  goal_name: string;
  target_amount: string;
  saved_amount: number;
  percentage: number;
  due_date: string;
  status: "pending" | "completed" | "overdue";
}

export interface ReportData {
  period: Period;
  summary: Summary;
  income: {
    by_category: IncomeCategory[];
    trend: IncomeTrend[];
  };
  expenses: {
    by_category: ExpensesCategory[];
    trend: ExpensesTrend[];
  };
  budgets: {
    by_category: BudgetCategory[];
    overall_usage: BudgetOverallUsage;
  };
  savings_goals: SavingsGoal[];
}

export interface Report {
  id: number;
  reportType: ReportType;
  period_start: string;
  period_end: string;
  data: ReportData;
  created_at: string;
  updated_at: string;
}

export interface FindReportParams {
  reportType?: ReportType;
  year?: number;
  month?: number;
  half?: number;
}

export interface ExportFormat {
  PDF: "pdf";
  CSV: "csv";
}
export interface ReportsState {
  reportsList: Report[];
  report: Report | null;
  loading: boolean;
  error: string | null;

  setReportsList: (list: Report[]) => void;
  setReport: (report: Report | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
