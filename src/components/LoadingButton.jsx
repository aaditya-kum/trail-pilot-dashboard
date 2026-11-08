import { Button, CircularProgress } from "@mui/material";

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
