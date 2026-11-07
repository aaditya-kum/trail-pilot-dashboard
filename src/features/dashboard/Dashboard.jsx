import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { DataTable, FormInput, StatCard } from "../../components";
import { fetchLeads } from "../leads/leadsSlice.js";
import "./dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: leads, loading, error } = useSelector((state) => state.leads);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const stats = [
    {
      label: "Leads",
      value: String(leads.length),
      detail: "From API",
      tone: "blue",
    },
    { label: "Tasks", value: "18", detail: "6 completed", tone: "purple" },
    { label: "Team members", value: "12", detail: "2 online", tone: "green" },
  ];

  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase();
    return [
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
  });

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
        typeof value === "number"
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value)
          : value || "—",
    },
    {
      id: "travelDate",
      label: "Travel Date",
      render: (value) =>
        value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "—",
    },
    {
      id: "status",
      label: "Status",
      render: (value) => (
        <Chip
          label={value || "New"}
          size="small"
          color={
            value === "Converted"
              ? "success"
              : value === "Lost"
                ? "error"
                : "primary"
          }
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <Button variant="contained" onClick={() => navigate("/projects")}>
          View projects
        </Button>
      </header>

      <Box
        className="dashboard-stats"
        component="section"
        aria-label="Dashboard summary"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <Paper
        className="dashboard-panel"
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          className="dashboard-panel-header"
          sx={{ borderRadius: "16px 16px 0 0" }}
        >
          <Box>
            <Typography variant="h6" component="h2">
              Recent leads
            </Typography>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 280 } }}>
            <FormInput
              name="lead-search"
              label="Search leads"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, status..."
            />
          </Box>
        </Box>

        <DataTable
          columns={columns}
          rows={filteredLeads}
          loading={loading}
          error={error}
          emptyMessage={search ? "No matching leads found" : "No leads found"}
        />
      </Paper>
    </div>
  );
};

export default Dashboard;
