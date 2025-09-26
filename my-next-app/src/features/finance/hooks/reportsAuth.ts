import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/reportsApi";
import { useReportStore } from "../store/reportStore";
import type { FindReportParams, ExportFormat } from "../types/Reports.type";

export const useReports = () => {
  const {
    setReportsList,
    setReport,
    setError,
    setLoading,
    reportsList,
    report,
  } = useReportStore();

  const getAll = async (query: FindReportParams = {}) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const { data }: ApiResponse<Report[]> = await Api.getAll(query);
      setReportsList(data || []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.getOne(id);
      setReport(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: Partial<FindReportParams>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.create(payload);
      setReport(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.update(id);
      setReport(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await Api.remove(id);
      // Optional: remove deleted report from store
      setReportsList(reportsList.filter((r) => r.id !== id));
      if (report?.id === id) setReport(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const topCategories = async (query: Partial<FindReportParams> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.topCategories(query);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryCharts = async (query: Partial<FindReportParams> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.categoryCharts(query);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    getAll,
    getOne,
    create,
    update,
    remove,
    topCategories,
    categoryCharts,
    reportsList,
    report,
  };
};
