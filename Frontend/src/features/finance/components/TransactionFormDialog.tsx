import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Typography,
  FormHelperText,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { Transaction } from "../types/Transaction.type";
import {
  expenseCategoriesList,
  incomeCategoriesList,
  recurringIntervals,
  transactionTypes,
} from "../types/Transaction.type";

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => void;
  transaction?: Partial<Transaction> | null; // optional, for edit
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  transaction,
}) => {
  const [form, setForm] = useState<Partial<Transaction>>({
    amount: null,
    category: "",
    date: null,
    description: "",
    type: "income",
    recurring: false,
    recurring_interval: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Partial<Transaction>, string>>
  >({});

  // Initialize form for edit or new
  useEffect(() => {
    if (transaction) {
      const catList =
        transaction.type === "income"
          ? incomeCategoriesList
          : expenseCategoriesList;

      setForm({
        amount: transaction.amount ?? null,
        category: catList.includes(transaction.category ?? "")
          ? transaction.category
          : "",
        date: transaction.date ? new Date(transaction.date) : null,
        description: transaction.description ?? "",
        type: transaction.type ?? "income",
        recurring: transaction.recurring ?? false,
        recurring_interval: transaction.recurring_interval ?? null,
      });
    } else {
      setForm({
        amount: null,
        category: null,
        date: null,
        description: "",
        type: "income",
        recurring: false,
        recurring_interval: null,
      });
    }
    setErrors({});
  }, [transaction, open]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === "type") {
      // Reset category if type changes
      setForm((prev) => ({
        ...prev,
        type: value as "income" | "expense",
        category: null,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle date change from DatePicker
  const handleDateChange = (date: Date | null) => {
    setForm((prev) => ({ ...prev, date }));
  };

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Amount is required and must be greater than 0";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.date) newErrors.date = "Date is required";
    if (form.recurring && !form.recurring_interval)
      newErrors.recurring_interval =
        "Interval is required for recurring transactions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData = {
      ...form,
      amount: form.amount ? Number(form.amount) : 0, // convert to number
    };

    onSubmit(submitData);
    onClose();
  };

  // Category options based on type
  const categoryOptions =
    form.type === "income" ? incomeCategoriesList : expenseCategoriesList;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        {transaction ? "Edit Transaction" : "New Transaction"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {/* Amount */}
        <TextField
          fullWidth
          label="Amount"
          name="amount"
          type="number"
          value={form.amount ?? null}
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        {/* Type */}
        <TextField
          select
          fullWidth
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          {transactionTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {/* Category */}
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={form.category ?? ""}
          onChange={handleChange}
          error={!!errors.category}
        >
          {categoryOptions.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </MenuItem>
          ))}
        </TextField>
        {errors.category && (
          <FormHelperText error>{errors.category}</FormHelperText>
        )}

        {/* Date */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!errors.date}
                helperText={errors.date}
              />
            )}
          />
        </LocalizationProvider>

        {/* Recurring */}
        <Box display="flex" alignItems="center" gap={1}>
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />
          <Typography>Recurring</Typography>
        </Box>

        {/* Recurring Interval */}
        {form.recurring && (
          <>
            <TextField
              select
              fullWidth
              label="Recurring Interval"
              name="recurring_interval"
              value={form.recurring_interval ?? ""}
              onChange={handleChange}
              error={!!errors.recurring_interval}
            >
              {recurringIntervals.map((interval) => (
                <MenuItem key={interval} value={interval}>
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            {errors.recurring_interval && (
              <FormHelperText error>{errors.recurring_interval}</FormHelperText>
            )}
          </>
        )}

        {/* Description */}
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Description"
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {transaction ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionFormDialog;
