import { useMemo } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LINE_COLOR = "#2563eb";
const MONTHS_BACK = 2; // how many past months to show
const MONTHS_AHEAD = 3; // how many upcoming months to show

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

// Builds [{ key, label, bookings }, ...] for the visible months
const getChartData = (leads) => {
  const today = new Date();
  const months = [];

  for (let i = -MONTHS_BACK; i <= MONTHS_AHEAD; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({
      key: getMonthKey(date),
      label: date.toLocaleString("en-US", { month: "short" }),
      bookings: 0,
    });
  }

  // Count only Converted leads, grouped by travel month
  leads.forEach((lead) => {
    if (lead.status !== "Converted" || !lead.travelDate) return;
    const month = months.find(
      (m) => m.key === String(lead.travelDate).slice(0, 7),
    );
    if (month) month.bookings += 1;
  });

  return months;
};

const BookingTrendsChart = ({ leads = [], loading = false }) => {
  const data = useMemo(() => getChartData(leads), [leads]);

  return (
    <Box
      component="section"
      aria-label="Booking trends"
      sx={{
        height: "100%",
        minHeight: { xs: 340, lg: 420 },
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        bgcolor: "background.paper",
        p: { xs: 2, sm: 3 },
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Typography
        component="h2"
        className="dashboard-card-title"
        sx={{ fontWeight: 600, mb: 4 }}
      >
        Monthly Booking Trends
      </Typography>

      {loading ? (
        <Skeleton variant="rounded" height={260} />
      ) : (
        <Box sx={{ flex: 1, minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                width={32}
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [value, "Bookings"]} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke={LINE_COLOR}
                strokeWidth={3}
                dot={{ r: 4, fill: LINE_COLOR, stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default BookingTrendsChart;
