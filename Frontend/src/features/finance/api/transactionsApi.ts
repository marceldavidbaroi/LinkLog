import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type {
  FindTransactionsParams,
  Transaction,
  TransactionSummary,
} from "../types/Transaction.type";

const create = async (
  payload: Partial<Transaction>
): Promise<ApiResponse<Transaction>> => {
  return await api.post("/transactions", payload);
};
const getAll = async (
  query: FindTransactionsParams
): Promise<ApiResponse<Transaction[]>> => {
  return await api.get("/transactions", { params: query });
};
const getOne = async (id: number): Promise<ApiResponse<Transaction>> => {
  return await api.get(`/transactions/${id}`);
};
const update = async (payload: {
  id: number;
  payload: Partial<Transaction>;
}): Promise<ApiResponse<Transaction>> => {
  return await api.patch(`/transactions/${payload.id}`, payload.payload);
};
const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/transactions/${id}`);
};
const overview = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<TransactionSummary>> => {
  return await api.get("/dashboard/overview", { params });
};
const Api = {
  create,
  getAll,
  getOne,
  update,
  remove,
  overview,
};

export default Api;
