import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import Button from "./Button.jsx";
import DialogHeader from "./DialogHeader.jsx";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  title = "Delete item?",
  confirmLabel = "Delete",
  loading = false,
}) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    fullWidth
    maxWidth="xs"
    slotProps={{
      paper: {
        sx: {
          maxHeight: "calc(100dvh - 48px)",
          overflow: "hidden",
          borderRadius: 3,
        },
      },
    }}
  >
    <DialogHeader title={title} onClose={onClose} disabled={loading} />
    <DialogContent sx={{ overflowY: "auto" }}>
      <Typography>
        {itemName
          ? `Are you sure you want to delete ${itemName}?`
          : "Are you sure you want to delete this item?"}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={onConfirm}
        loading={loading}
        loadingText="Deleting..."
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
