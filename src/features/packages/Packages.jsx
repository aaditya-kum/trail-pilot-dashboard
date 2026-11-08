import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  DataTable,
  DeleteConfirmationDialog,
  FormInput,
  PackageDialog,
  Pagination,
} from "../../components";
import {
  addPackage,
  deletePackage,
  fetchPackages,
  updatePackage,
} from "./packagesSlice.js";
import { formatINR } from "../../utils/formatCurrency.js";
import usePagination from "../../hooks/usePagination.js";
import "../dashboard/dashboard.scss";

const Packages = () => {
  const dispatch = useDispatch();
  const {
    items: packages,
    loading,
    error,
  } = useSelector((state) => state.packages);
  const [search, setSearch] = useState("");
  const [creatingPackage, setCreatingPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);
  const [viewingDescription, setViewingDescription] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const filteredPackages = useMemo(() => {
    const query = search.toLowerCase();
    return packages.filter((travelPackage) =>
      [
        travelPackage.name,
        travelPackage.destination,
        travelPackage.description,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [packages, search]);

  const {
    page: currentPage,
    setPage: setCurrentPage,
    paginatedItems: paginatedPackages,
  } = usePagination(filteredPackages, pageSize, search);

  const columns = [
    {
      id: "image",
      label: "Image",
      render: (value, travelPackage) => (
        <Avatar
          src={value}
          alt={travelPackage.name}
          variant="rounded"
          sx={{ width: 64, height: 44 }}
        />
      ),
    },
    {
      id: "name",
      label: "Name",
      render: (value) => (
        <Typography fontWeight={700}>{value || "—"}</Typography>
      ),
    },
    { id: "destination", label: "Destination" },
    {
      id: "price",
      label: "Price",
      render: (value) =>
        typeof value === "number"
          ? formatINR(value)
          : value || "—",
    },
    {
      id: "duration",
      label: "Duration",
      render: (value) => (value ? `${value} days` : "—"),
    },
    {
      id: "description",
      label: "Description",
      render: (value, travelPackage) => {
        const description = String(value || "—");
        const preview =
          description.length > 50
            ? `${description.slice(0, 50).trimEnd()}...`
            : description;

        if (!value) return "—";

        return (
          <Tooltip title="View full description">
            <Link
              component="button"
              type="button"
              underline="hover"
              color="text.primary"
              onClick={() => setViewingDescription(travelPackage)}
              sx={{
                maxWidth: 220,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {preview}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (_, travelPackage) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Edit package">
            <IconButton
              aria-label={`Edit ${travelPackage.name || "package"}`}
              color="primary"
              size="small"
              onClick={() => setEditingPackage({ ...travelPackage })}
            >
              <FiEdit3 />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete package">
            <IconButton
              aria-label={`Delete ${travelPackage.name || "package"}`}
              color="error"
              size="small"
              onClick={() => setDeletingPackage(travelPackage)}
            >
              <FiTrash2 />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleCreate = (travelPackage) => {
    dispatch(addPackage(travelPackage));
    setCreatingPackage(false);
  };

  const handleUpdate = (travelPackage) => {
    dispatch(updatePackage(travelPackage));
    setEditingPackage(null);
  };

  const handleDelete = () => {
    dispatch(deletePackage(deletingPackage.id));
    setDeletingPackage(null);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="dashboard-eyebrow">Travel inventory</p>
          <h1>Packages</h1>
        </div>
        <Button variant="contained" onClick={() => setCreatingPackage(true)}>
          Add package
        </Button>
      </header>

      <Paper
        className="dashboard-panel"
        variant="outlined"
        sx={{
          borderRadius: 2.5,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box className="dashboard-panel-header" sx={{ pb: 0 }}>
          <Typography variant="h6" component="h2">
            All packages
          </Typography>
          <Box sx={{ width: { xs: "100%", sm: 280 } }}>
            <FormInput
              name="package-search"
              label="Search packages"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, destination..."
            />
          </Box>
        </Box>

        <DataTable
          columns={columns}
          rows={paginatedPackages}
          loading={loading}
          error={error}
          emptyMessage={
            search ? "No matching packages found" : "No packages found"
          }
        />
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredPackages.length}
          onPageChange={setCurrentPage}
        />
      </Paper>

      <PackageDialog
        open={Boolean(editingPackage)}
        onClose={() => setEditingPackage(null)}
        onSubmit={handleUpdate}
        travelPackage={editingPackage}
        title="Edit package"
        submitLabel="Save changes"
      />
      <PackageDialog
        open={creatingPackage}
        onClose={() => setCreatingPackage(false)}
        onSubmit={handleCreate}
      />
      <Dialog
        open={Boolean(viewingDescription)}
        onClose={() => setViewingDescription(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {viewingDescription?.name || "Package description"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {viewingDescription?.description || "—"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingDescription(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmationDialog
        open={Boolean(deletingPackage)}
        onClose={() => setDeletingPackage(null)}
        onConfirm={handleDelete}
        itemName={deletingPackage?.name}
        title="Delete package?"
      />
    </div>
  );
};

export default Packages;
