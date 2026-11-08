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
  FormSelect,
  PackageDialog,
  Pagination,
  SearchBar,
} from "../../components";
import {
  addPackage,
  deletePackage,
  fetchPackages,
  updatePackage,
} from "./packagesSlice.js";
import { formatINR } from "../../utils/formatCurrency.js";
import usePagination from "../../hooks/usePagination.js";
import { useNotification } from "../../providers/NotificationProvider.jsx";
import "../dashboard/dashboard.scss";

const Packages = () => {
  const dispatch = useDispatch();
  const {
    items: packages,
    loading,
    error,
  } = useSelector((state) => state.packages);
  const { showNotification } = useNotification();
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [durationFilter, setDurationFilter] = useState("All");
  const [creatingPackage, setCreatingPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);
  const [viewingDescription, setViewingDescription] = useState(null);
  const [savingPackage, setSavingPackage] = useState(false);
  const [deletingPackageLoading, setDeletingPackageLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const filteredPackages = useMemo(() => {
    const query = search.toLowerCase();
    return packages.filter((travelPackage) => {
      const destination = String(travelPackage.destination || "").toLowerCase();
      const matchesDestination = destination.includes(query);
      const price = Number(travelPackage.price) || 0;
      const duration = Number(travelPackage.duration) || 0;

      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Under 50K" && price < 50000) ||
        (priceFilter === "50K - 1L" && price >= 50000 && price <= 100000) ||
        (priceFilter === "Above 1L" && price > 100000);

      const matchesDuration =
        durationFilter === "All" ||
        (durationFilter === "1 - 3 days" && duration >= 1 && duration <= 3) ||
        (durationFilter === "4 - 7 days" && duration >= 4 && duration <= 7) ||
        (durationFilter === "8+ days" && duration >= 8);

      return matchesDestination && matchesPrice && matchesDuration;
    });
  }, [packages, search, priceFilter, durationFilter]);

  const {
    page: currentPage,
    setPage: setCurrentPage,
    paginatedItems: paginatedPackages,
  } = usePagination(
    filteredPackages,
    pageSize,
    `${search}|${priceFilter}|${durationFilter}`,
  );

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
      render: (value) => (value ? formatINR(value) : "—"),
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

  const getErrorMessage = (error, fallback) =>
    error?.message || (typeof error === "string" ? error : fallback);

  const handleCreate = async (travelPackage) => {
    setSavingPackage(true);
    try {
      await dispatch(addPackage(travelPackage)).unwrap();
      setCreatingPackage(false);
      showNotification("success", "Package created successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to create package"),
      );
    } finally {
      setSavingPackage(false);
    }
  };

  const handleUpdate = async (travelPackage) => {
    setSavingPackage(true);
    try {
      await dispatch(updatePackage(travelPackage)).unwrap();
      setEditingPackage(null);
      showNotification("success", "Package updated successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to update package"),
      );
    } finally {
      setSavingPackage(false);
    }
  };

  const handleDelete = async () => {
    setDeletingPackageLoading(true);
    try {
      await dispatch(deletePackage(deletingPackage.id)).unwrap();
      setDeletingPackage(null);
      showNotification("success", "Package deleted successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to delete package"),
      );
    } finally {
      setDeletingPackageLoading(false);
    }
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, md: 1.5 }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <SearchBar
              name="package-search"
              label="Search packages"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Destination..."
              sx={{ width: { xs: "100%", sm: 200, md: 280 } }}
            />
            <FormSelect
              name="package-price-filter"
              label="Price"
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              options={["All", "Under 50K", "50K - 1L", "Above 1L"]}
              sx={{ width: { xs: "100%", sm: 100, md: 140 } }}
            />
            <FormSelect
              name="package-duration-filter"
              label="Duration"
              value={durationFilter}
              onChange={(event) => setDurationFilter(event.target.value)}
              options={["All", "1 - 3 days", "4 - 7 days", "8+ days"]}
              sx={{ width: { xs: "100%", sm: 100, md: 140 } }}
            />
          </Stack>
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
        loading={savingPackage}
      />
      <PackageDialog
        open={creatingPackage}
        onClose={() => setCreatingPackage(false)}
        onSubmit={handleCreate}
        loading={savingPackage}
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
        loading={deletingPackageLoading}
      />
    </div>
  );
};

export default Packages;
