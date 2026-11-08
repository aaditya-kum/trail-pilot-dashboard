import MuiButton from "@mui/material/Button";

const Button = ({ variant = "contained", children, sx, ...props }) => {
  const isSecondary = variant === "secondary";
  const muiVariant = isSecondary ? "outlined" : variant;

  return (
    <MuiButton
      {...props}
      variant={muiVariant}
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
      {children}
    </MuiButton>
  );
};

export default Button;
