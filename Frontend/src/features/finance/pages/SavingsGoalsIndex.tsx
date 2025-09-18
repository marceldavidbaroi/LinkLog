import { useEffect, useState } from "react";
import { useSavingsGoals } from "../hooks/savingsGoalsAuth";
import { useSavingsGoalsStore } from "../store/savingsGoalsStore";
import SavingsGoalCard from "../components/SavingsGoalCard";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
import type { Priority, SavingsGoal } from "../types/SavingsGoals.type";
import type { FindSavingsGoalsParams } from "../types/SavingsGoals.type";
import SavingsGoalFormDialog from "../components/SavingsGoalFormDialog";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();

const SavingsGoalsIndex = () => {
  const savingsGoalsStore = useSavingsGoalsStore();
  const {
    getAll,
    getById,
    create,
    update,
    remove,
    updateAmount,
    editSavingsTransactionAmount,
    removeSavingsTransactionAmount,
  } = useSavingsGoals();

  const [filters, setFilters] = useState<FindSavingsGoalsParams>({
    page: 1,
    limit: 25,
    year: currentYear, // keep default year
    month: undefined, // default month is ALL
  });

  const [searchInput, setSearchInput] = useState(""); // raw input for debounce
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const fetchAllGoals = async (params?: FindSavingsGoalsParams) => {
    await getAll(params);
  };

  // Debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        name: searchInput || undefined,
      }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchAllGoals(filters);
  }, [filters]);

  // Handlers for card actions
  const handleAddSavings = async (id: number, amount: number) => {
    await updateAmount(id, { amount });
    fetchAllGoals(filters);
  };

  const handleEdit = async (id: number) => {
    const goal = await getById(id);
    console.log("Edit goal", goal);
    handleOpenForm();
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    fetchAllGoals(filters);
  };

  // Add Goal
  const handleAddGoal = () => {
    savingsGoalsStore.savingsGoal = null;
    handleOpenForm();
  };

  const handleSaveGoal = async (data: Partial<SavingsGoal>) => {
    if (savingsGoalsStore.savingsGoal) {
      // Edit existing goal
      await update(savingsGoalsStore.savingsGoal.id, data);
    } else {
      // Create new goal
      await create(data);
    }
    handleCloseForm();
    await getAll(); // Refresh list
  };

  const handleEditTransaction = async (data: any) => {
    await editSavingsTransactionAmount(
      data?.goal?.id,
      data?.transaction?.id,
      data?.transaction?.amount
    );
  };
  const handleDeleteTransaction = async (data: any) => {
    console.log("clicked delete");
    console.log(data);
    await removeSavingsTransactionAmount(data?.goal?.id, data?.transaction?.id);
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Add Button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Savings Goals</Typography>
        <Button variant="contained" onClick={handleAddGoal}>
          Add Goal
        </Button>
      </Stack>

      {/* Filters Section */}
      <Stack direction="row" spacing={2} flexWrap="wrap" mb={3}>
        {/* Name Search */}
        <TextField
          label="Search by Name"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {/* Priority Dropdown */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority ?? ""}
            label="Priority"
            onChange={(e) =>
              setFilters({
                ...filters,
                priority: e.target.value
                  ? (e.target.value as Priority)
                  : undefined,
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Month Dropdown */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={filters.month ?? ""}
            label="Month"
            onChange={(e) =>
              setFilters({
                ...filters,
                month: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            {monthNames.map((name, index) => (
              <MenuItem key={index} value={index + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Dropdown */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={filters.year ?? ""}
            label="Year"
            onChange={(e) =>
              setFilters({
                ...filters,
                year: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: 5 }).map((_, i) => (
              <MenuItem key={i} value={currentYear + i}>
                {currentYear + i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Goals List */}
      {Array.isArray(savingsGoalsStore.savingsGoalsList) &&
        savingsGoalsStore.savingsGoalsList.map((goal) => (
          <SavingsGoalCard
            key={goal.id}
            goal={goal}
            onAddSavings={handleAddSavings}
            onEditGoal={handleEdit} // ✅ correct name
            onDeleteGoal={handleDelete}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        ))}
      <SavingsGoalFormDialog
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSaveGoal}
        initialData={savingsGoalsStore.savingsGoal || {}}
      />
    </Box>
  );
};

export default SavingsGoalsIndex;
