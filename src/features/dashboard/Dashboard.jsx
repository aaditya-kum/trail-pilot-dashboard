import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { DataTable, StatCard } from "../../components";
import { fetchLeads } from "../leads/leadsSlice.js";
import "./dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: leads, loading, error } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const stats = [
    { label: "Leads", value: leads.length, detail: "Today", tone: "blue" },
    { label: "Tasks", value: "18", detail: "6 completed", tone: "purple" },
    { label: "Team members", value: "12", detail: "2 online", tone: "green" },
  ];

  const columns = [
    {
      id: "name",
      label: "Name",
      render: (value) => (
        <Typography fontWeight={700}>{value || "—"}</Typography>
      ),
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
    {
      id: "travelDate",
      label: "Date",
      render: (value) =>
        value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "—",
    },
    { id: "destination", label: "Destination" },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Travel operations workspace</p>
          <h1>Welcome Back Aditya!</h1>
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
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box className="dashboard-panel-header">
          <Typography variant="h6" component="h2">
            Recent leads
          </Typography>
          <Button
            variant="text"
            onClick={() => navigate("/leads")}
            sx={{
              color: "primary.main",
              fontWeight: 700,
              textTransform: "none",
              minWidth: 0,
            }}
          >
            View all &gt;
          </Button>
        </Box>

        <DataTable
          columns={columns}
          rows={leads.slice(0, 5)}
          loading={loading}
          error={error}
          emptyMessage="No leads found"
        />
      </Paper>
    </div>
  );
};

export default Dashboard;
