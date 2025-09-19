import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import {
  type FindReportParams,
  type ExportFormat,
} from "../types/Reports.type";

// ---------- API Calls ----------

// Create a budget
const create = async (
  payload: Partial<FindReportParams>
): Promise<ApiResponse<Report>> => {
  return await api.post("/reports", payload);
};

// Get all budgets (with query filters + pagination)
const getAll = async (
  query: FindReportParams
): Promise<ApiResponse<Report[]>> => {
  return await api.get("/reports", { params: query });
};

// Get one budget by id
const getOne = async (id: number): Promise<ApiResponse<Report>> => {
  return await api.get(`/reports/${id}`);
};

// Update budget by id
const update = async (payload: {
  id: number;
}): Promise<ApiResponse<Report>> => {
  return await api.patch(`/reports/${payload.id}`);
};

// Delete budget by id
const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/reports/${id}`);
};

const topCategories = async (
  query: Partial<FindReportParams>
): Promise<ApiResponse<Report>> => {
  return await api.get("/reports/top-categories", { params: query });
};
const categoryCharts = async (
  query: Partial<FindReportParams>
): Promise<ApiResponse<Report>> => {
  return await api.get("/reports/category-charts", { params: query });
};

const exportReport = async (
  id: number,
  query: { format: ExportFormat }
): Promise<ApiResponse<null>> => {
  return await api.get(`/reports/export/${id}`, { params: query });
};

// ---------- Export ----------
const ReportsApi = {
  create,
  getAll,
  getOne,
  update,
  remove,
  topCategories,
  categoryCharts,
  exportReport,
};

export default ReportsApi;
