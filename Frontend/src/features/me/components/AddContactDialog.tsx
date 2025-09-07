import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface ContactData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  birthday?: Date | null;
  notes?: string;
}

interface AddContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ContactData) => void;
}

export default function AddContactDialog({
  open,
  onClose,
  onSave,
}: AddContactDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [contact, setContact] = useState<ContactData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    birthday: null,
    notes: "",
  });

  useEffect(() => {
    if (!open) {
      setContact({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        emergency_contact: "",
        birthday: null,
        notes: "",
      });
    }
  }, [open]);

  const handleChange = (field: keyof ContactData, value: any) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!contact.first_name.trim() || !contact.last_name.trim()) return;
    onSave(contact);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="First Name"
            value={contact.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            value={contact.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={contact.email}
            onChange={(e) => handleChange("email", e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={contact.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            fullWidth
          />
          <TextField
            label="Address"
            value={contact.address}
            onChange={(e) => handleChange("address", e.target.value)}
            fullWidth
          />
          <TextField
            label="Emergency Contact"
            value={contact.emergency_contact}
            onChange={(e) => handleChange("emergency_contact", e.target.value)}
            fullWidth
          />

          {/* MUI Date Picker */}
          <DatePicker
            label="Birthday"
            value={contact.birthday}
            onChange={(newValue) => handleChange("birthday", newValue)}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <TextField
            label="Notes"
            multiline
            minRows={4}
            value={contact.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
