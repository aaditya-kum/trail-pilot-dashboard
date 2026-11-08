import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  DataTable,
  DeleteConfirmationDialog,
  FormSelect,
  LeadDialog,
  Pagination,
  SearchBar,
  StatusBadge,
} from "../../components";
import { addLead, deleteLead, fetchLeads, updateLead } from "./leadsSlice.js";
import { formatINR } from "../../utils/formatCurrency.js";
import { LEAD_STATUS_OPTIONS } from "../../utils/leadStatus.js";
import usePagination from "../../hooks/usePagination.js";
import { useNotification } from "../../providers/NotificationProvider.jsx";
import "../dashboard/dashboard.scss";

const Leads = () => {
  const dispatch = useDispatch();
  const { items: leads, loading, error } = useSelector((state) => state.leads);
  const { showNotification } = useNotification();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [creatingLead, setCreatingLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [savingLead, setSavingLead] = useState(false);
  const [deletingLeadLoading, setDeletingLeadLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch = [
        lead.name,
        lead.email,
        lead.phone,
        lead.destination,
        lead.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const {
    page: currentPage,
    setPage: setCurrentPage,
    paginatedItems: paginatedLeads,
  } = usePagination(filteredLeads, pageSize, `${search}|${statusFilter}`);

  const getErrorMessage = (error, fallback) =>
    error?.message || (typeof error === "string" ? error : fallback);

  const handleCreate = async (lead) => {
    setSavingLead(true);
    try {
      await dispatch(addLead(lead)).unwrap();
      setCreatingLead(false);
      showNotification("success", "Lead created successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to create lead"),
      );
    } finally {
      setSavingLead(false);
    }
  };

  const handleUpdate = async (lead) => {
    setSavingLead(true);
    try {
      await dispatch(updateLead(lead)).unwrap();
      setEditingLead(null);
      showNotification("success", "Lead updated successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to update lead"),
      );
    } finally {
      setSavingLead(false);
    }
  };

  const handleDelete = async () => {
    setDeletingLeadLoading(true);
    try {
      await dispatch(deleteLead(deletingLead.id)).unwrap();
      setDeletingLead(null);
      showNotification("success", "Lead deleted successfully");
    } catch (error) {
      showNotification(
        "error",
        getErrorMessage(error, "Failed to delete lead"),
      );
    } finally {
      setDeletingLeadLoading(false);
    }
  };

  const columns = [
    {
      id: "name",
      label: "Name",
      render: (value) => (
        <Typography fontWeight={700}>{value || "—"}</Typography>
      ),
    },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "destination", label: "Destination" },
    {
      id: "budget",
      label: "Budget",
      render: (value) =>
        typeof value === "number" ? formatINR(value) : value || "—",
    },
    {
      id: "travelDate",
      label: "Date",
      render: (value) =>
        value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "—",
    },
    {
      id: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (_, lead) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Edit lead">
            <IconButton
              aria-label={`Edit ${lead.name || "lead"}`}
              color="primary"
              size="small"
              onClick={() => setEditingLead({ ...lead })}
            >
              <FiEdit3 />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete lead">
            <IconButton
              aria-label={`Delete ${lead.name || "lead"}`}
              color="error"
              size="small"
              onClick={() => setDeletingLead(lead)}
            >
              <FiTrash2 />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="dashboard-eyebrow">Lead management</p>
          <h1>Leads</h1>
        </div>
        <Button variant="contained" onClick={() => setCreatingLead(true)}>
          Add lead
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
            All leads
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <SearchBar
              name="lead-search"
              label="Search leads"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, destination, status..."
              sx={{ width: { xs: "100%", sm: 280 } }}
            />
            <FormSelect
              name="lead-status-filter"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={["All", ...LEAD_STATUS_OPTIONS]}
              sx={{ width: { xs: "100%", sm: 160 } }}
            />
          </Stack>
        </Box>

        <DataTable
          columns={columns}
          rows={paginatedLeads}
          loading={loading}
          error={error}
          emptyMessage={search ? "No matching leads found" : "No leads found"}
        />
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredLeads.length}
          onPageChange={setCurrentPage}
        />
      </Paper>

      <LeadDialog
        open={Boolean(editingLead)}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        lead={editingLead}
        title="Edit lead"
        submitLabel="Save changes"
        loading={savingLead}
      />
      <LeadDialog
        open={creatingLead}
        onClose={() => setCreatingLead(false)}
        onSubmit={handleCreate}
        loading={savingLead}
      />
      <DeleteConfirmationDialog
        open={Boolean(deletingLead)}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        itemName={deletingLead?.name}
        title="Delete lead?"
        loading={deletingLeadLoading}
      />
    </div>
  );
};

export default Leads;
