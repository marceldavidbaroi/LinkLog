export interface MonthlyOverview {
  income: {
    prev: number;
    current: number;
    percentage: number;
  };
  expense: {
    prev: number;
    current: number;
    percentage: number;
  };
  savings: {
    prev: number;
    current: number;
    percentage: number;
  };
}

export interface CategoryDetail {
  category: string;
  type: "income" | "expense";
  prev: number;
  current: number;
  percentage: number;
}

export interface CompareMonthResponse {
  overview: MonthlyOverview;
  details: CategoryDetail[];
}

export interface DashboardOverviewResponse {
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

export interface DashboardState {
  overview: DashboardOverviewResponse | null;
  compareMonth: CompareMonthResponse | null;
  loading: boolean;
  error: string | null;

  setDashboardOverview: (overview: DashboardOverviewResponse | null) => void;
  setCompareMonth: (data: CompareMonthResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
