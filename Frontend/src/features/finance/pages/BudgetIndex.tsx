import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import type { Budget } from "../types/Budgets.type";
import { expenseCategoriesList } from "../types/Transaction.type";
import { useBudgets } from "../hooks/budgetAuth";
import { useBudgetStore } from "../store/budgetStore";
import DeleteDialog from "../../../components/DeleteDialog";
import BudgetAlertsDialog from "../components/BudgetAlertsDialog";

interface FindBudgetsParams {
  category?: string;
  month: number;
  year: number;
}

// Helper: normalize category (replace _ with space, capitalize words)
const normalizeCategory = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BudgetsIndex = () => {
  const { getAll, create, update, remove, getAlerts } = useBudgets();

  const [filters, setFilters] = useState<FindBudgetsParams>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);

  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  const budgetStore = useBudgetStore();
  const fetchBudgets = async () => {
    await getAll({
      page: 1,
      // get all
      limit: 100,
      ...filters,
    });
  };

  const fetchAlerts = async () => {
    const query = {
      ...filters,
    };
    const alert = await getAlerts(query);
    setAlerts(alert.data ?? []);
  };

  useEffect(() => {
    fetchBudgets();
    fetchAlerts();
  }, [filters]);

  const handleSaveEdit = async (id: number) => {
    await update(id, { amount: Number(editAmount) });
    setEditingId(null);
    fetchAlerts();
  };

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setDialogDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    await remove(selectedId);
    fetchAlerts();
    setDialogDeleteOpen(false);
  };

  const handleAdd = async () => {
    if (!newCategory || !newAmount) return;
    await create({
      category: newCategory,
      amount: newAmount,
      month: filters.month,
      year: filters.year,
    });
    setAdding(false);
    setNewCategory("");
    setNewAmount(0);
    fetchBudgets();
    fetchAlerts();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
      <BudgetAlertsDialog alerts={alerts} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Budgets
        </Typography>
      </Box>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || ""}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value || undefined })
            }
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {expenseCategoriesList.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {normalizeCategory(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={filters.month || ""}
            onChange={(e) =>
              setFilters({ ...filters, month: Number(e.target.value) })
            }
            label="Month"
          >
            {monthNames.map((name, i) => (
              <MenuItem key={i} value={i + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }} size="small">
          <InputLabel>Year</InputLabel>
          <Select
            value={filters.year || ""}
            onChange={(e) =>
              setFilters({ ...filters, year: Number(e.target.value) })
            }
            label="Year"
          >
            {Array.from({ length: 5 }, (_, i) => 2023 + i).map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="end" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAdding(true)}
        >
          Add Budget
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="center">Amount (Tk)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetStore.budgetList.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{normalizeCategory(budget.category)}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {editingId === budget.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                    />
                  ) : (
                    budget.amount
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === budget.id ? (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleSaveEdit(budget.id)}
                        size="small"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => setEditingId(null)}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingId(budget.id);
                          setEditAmount(budget.amount);
                        }}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(budget.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {/* Inline Add Row */}
            {adding && (
              <TableRow>
                <TableCell>
                  <FormControl sx={{ minWidth: 160 }} size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      label="Category"
                    >
                      {expenseCategoriesList.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {normalizeCategory(cat)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Amount"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="success" onClick={handleAdd} size="small">
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={() => setAdding(false)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {budgetStore.budgetList.length === 0 && !adding && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No budgets found for the selected filters.
        </Typography>
      )}
      <DeleteDialog
        open={dialogDeleteOpen}
        onCancel={() => setDialogDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default BudgetsIndex;
