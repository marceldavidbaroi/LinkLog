"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Box,
} from "@mui/material";
import type { Category } from "../../types/category.type";

interface CategoryFormDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => Promise<void> | void;
}

export default function CategoryFormDialog({
  open,
  category,
  onClose,
  onSubmit,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [errors, setErrors] = useState<{ name?: string; displayName?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDisplayName(category.displayName);
      setType(category.type);
    } else {
      setName("");
      setDisplayName("");
      setType("income");
    }
    setErrors({});
    setLoading(false);
  }, [category, open]);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!displayName.trim()) newErrors.displayName = "Display Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name, displayName, type });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
        />
        <TextField
          label="Display Name"
          fullWidth
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          error={!!errors.displayName}
          helperText={errors.displayName}
          disabled={loading}
        />
        <FormControl fullWidth margin="normal" disabled={loading}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} color="inherit" />
              {category ? "Saving..." : "Adding..."}
            </Box>
          ) : category ? (
            "Save Changes"
          ) : (
            "Add Category"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
