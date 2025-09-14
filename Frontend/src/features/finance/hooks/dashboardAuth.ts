import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/dashboardApi";
import { useDashboardStore } from "../store/dashboardStore";
import type {
  CompareMonthResponse,
  DashboardOverviewResponse,
} from "../types/Dashboard.type";

export const useDashboard = () => {
  const { setCompareMonth, setDashboardOverview, setLoading, setError } =
    useDashboardStore();

  /** Create a new transaction */

  const overview = async (query: { startDate: string; endDate: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<DashboardOverviewResponse> =
        await Api.overview(query);
      setDashboardOverview(data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const comparison = async (query: { startDate: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<CompareMonthResponse> = await Api.comparison(
        query
      );
      setCompareMonth(data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    overview,
    comparison,
  };
};
