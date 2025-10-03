// lib/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import useAuthStore from "@/features/auth/store/authStore";
import useNotificationStore from "@/store/notificationStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send cookies automatically
});

// ------------------ Request Interceptor ------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Only run in browser (client-side)
  if (typeof window === "undefined") return config;

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

// ------------------ Response Interceptor ------------------
api.interceptors.response.use(
  (response) => {
    // If response is blob, return as-is
    if (response.config.responseType === "blob") return response;

    const notify = useNotificationStore.getState().setNotification;

    // Show success messages for modifying requests
    const method = response.config.method?.toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method || "")) {
      notify("Operation successful!", "success");
    }

    const data = response.data;

    // If backend already uses ApiResponse format
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      "message" in data
    ) {
      return data;
    }

    // Otherwise wrap raw payload
    return {
      success: true,
      message: "OK",
      data,
    };
  },

  async (
    error: AxiosError & {
      config?: InternalAxiosRequestConfig & { _retry?: boolean };
    }
  ) => {
    const notify = useNotificationStore.getState().setNotification;
    const authStore = useAuthStore.getState();
    const originalRequest = error.config;

    // Handle blob errors (JSON inside blob)
    if (error.response?.data instanceof Blob) {
      const blob = error.response.data;
      const text = await blob.text();
      try {
        const json = JSON.parse(text);
        notify(json.message || error.message, "error");
      } catch {
        notify(error.message, "error");
      }
    } else {
      notify((error.response?.data as any)?.message || error.message, "error");
    }

    // ------------------ Token Refresh ------------------
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Use api instance to refresh token (ensures cookies + baseURL)
        const refreshResponse = await api.post("/auth/refresh", {});
        const newToken = refreshResponse.data?.accessToken;

        if (!newToken) throw new Error("No accessToken in refresh response");

        // Update store
        authStore.setToken(newToken);

        // Retry original request with new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        authStore.clearAuth();
        notify("Session expired. Please log in again.", "error");
        return Promise.reject(refreshError);
      }
    }

    // Still 401 after retry → logout
    if (error.response?.status === 401) {
      authStore.clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
