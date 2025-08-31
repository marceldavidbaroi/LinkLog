import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type { Person } from "../types/contact.type";

// Individual functions
const create = async (
  payload: Partial<Person>
): Promise<ApiResponse<Person>> => {
  return await api.post("/people", payload);
};

const getAll = async (): Promise<ApiResponse<Person[]>> => {
  return await api.get("/people");
};

const getOne = async (id: number): Promise<ApiResponse<Person>> => {
  return await api.get(`/people/${id}`);
};

const update = async (payload: {
  id: number;
  payload: Partial<Person>;
}): Promise<ApiResponse<Person>> => {
  return await api.patch(`/people/${payload.id}`, payload.payload);
};

const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/people/${id}`);
};

// Export all as a single object
const Api = {
  create,
  getAll,
  getOne,
  update,
  remove,
};

export default Api;
