import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type {
  Budget,
  BudgetAlertsParams,
  FindBudgetsParams,
} from "../types/Budgets.type";

// ---------- API Calls ----------

// Create a budget
const create = async (
  payload: Partial<Budget>
): Promise<ApiResponse<Budget>> => {
  return await api.post("/budgets", payload);
};

// Get all budgets (with query filters + pagination)
const getAll = async (
  query: FindBudgetsParams
): Promise<ApiResponse<Budget[]>> => {
  return await api.get("/budgets", { params: query });
};

// Get one budget by id
const getOne = async (id: number): Promise<ApiResponse<Budget>> => {
  return await api.get(`/budgets/${id}`);
};

// Update budget by id
const update = async (payload: {
  id: number;
  payload: Partial<Budget>;
}): Promise<ApiResponse<Budget>> => {
  return await api.patch(`/budgets/${payload.id}`, payload.payload);
};

// Delete budget by id
const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/budgets/${id}`);
};

// Get budgets alerts (threshold check)
const alerts = async (
  params?: BudgetAlertsParams
): Promise<ApiResponse<Budget[]>> => {
  return await api.get("/budgets/alerts", { params });
};

// ---------- Export ----------
const BudgetApi = {
  create,
  getAll,
  getOne,
  update,
  remove,
  alerts,
};

export default BudgetApi;
