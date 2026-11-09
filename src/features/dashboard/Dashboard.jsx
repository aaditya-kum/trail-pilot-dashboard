import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {
  FiBriefcase,
  FiMapPin,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { Button, StatCard } from "../../components";
import { fetchLeads } from "../leads/leadsSlice.js";
import BookingTrendsChart from "./components/BookingTrendsChart.jsx";
import RecentLeadsList from "./components/RecentLeadsList.jsx";
import { formatINR } from "../../utils/formatCurrency.js";
import { parseDate } from "../../utils/formatDate.js";
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
      icon: FiUsers,
    },
    {
      label: "Active Bookings",
      value: leads.filter((lead) => lead.status === "Converted").length,
      detail: "Converted leads",
      tone: "purple",
      icon: FiBriefcase,
    },
    {
      label: "Total Revenue",
      value: formatINR(
        leads
          .filter((lead) => lead.status === "Converted")
          .reduce((total, lead) => total + (Number(lead.budget) || 0), 0),
      ),
      detail: "From converted leads",
      tone: "green",
      icon: MdCurrencyRupee,
    },
    {
      label: "Upcoming Trips",
      value: leads.filter((lead) => {
        if (lead.status !== "Converted" || !lead.travelDate) return false;
        const travelDate = parseDate(lead.travelDate);
        if (!travelDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return travelDate > today;
      }).length,
      detail: "Trips after today",
      tone: "blue",
      icon: FiMapPin,
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Travel operations workspace</p>
          <h1>Welcome Back Aditya!</h1>
        </div>
        <div className="dashboard-header-actions" aria-label="Account options">
          <button
            className="dashboard-settings-button"
            type="button"
            aria-label="Settings"
          >
            <FiSettings aria-hidden="true" />
          </button>
          <button
            className="dashboard-user-button"
            type="button"
            aria-label="User profile"
          >
            <FiUser aria-hidden="true" />
          </button>
          <Button
            variant="contained"
            onClick={() => navigate("/packages")}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            View packages
          </Button>
        </div>
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
          alignItems: "stretch",
          minHeight: { xs: "auto", lg: 420 },
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
