/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/budgetApi";
import { useBudgetStore } from "../store/budgetStore";

import type { Budget, BudgetAlertsParams } from "../types/Budgets.type";

export const useBudgets = () => {
  const { setBudget, setLoading, setError, budgetList, setBudgetList } =
    useBudgetStore();

  /** Create a new budget */
  const create = async (payload: Partial<Budget>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Budget> = await Api.create(payload);
      setBudget(data || null);

      if (data) setBudgetList([data, ...budgetList]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch all transactions */
  const getAll = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Budget[]> = await Api.getAll(query);
      setBudgetList(data?.data || []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch budget by ID */
  const getById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Budget> = await Api.getOne(id);
      setBudget(data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update budget */
  const update = async (id: number, payload: Partial<Budget>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Budget> = await Api.update({
        id,
        payload,
      });
      setBudget(data || null);

      if (data) {
        const updatedList = budgetList.map((t) => (t.id === id ? data : t));
        setBudgetList(updatedList);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete budget */
  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await Api.remove(id);
      setBudgetList(budgetList.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch budget alerts
  const getAlerts = async (
    params?: BudgetAlertsParams
  ): Promise<ApiResponse<any>> => {
    // Sanitize input to avoid sending empty strings
    const query: Record<string, any> = {};

    if (params?.threshold !== undefined) query.threshold = params.threshold;
    if (params?.month) query.month = params.month;
    if (params?.year) query.year = params.year;

    return await Api.alerts(query);
  };

  return {
    create,
    getAll,
    getById,
    update,
    remove,
    getAlerts,
  };
};
