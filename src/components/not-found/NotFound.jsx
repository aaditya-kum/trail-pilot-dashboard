import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../Button.jsx";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: { xs: 4, sm: 6 },
        textAlign: "center",
        borderRadius: 2.5,
      }}
    >
      <Typography
        variant="h1"
        component="p"
        sx={{ fontSize: { xs: 64, sm: 96 }, fontWeight: 800, mb: 1 }}
      >
        404
      </Typography>
      <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to dashboard
      </Button>
    </Paper>
  );
};

export default NotFound;
