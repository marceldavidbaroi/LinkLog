import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryState } from "../types/category.type";

export const useCategoryStore = create(
  persist<CategoryState>(
    (set) => ({
      allCategoryList: [],
      incomeCategoryList: [],
      expenseCategoryList: [],
      category: null,
      categoryStatus: null,
      loading: false,
      error: null,

      setCategoryList: (allCategoryList) => set({ allCategoryList }),
      setIncomeCategoryList: (incomeCategoryList) =>
        set({ incomeCategoryList }),
      setExpenseCategoryList: (expenseCategoryList) =>
        set({ expenseCategoryList }),
      setCategory: (category) => set({ category }),
      setCategoryStatus: (categoryStatus) => set({ categoryStatus }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "category-storage", // storage key
    }
  )
);
