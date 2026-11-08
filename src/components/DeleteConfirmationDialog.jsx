import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import LoadingButton from "./LoadingButton.jsx";

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
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <LoadingButton
        color="error"
        variant="contained"
        onClick={onConfirm}
        loading={loading}
        loadingText="Deleting..."
      >
        {confirmLabel}
      </LoadingButton>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
