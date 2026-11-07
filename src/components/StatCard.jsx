import { Box, Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ label, value, detail, tone = "blue" }) => (
  <Card
    variant="outlined"
    sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)" }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2.5,
        "&:last-child": { pb: 2.5 },
      }}
    >
      <Box
        className={`dashboard-stat-icon dashboard-stat-icon--${tone}`}
        aria-hidden="true"
      >
        {label.charAt(0)}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" component="strong" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block">
          {detail}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
