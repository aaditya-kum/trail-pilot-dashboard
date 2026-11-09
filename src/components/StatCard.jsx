import { Box, Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ label, value, detail, tone = "blue", icon: Icon }) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      borderRadius: 2,
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
        boxSizing: "border-box",
        p: 2.5,
        "&:last-child": { pb: 2.5 },
      }}
    >
      <Box
        className={`dashboard-stat-icon dashboard-stat-icon--${tone}`}
        aria-hidden="true"
      >
        {Icon ? <Icon /> : label.charAt(0)}
      </Box>
      <Box>
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography
          component="strong"
          sx={{
            display: "block",
            mt: 0.75,
            mr: 1,
            color: "#0f172a",
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.025em",
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            mt: 0.25,
            color: "#64748b",
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.25,
          }}
        >
          {detail}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
