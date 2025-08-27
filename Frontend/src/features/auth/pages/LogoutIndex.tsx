import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import useAuthStore from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const { clearAuth, user } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // open dialog by default

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // go back if cancel
  };

  const handleLogout = async () => {
    clearAuth(); // clear Zustand auth store
    await logout(); // call your backend logout if needed
    setOpen(false);
    navigate("/auth/login"); // redirect to login
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout{user ? `, ${user.username}` : ""}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="error" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
