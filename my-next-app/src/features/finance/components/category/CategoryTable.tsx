"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Skeleton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import {
  Add as AddIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";

import CategoryFormDialog from "./CategoryFormDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useCategory } from "@/features/finance/hooks/categoryAuth";
import { useCategoryStore } from "@/features/finance/store/categoryStore";

export default function CategoryTable() {
  const categoryStore = useCategoryStore();
  const { getAll, create, update, remove, getStats } = useCategory();

  const [filters, setFilters] = useState<{
    categoryType?: "income" | "expense";
    ownership?: "system" | "user";
  }>({});
  const [dialogFormOpen, setDialogFormOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const fetchCategories = async () => {
    const response = await getAll(filters);
    categoryStore.setCategoryList(response || []);
  };

  const getCategoryStatus = async () => {
    await getStats();
    console.log("category", categoryStore.categoryStatus);
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  useEffect(() => {
    getCategoryStatus();
  }, []);

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

  const handleTypeFilterChange = (type?: "income" | "expense") => {
    setFilters((prev) => ({ ...prev, categoryType: type }));
  };

  const handleOwnershipFilterChange = (ownership?: "system" | "user") => {
    setFilters((prev) => ({ ...prev, ownership }));
  };

  return (
    <Paper
      sx={{ width: "100%", p: 2, boxShadow: "none", bgcolor: "transparent" }}
    >
      {/* Header with Add Button and Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={2}
        flexWrap="wrap"
        gap={1}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add Category
        </Button>
        <Box display="flex" gap={1} flexWrap="wrap">
          {categoryStore.loading ? (
            // Show skeletons instead of buttons
            <>
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={120} height={36} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </>
          ) : (
            <>
              {/* Type Filter */}
              <ButtonGroup>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleTypeFilterChange(undefined)}
                  sx={{
                    backgroundColor:
                      filters.categoryType === undefined
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.categoryType === undefined ? "bold" : undefined,
                    color:
                      filters.categoryType === undefined ? "white" : undefined,
                  }}
                >
                  All Types
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleTypeFilterChange("income")}
                  sx={{
                    backgroundColor:
                      filters.categoryType === "income"
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.categoryType === "income" ? "bold" : undefined,
                    color:
                      filters.categoryType === "income" ? "white" : undefined,
                  }}
                >
                  Income
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleTypeFilterChange("expense")}
                  sx={{
                    backgroundColor:
                      filters.categoryType === "expense"
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.categoryType === "expense" ? "bold" : undefined,
                    color:
                      filters.categoryType === "expense" ? "white" : undefined,
                  }}
                >
                  Expense
                </Button>
              </ButtonGroup>

              {/* Ownership Filter */}
              <ButtonGroup>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOwnershipFilterChange(undefined)}
                  sx={{
                    backgroundColor:
                      filters.ownership === undefined
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.ownership === undefined ? "bold" : undefined,
                    color:
                      filters.ownership === undefined ? "white" : undefined,
                  }}
                >
                  All Ownership
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOwnershipFilterChange("system")}
                  sx={{
                    backgroundColor:
                      filters.ownership === "system"
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.ownership === "system" ? "bold" : undefined,
                    color: filters.ownership === "system" ? "white" : undefined,
                  }}
                >
                  System
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOwnershipFilterChange("user")}
                  sx={{
                    backgroundColor:
                      filters.ownership === "user"
                        ? "secondary.main"
                        : undefined,
                    fontWeight:
                      filters.ownership === "user" ? "bold" : undefined,
                    color: filters.ownership === "user" ? "white" : undefined,
                  }}
                >
                  User
                </Button>
              </ButtonGroup>
            </>
          )}
        </Box>
      </Box>

      {/* Category Table */}
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
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : categoryStore.allCategoryList.map((row) => {
                  const isSystemCategory = !row.user;
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.displayName}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            isSystemCategory
                              ? "Cannot edit system category"
                              : "Edit"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={isSystemCategory}
                              onClick={() => handleEditClick(row)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={
                            isSystemCategory
                              ? "Cannot delete system category"
                              : "Delete"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={isSystemCategory}
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

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
