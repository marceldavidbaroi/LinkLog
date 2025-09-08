import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api-response.type";
import type { Me } from "../types/me.type";

// Get logged-in user's profile
const getProfile = async (): Promise<ApiResponse<Me>> => {
  return await api.get("/auth/me");
};

// Update profile info (username, email, etc.)
const updateProfile = async (
  payload: Partial<Me>
): Promise<ApiResponse<Me>> => {
  return await api.patch("/auth/me", payload);
};

// Update only preferences
const updatePreferences = async (payload: {
  frontend?: Record<string, unknown> | null;
  backend?: Record<string, unknown> | null;
}): Promise<ApiResponse<Me>> => {
  return await api.patch("/auth/me/preferences", payload);
};

// Export all functions as an object
const MeApi = {
  getProfile,
  updateProfile,
  updatePreferences,
};

export default MeApi;
