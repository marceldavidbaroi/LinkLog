import type { ApiResponse } from "../../../types/api-response.type";
import CategoryApi from "../api/categoryApi";
import { useCategoryStore } from "../store/categoryStore";
import type {
  Category,
  CategoryStats,
  FilterCategoriesParams,
} from "../types/category.type";

export const useCategory = () => {
  const {
    allCategoryList,
    setCategoryList,
    incomeCategoryList,
    setIncomeCategoryList,
    expenseCategoryList,
    setExpenseCategoryList,
    category,
    setCategory,
    categoryStatus,
    setCategoryStatus,
    loading,
    setLoading,
    error,
    setError,
  } = useCategoryStore();

  /** Create a new category */
  const create = async (payload: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Category> = await CategoryApi.create(payload);
      setCategory(data || null);
      if (data) setCategoryList([data, ...allCategoryList]);
      await getStats();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch all categories with optional filters */
  const getAll = async (params?: FilterCategoriesParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Category[]> = await CategoryApi.getAll(
        params
      );
      setCategoryList(data || []);
      setIncomeCategoryList(data?.filter((c) => c.type === "income") || []);
      setExpenseCategoryList(data?.filter((c) => c.type === "expense") || []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch a single category by ID */
  const getById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Category> = await CategoryApi.getOne(id);
      setCategory(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update a category */
  const update = async (id: number, payload: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Category> = await CategoryApi.update({
        id,
        payload,
      });
      setCategory(data || null);
      if (data) {
        const updatedList = allCategoryList.map((c) =>
          c.id === id ? data : c
        );
        setCategoryList(updatedList);
        setIncomeCategoryList(updatedList.filter((c) => c.type === "income"));
        setExpenseCategoryList(updatedList.filter((c) => c.type === "expense"));
        await getStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete a category */
  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryApi.remove(id);
      const updatedList = allCategoryList.filter((c) => c.id !== id);
      setCategoryList(updatedList);
      setIncomeCategoryList(updatedList.filter((c) => c.type === "income"));
      setExpenseCategoryList(updatedList.filter((c) => c.type === "expense"));
      await getStats();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Get category stats */
  const getStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<CategoryStats> = await CategoryApi.getStats();
      setCategoryStatus(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    getAll,
    getById,
    update,
    remove,
    getStats,
    allCategoryList,
    incomeCategoryList,
    expenseCategoryList,
    category,
    categoryStatus,
    loading,
    error,
  };
};
