import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { LEAD_STATUS_COLORS } from "../../../utils/leadStatus.js";

const formatTravelDate = (travelDate) => {
  if (!travelDate) return null;

  const date = new Date(`${travelDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecentLeadsList = ({ leads = [], loading = false, error = null }) => {
  const navigate = useNavigate();
  const visibleLeads = leads.slice(0, 5);

  return (
    <Paper
      className="dashboard-panel"
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        minHeight: { xs: "auto", lg: 420 },
        boxSizing: "border-box",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2.5,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Box
        className="dashboard-panel-header"
        sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
      >
        <Typography
          component="h2"
          className="dashboard-card-title"
          sx={{ fontWeight: 600 }}
        >
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
            fontSize: 14,
            lineHeight: 1.25,
          }}
        >
          View all &gt;
        </Button>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 }, flex: 1 }}>
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} sx={{ py: 1 }}>
              <Skeleton variant="text" width="55%" height={20} />
              <Skeleton variant="text" width="65%" height={15} />
              {index < 4 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}

        {!loading && error && (
          <Typography color="error" sx={{ py: 3 }}>
            Unable to load leads: {error}
          </Typography>
        )}

        {!loading && !error && visibleLeads.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 3 }}>
            No leads found
          </Typography>
        )}

        {!loading &&
          !error &&
          visibleLeads.map((lead, index) => {
            const status = lead.status || "New";
            const statusColor =
              LEAD_STATUS_COLORS[status]?.hex || LEAD_STATUS_COLORS.New.hex;
            const travelDate = formatTravelDate(lead.travelDate);

            return (
              <Box key={lead.id || index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                    py: 1.75,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      fontWeight={500}
                      sx={{
                        color: "#0f172a",
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.25,
                      }}
                    >
                      {lead.name || "—"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        color: "#64748b",
                        fontSize: 12,
                        lineHeight: 1.25,
                      }}
                    >
                      {[lead.destination, travelDate]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  </Box>
                  <Chip
                    label={status}
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 0.25,
                      height: 26,
                      flexShrink: 0,
                      borderRadius: "999px",
                      borderColor:
                        statusColor === "#64748b" ? "divider" : statusColor,
                      color: statusColor,
                      bgcolor: "background.paper",
                      "& .MuiChip-label": {
                        px: 1,
                        fontWeight: 500,
                        fontSize: 13,
                      },
                    }}
                  />
                </Box>
                {index < visibleLeads.length - 1 && <Divider />}
              </Box>
            );
          })}
      </Box>
    </Paper>
  );
};

export default RecentLeadsList;
