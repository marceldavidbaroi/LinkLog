import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type {
  SavingsGoal,
  FindSavingsGoalsParams,
} from "../types/SavingsGoals.type";

// ---------- API Calls ----------

// Create a savings goal
const create = async (
  payload: Partial<SavingsGoal>
): Promise<ApiResponse<SavingsGoal>> => {
  return await api.post("/savings-goals", payload);
};

// Get all savings goals (with query filters + pagination)
const getAll = async (
  query: FindSavingsGoalsParams
): Promise<ApiResponse<SavingsGoal[]>> => {
  return await api.get("/savings-goals", { params: query });
};

// Get one savings goal by id
const getOne = async (id: number): Promise<ApiResponse<SavingsGoal>> => {
  return await api.get(`/savings-goals/${id}`);
};

// Update a savings goal by id
const update = async (
  id: number,
  payload: Partial<SavingsGoal>
): Promise<ApiResponse<SavingsGoal>> => {
  return await api.put(`/savings-goals/${id}`, payload);
};

// Delete a savings goal by id
const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/savings-goals/${id}`);
};

// Add amount to current savings
const updateAmount = async (
  id: number,
  payload: { amount: number }
): Promise<ApiResponse<SavingsGoal>> => {
  return await api.patch(`/savings-goals/${id}/add`, payload);
};

const editSavingsTransactionAmount = async (
  goalId: number,
  transactionId: number,
  amount: number
): Promise<ApiResponse<SavingsGoal>> => {
  return await api.patch(`/savings-goals/${goalId}/edit/${transactionId}`, {
    amount,
  });
};

const removeSavingsTransactionAmount = async (
  goalId: number,
  transactionId: number
): Promise<ApiResponse<SavingsGoal>> => {
  // PATCH with no body, some clients need {} instead of empty
  return await api.patch(
    `/savings-goals/${goalId}/remove/${transactionId}`,
    {}
  );
};

// ---------- Export ----------
const SavingsGoalsApi = {
  create,
  getAll,
  getOne,
  update,
  remove,
  updateAmount,
  editSavingsTransactionAmount,
  removeSavingsTransactionAmount,
};

export default SavingsGoalsApi;
