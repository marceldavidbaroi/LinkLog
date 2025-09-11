import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type { Interaction } from "../types/interaction.type";

const create = async (
  payload: Partial<Interaction>
): Promise<ApiResponse<Interaction>> => {
  return await api.post("/interactions", payload);
};

const getAll = async (): Promise<ApiResponse<Interaction[]>> => {
  return await api.get("/interactions");
};

const getOne = async (id: number): Promise<ApiResponse<Interaction>> => {
  return await api.get(`/interactions/${id}`);
};

const update = async (payload: {
  id: number;
  payload: Partial<Interaction>;
}): Promise<ApiResponse<Interaction>> => {
  return await api.patch(`/interactions/${payload.id}`, payload.payload);
};

const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/interactions/${id}`);
};

const Api = {
  create,
  getAll,
  getOne,
  update,
  remove,
};

export default Api;
