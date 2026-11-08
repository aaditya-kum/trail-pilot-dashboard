import { Button as MuiButton, CircularProgress } from "@mui/material";

const Button = ({
  variant = "contained",
  children,
  sx,
  loading = false,
  loadingText,
  disabled,
  startIcon,
  ...props
}) => {
  const isSecondary = variant === "secondary";
  const muiVariant = isSecondary ? "outlined" : variant;

  return (
    <MuiButton
      {...props}
      variant={muiVariant}
      disabled={loading || disabled}
      startIcon={
        loading ? <CircularProgress color="inherit" size={16} /> : startIcon
      }
      sx={[
        {
          textTransform: "none",
          fontWeight: 700,
          ...(isSecondary && {
            color: "text.secondary",
            borderColor: "divider",
            bgcolor: "background.paper",
            "&:hover": {
              borderColor: "text.secondary",
              bgcolor: "action.hover",
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export default Button;
