import { Chip } from "@mui/material";
import { LEAD_STATUS_COLORS } from "../utils/leadStatus.js";

const StatusBadge = ({
  status = "New",
  size = "small",
  sx,
  variant = "outlined",
}) => {
  const statusName = status;
  const statusColor = LEAD_STATUS_COLORS[statusName] || LEAD_STATUS_COLORS.New;

  return (
    <Chip
      label={statusName}
      size={size}
      color={statusColor.mui}
      variant={variant}
      sx={sx}
    />
  );
};

export default StatusBadge;
