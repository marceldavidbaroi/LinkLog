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
  percentageUsed: number;
}

export interface BudgetOverallUsage {
  budgeted: number;
  spent: number;
  percentageUsed: number;
}

export interface SavingsProgress {
  targetAmount: string;
  savedAmount: number;
  percentage: number;
}

export interface Summary {
  totalIncome: number;
  totalIxpense: number;
  netIavings: number;
  budgetedImount: number;
  budgetDifference: number;
  savingsProgress: SavingsProgress;
}

export interface SavingsGoal {
  goalName: string;
  targetAmount: string;
  savedAmount: number;
  percentage: number;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
}

export interface ReportData {
  period: Period;
  summary: Summary;
  income: {
    byCategory: IncomeCategory[];
    trend: IncomeTrend[];
  };
  expenses: {
    byCategory: ExpensesCategory[];
    trend: ExpensesTrend[];
  };
  budgets: {
    byCategory: BudgetCategory[];
    overallUsage: BudgetOverallUsage;
  };
  savingsGoals: SavingsGoal[];
}

export interface Report {
  id: number;
  reportType: ReportType;
  periodStart: string;
  periodEnd: string;
  data: ReportData;
  createdAt: string;
  updatedAt: string;
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
