import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import useAuthStore from "@/features/auth/store/authStore";
import useNotificationStore from "@/store/notificationStore";

// Base URL from Next.js environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ensures refresh token cookie is sent automatically
});

// ------------------ Request Interceptor ------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
    // If response is a blob, return as-is
    if (response.config.responseType === "blob") return response;

    const notify = useNotificationStore.getState().setNotification;

    // Show success message for modifying requests
    const method = response.config.method?.toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method || "")) {
      notify("Operation successful!", "success");
    }

    const data = response.data;

    // If backend already follows ApiResponse format
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      "message" in data
    ) {
      return data;
    }

    // Wrap raw payload
    return {
      success: true,
      message: "OK",
      data,
    };
  },

  // ------------------ Error Handling ------------------
  async (
    error: AxiosError & {
      config?: InternalAxiosRequestConfig & { _retry?: boolean };
    }
  ) => {
    const notify = useNotificationStore.getState().setNotification;
    const authStore = useAuthStore.getState();
    const originalRequest = error.config;

    // If response is blob containing JSON error, parse it
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

    // ------------------ Token Refresh Flow ------------------
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Try refreshing token
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.accessToken;
        if (!newToken) {
          throw new Error("No accessToken in refresh response");
        }

        // Update token in store
        authStore.setToken(newToken);

        // Retry the original request with new token
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

    // Still 401 after refresh attempt → logout
    if (error.response?.status === 401) {
      authStore.clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
