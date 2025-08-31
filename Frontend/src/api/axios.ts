import axios from "axios";
import useAuthStore from "../features/auth/store/authStore";
import useNotificationStore from "../store/notificationStore";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const notify = useNotificationStore.getState().setNotification;

    // Auto-show success for modifying requests
    if (
      ["post", "put", "patch", "delete"].includes(response.config.method || "")
    ) {
      notify("Operation successful!", "success");
    }

    return response.data;
  },
  (error) => {
    const notify = useNotificationStore.getState().setNotification;
    notify(error.response?.data?.message || error.message, "error");

    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
