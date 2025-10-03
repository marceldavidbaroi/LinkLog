"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import CategoryFormDialog from "./CategoryFormDialog";

import DeleteDialog from "@/components/DeleteDialog";
import { useCategory } from "@/features/finance/hooks/categoryAuth";
import { useCategoryStore } from "@/features/finance/store/categoryStore";

export default function CategoryTable() {
  const categoryStore = useCategoryStore();
  const { getAll, create, update, remove } = useCategory();

  const [pagination, setPagination] = useState({ page: 0, pageSize: 25 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState<{
    categoryType?: "income" | "expense";
  }>({});

  const [dialogFormOpen, setDialogFormOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const fetchCategories = async () => {
    const response = await getAll(filters);
    const data = response?.data || [];
    setTotalRows(data.length);
  };

  useEffect(() => {
    fetchCategories();
  }, [filters, pagination.page, pagination.pageSize]);

  const handleAdd = () => {
    setEditingCategory(null);
    setDialogFormOpen(true);
  };

  const handleEditClick = (category: any) => {
    setEditingCategory(category);
    setDialogFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingCategory) {
      await update(editingCategory.id, data);
    } else {
      await create(data);
    }
    setDialogFormOpen(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCategoryId(id);
    setDialogDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategoryId) {
      await remove(selectedCategoryId);
      setDialogDeleteOpen(false);
      setSelectedCategoryId(null);
      fetchCategories();
    }
  };

  const handleTypeChange = (e: any) => {
    setFilters({ categoryType: e.target.value || undefined });
    setPagination({ ...pagination, page: 0 });
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({ page: 0, pageSize: parseInt(e.target.value, 10) });
  };

  return (
    <Paper
      sx={{ width: "100%", p: 2, boxShadow: "none", bgcolor: "transparent" }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        my={2}
        gap={1}
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add Category
        </Button>
      </Box>

      <Box display="flex" gap={1} mb={2} flexWrap="wrap" alignItems="center">
        <FormControl sx={{ minWidth: 130 }} size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.categoryType || ""}
            label="Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              {["Name", "Display Name", "Type", "Actions"].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {categoryStore.loading
              ? Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : categoryStore.allCategoryList.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.displayName}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={pagination.page}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Dialogs */}
      <CategoryFormDialog
        open={dialogFormOpen}
        category={editingCategory}
        onClose={() => {
          setEditingCategory(null);
          setDialogFormOpen(false);
        }}
        onSubmit={handleFormSubmit}
      />
      <DeleteDialog
        open={dialogDeleteOpen}
        onCancel={() => setDialogDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Paper>
  );
}
