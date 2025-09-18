/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/savingsGoalsApi";
import { useSavingsGoalsStore } from "../store/savingsGoalsStore";

import type { SavingsGoal } from "../types/SavingsGoals.type";

export const useSavingsGoals = () => {
  const {
    setSavingsGoal,
    setLoading,
    setError,
    savingsGoalsList,
    setSavingsGoalsList,
  } = useSavingsGoalsStore();

  /** Create a new budget */
  const create = async (payload: Partial<SavingsGoal>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<SavingsGoal> = await Api.create(payload);
      setSavingsGoal(data || null);

      if (data) setSavingsGoalsList([data, ...savingsGoalsList]);
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
      const data: ApiResponse<SavingsGoal[]> = await Api.getAll(query);
      setSavingsGoalsList(data?.data || []);
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
      const { data }: ApiResponse<SavingsGoal> = await Api.getOne(id);
      setSavingsGoal(data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update budget */
  const update = async (id: number, payload: Partial<SavingsGoal>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<SavingsGoal> = await Api.update(id, payload);
      setSavingsGoal(data || null);

      if (data) {
        const updatedList = savingsGoalsList.map((t) =>
          t.id === id ? data : t
        );
        setSavingsGoalsList(updatedList);
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
      setSavingsGoalsList(savingsGoalsList.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAmount = async (id: number, payload: { amount: number }) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<SavingsGoal> = await Api.updateAmount(
        id,
        payload
      );

      // Update the single goal in the list
      if (data) {
        setSavingsGoal(data);
        const updatedList = savingsGoalsList.map((t) =>
          t.id === id ? data : t
        );
        setSavingsGoalsList(updatedList);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const editSavingsTransactionAmount = async (
    goalId: number,
    transactionId: number,
    amount: number
  ) => {
    setLoading(true);
    try {
      const { data }: ApiResponse<SavingsGoal> =
        await Api.editSavingsTransactionAmount(goalId, transactionId, amount);

      console.log("this is the data", data);
      console.log("store ", savingsGoalsList);

      if (data) {
        const updatedGoalsList = Array.isArray(savingsGoalsList)
          ? savingsGoalsList.map((goal) => (goal.id === data.id ? data : goal))
          : savingsGoalsList;

        setSavingsGoalsList(updatedGoalsList);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeSavingsTransactionAmount = async (
    goalId: number,
    transactionId: number
  ) => {
    setLoading(true);
    try {
      const { data }: ApiResponse<SavingsGoal> =
        await Api.removeSavingsTransactionAmount(goalId, transactionId);

      if (data) {
        const updatedGoalsList = Array.isArray(savingsGoalsList)
          ? savingsGoalsList.map((goal) => (goal.id === data.id ? data : goal))
          : savingsGoalsList;

        setSavingsGoalsList(updatedGoalsList);
      }
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
    updateAmount,
    editSavingsTransactionAmount,
    removeSavingsTransactionAmount,
  };
};
