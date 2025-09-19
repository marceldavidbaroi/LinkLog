import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { Priority } from "../types/SavingsGoals.type";

interface SavingsGoalFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    targetAmount: number;
    priority: Priority;
    dueDate: string;
  }) => void;
  initialData?: {
    name?: string;
    targetAmount?: number;
    priority?: Priority;
    dueDate?: string; // YYYY-MM-DD
  };
}

const SavingsGoalFormDialog: React.FC<SavingsGoalFormDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData = {},
}) => {
  // Ensure all initial values are defined
  const [name, setName] = useState(initialData.name || "");
  const [targetAmount, setTargetAmount] = useState<number>(
    initialData.targetAmount ?? 0
  );
  const [priority, setPriority] = useState<Priority>(
    initialData.priority || "MEDIUM"
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    initialData.dueDate ? new Date(initialData.dueDate) : null
  );

  // Sync state when initialData changes (edit mode)
  useEffect(() => {
    setName(initialData.name || "");
    setTargetAmount(initialData.targetAmount ?? 0);
    setPriority(initialData.priority || "MEDIUM");
    setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : null);
  }, [initialData, open]);

  const handleSave = () => {
    if (!name || !targetAmount || !dueDate) return;
    onSave({
      name,
      targetAmount: targetAmount,
      priority,
      dueDate: dueDate.toISOString().split("T")[0], // YYYY-MM-DD
    });
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {initialData.name ? "Edit Savings Goal" : "Create Savings Goal"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Target Amount"
              type="number"
              value={targetAmount ?? 0}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority || "MEDIUM"}
                onChange={(e) => setPriority(e.target.value as Priority)}
                label="Priority"
              >
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default SavingsGoalFormDialog;
