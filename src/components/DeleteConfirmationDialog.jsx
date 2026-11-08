import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  title = "Delete item?",
  confirmLabel = "Delete",
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>
        {itemName
          ? `Are you sure you want to delete ${itemName}?`
          : "Are you sure you want to delete this item?"}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
