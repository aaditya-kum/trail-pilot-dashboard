import { DialogTitle, IconButton } from "@mui/material";
import { FiX } from "react-icons/fi";

const DialogHeader = ({ title, onClose, disabled = false }) => (
  <DialogTitle
    sx={{
      fontWeight: 600,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
    }}
  >
    <span>{title}</span>
    <IconButton
      aria-label={`Close ${title}`}
      onClick={onClose}
      disabled={disabled}
      sx={{ ml: "auto" }}
    >
      <FiX />
    </IconButton>
  </DialogTitle>
);

export default DialogHeader;
