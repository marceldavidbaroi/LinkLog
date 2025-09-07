import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import useAuthStore from "../features/auth/store/authStore";
import useNotificationStore from "../store/notificationStore";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ensures refresh token cookie is sent automatically
});

// Request interceptor: attach access token
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle notifications and 401
api.interceptors.response.use(
  (response) => {
    const notify = useNotificationStore.getState().setNotification;

    // Auto-show success for modifying requests
    const method = response.config.method?.toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method || "")) {
      notify("Operation successful!", "success");
    }

    return response.data; // return only the response payload
  },
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const notify = useNotificationStore.getState().setNotification;
    const authStore = useAuthStore.getState();

    notify(error.response?.data?.message || error.message, "error");

    const originalRequest = error.config;

    // Handle 401: try refreshing access token
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.accessToken;
        authStore.setToken(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest); // retry original request
      } catch {
        // Refresh failed → logout
        authStore.clearAuth();
        return Promise.reject(error);
      }
    }

    // Logout on 401 if not refreshable
    if (error.response?.status === 401) {
      authStore.clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
