import { create } from "zustand";

interface NotificationState {
  message: string | null;
  severity: "success" | "error" | "info" | "warning";
  setNotification: (
    message: string,
    severity?: NotificationState["severity"]
  ) => void;
  clearNotification: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  severity: "info",
  setNotification: (message, severity = "info") => set({ message, severity }),
  clearNotification: () => set({ message: null }),
}));

export default useNotificationStore;
