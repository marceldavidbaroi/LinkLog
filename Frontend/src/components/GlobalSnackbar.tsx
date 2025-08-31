import { Snackbar, Alert } from "@mui/material";
import useNotificationStore from "../store/notificationStore";

export default function GlobalSnackbar() {
  const { message, severity, clearNotification } = useNotificationStore();

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={5000}
      onClose={clearNotification}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={clearNotification}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
