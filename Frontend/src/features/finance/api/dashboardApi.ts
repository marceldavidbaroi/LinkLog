import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type {
  DashboardOverviewResponse,
  CompareMonthResponse,
} from "../types/Dashboard.type";

const overview = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<DashboardOverviewResponse>> => {
  return await api.get("/dashboard/overview", { params });
};
const comparison = async (params?: {
  startDate?: string;
}): Promise<ApiResponse<CompareMonthResponse>> => {
  return await api.get("/dashboard/monthly-comparison", { params });
};
const Api = {
  overview,
  comparison,
};

export default Api;
