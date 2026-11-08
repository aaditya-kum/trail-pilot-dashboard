import { CircularProgress } from "@mui/material";
import Button from "./Button.jsx";

const LoadingButton = ({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}) => (
  <Button
    {...props}
    disabled={loading || disabled}
    startIcon={
      loading ? <CircularProgress color="inherit" size={16} /> : props.startIcon
    }
  >
    {loading && loadingText ? loadingText : children}
  </Button>
);

export default LoadingButton;
