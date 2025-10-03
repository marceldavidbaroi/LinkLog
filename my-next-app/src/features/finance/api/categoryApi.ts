import api from "@/lib/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type {
  Category,
  CategoryStats,
  FilterCategoriesParams,
} from "../types/category.type";

/** CREATE CATEGORY */
const create = async (
  payload: Partial<Category>
): Promise<ApiResponse<Category>> => {
  return await api.post("/categories", payload);
};

/** GET ALL CATEGORIES */
const getAll = async (
  params?: FilterCategoriesParams
): Promise<ApiResponse<Category[]>> => {
  return await api.get("/categories", { params });
};

/** GET ONE CATEGORY */
const getOne = async (id: number): Promise<ApiResponse<Category>> => {
  return await api.get(`/categories/${id}`);
};

/** UPDATE CATEGORY */
const update = async (payload: {
  id: number;
  payload: Partial<Category>;
}): Promise<ApiResponse<Category>> => {
  return await api.patch(`/categories/${payload.id}`, payload.payload);
};

/** DELETE CATEGORY */
const remove = async (id: number): Promise<ApiResponse<null>> => {
  return await api.delete(`/categories/${id}`);
};

/** GET CATEGORY STATS */
const getStats = async (): Promise<ApiResponse<CategoryStats>> => {
  return await api.get("/categories/stats/all");
};

const CategoryApi = {
  create,
  getAll,
  getOne,
  update,
  remove,
  getStats,
};

export default CategoryApi;
