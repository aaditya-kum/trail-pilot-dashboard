import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Button from "./Button.jsx";

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
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
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
