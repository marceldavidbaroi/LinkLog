import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddPersonDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (personName: string, notes: string) => void;
}

export default function AddPersonDialog({
  open,
  onClose,
  onSave,
}: AddPersonDialogProps) {
  const [personName, setPersonName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setPersonName("");
      setNotes("");
    }
  }, [open]);

  const handleSave = () => {
    if (!personName.trim()) return;
    onSave(personName, notes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Person</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Person Name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Notes"
          multiline
          minRows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
