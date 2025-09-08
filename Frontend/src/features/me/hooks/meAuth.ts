import type { ApiResponse } from "../../../types/api-response.type";
import MeApi from "../api/meApi";
import useMeStore from "../store/meStore";
import type { Me } from "../types/me.type";

export const useMe = () => {
  const { setMe, setLoading, setError, updatePreferences } = useMeStore();

  // Fetch profile
  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Me> = await MeApi.getProfile();
      setMe(data?.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (payload: Partial<Me>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Me> = await MeApi.updateProfile(payload);
      setMe(data?.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update only preferences
  const updateMyPreferences = async (payload: Partial<Me["preferences"]>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Me> = await MeApi.updatePreferences(payload);
      setMe(data?.data || null);

      // also update in store immediately
      if (data?.data?.preferences) {
        updatePreferences(data.data.preferences);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    getProfile,
    updateProfile,
    updateMyPreferences,
  };
};
