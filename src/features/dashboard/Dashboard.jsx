import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { StatCard } from "../../components";
import { fetchLeads } from "../leads/leadsSlice.js";
import BookingTrendsChart from "./components/BookingTrendsChart.jsx";
import RecentLeadsList from "./components/RecentLeadsList.jsx";
import "./dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: leads, loading, error } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      detail: "All leads",
      tone: "blue",
    },
    {
      label: "Active Bookings",
      value: leads.filter((lead) => lead.status === "Converted").length,
      detail: "Converted leads",
      tone: "purple",
    },
    {
      label: "Total Revenue",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(
        leads
          .filter((lead) => lead.status === "Converted")
          .reduce((total, lead) => total + (Number(lead.budget) || 0), 0),
      ),
      detail: "From converted leads",
      tone: "green",
    },
    {
      label: "Upcoming Trips",
      value: leads.filter((lead) => {
        if (lead.status !== "Converted" || !lead.travelDate) return false;
        const travelDate = new Date(`${lead.travelDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return travelDate > today;
      }).length,
      detail: "Trips after today",
      tone: "blue",
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Travel operations workspace</p>
          <h1>Welcome Back Aditya!</h1>
        </div>
        <Button variant="contained" onClick={() => navigate("/packages")}>
          View packages
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 3fr) minmax(0, 2fr)",
          },
          alignItems: "start",
          gap: 3,
        }}
      >
        <BookingTrendsChart leads={leads} loading={loading} />

        <RecentLeadsList leads={leads} loading={loading} error={error} />
      </Box>
    </div>
  );
};

export default Dashboard;
