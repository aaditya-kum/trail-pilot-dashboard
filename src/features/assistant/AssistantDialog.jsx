import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { FiCopy } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormInput, FormSelect, StatusBadge } from "../../components";
import { useNotification } from "../../providers/NotificationProvider.jsx";
import { LEAD_STATUS_OPTIONS } from "../../utils/leadStatus.js";
import { CHANNEL_OPTIONS, TONE_OPTIONS } from "./assistantService.js";
import {
  generateMessage,
  resetAssistant,
  updateDraft,
} from "./assistantSlice.js";

const validationSchema = Yup.object({
  name: Yup.string().trim().max(80, "Name is too long"),
  destination: Yup.string()
    .trim()
    .max(80, "Destination is too long")
    .required("Destination is required"),
  budget: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .nullable()
    .typeError("Budget must be a number")
    .min(0, "Budget cannot be negative"),
  travelDate: Yup.date()
    .transform((value, original) => (original === "" ? null : value))
    .nullable()
    .typeError("Enter a valid date"),
  tone: Yup.string().required("Tone is required"),
  channel: Yup.string().required("Channel is required"),
  status: Yup.string().required("Status is required"),
});

const getInitialValues = (lead) => ({
  name: lead?.name || "",
  destination: lead?.destination || "",
  budget: lead?.budget ?? "",
  travelDate: lead?.travelDate ? String(lead.travelDate).slice(0, 10) : "",
  tone: TONE_OPTIONS[0],
  channel: CHANNEL_OPTIONS[0],
  status: lead?.status || "New",
});

const getErrorMessage = (error, fallback) =>
  error?.message || (typeof error === "string" ? error : fallback);

const AssistantDialog = ({ open, onClose, lead = null }) => {
  const dispatch = useDispatch();
  const { status, message, error } = useSelector((state) => state.assistant);
  const { showNotification } = useNotification();

  const isLoading = status === "loading";
  const hasResult = status === "succeeded" || (status === "failed" && message);

  const handleClose = () => {
    dispatch(resetAssistant());
    onClose();
  };

  const handleGenerate = async ({ tone, channel, status, ...details }) => {
    try {
      await dispatch(
        generateMessage({
          details,
          status,
          tone,
          channel,
        }),
      ).unwrap();
    } catch (err) {
      showNotification(
        "error",
        getErrorMessage(err, "Failed to generate message"),
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      showNotification("success", "Message copied");
    } catch {
      showNotification(
        "error",
        "Could not copy. Please copy the text manually.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Follow-up assistant</DialogTitle>
      <Formik
        key={`${open}-${lead?.id || "new"}`}
        initialValues={getInitialValues(lead)}
        validationSchema={validationSchema}
        onSubmit={handleGenerate}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          submitCount,
        }) => {
          const fieldProps = (name, label, extraProps = {}) => ({
            name,
            label,
            value: values[name],
            onChange: handleChange,
            onBlur: handleBlur,
            disabled: isLoading,
            error: (touched[name] || submitCount > 0) && Boolean(errors[name]),
            helperText: (touched[name] || submitCount > 0) && errors[name],
            ...extraProps,
          });

          return (
            <form onSubmit={handleSubmit} noValidate>
              <DialogContent>
                <Stack spacing={3}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput {...fieldProps("name", "Customer name")} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        {...fieldProps("destination", "Destination")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        {...fieldProps("budget", "Budget", { type: "number" })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        {...fieldProps("travelDate", "Travel date", {
                          type: "date",
                          slotProps: { inputLabel: { shrink: true } },
                        })}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormSelect
                        {...fieldProps("status", "Status", {
                          options: LEAD_STATUS_OPTIONS,
                        })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormSelect
                        {...fieldProps("tone", "Tone", {
                          options: TONE_OPTIONS,
                        })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormSelect
                        {...fieldProps("channel", "Channel", {
                          options: CHANNEL_OPTIONS,
                        })}
                      />
                    </Grid>
                  </Grid>

                  {status === "failed" && (
                    <Alert
                      severity="error"
                      action={
                        <Button
                          variant="text"
                          color="inherit"
                          size="small"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          Try again
                        </Button>
                      }
                    >
                      {error}
                    </Alert>
                  )}

                  {hasResult && (
                    <Stack spacing={1}>
                      <FormInput
                        name="message"
                        label="Suggested message (editable)"
                        value={message}
                        onChange={(event) =>
                          dispatch(updateDraft(event.target.value))
                        }
                        multiline
                        minRows={8}
                        disabled={isLoading}
                        helperText={
                          values.channel === "WhatsApp"
                            ? `${message.length} characters`
                            : undefined
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        AI-generated draft. Please review and edit before
                        sending.
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant={hasResult ? "secondary" : "contained"}
                  loading={isLoading}
                  loadingText="Generating..."
                >
                  {hasResult ? "Regenerate" : "Generate message"}
                </Button>
                {hasResult && (
                  <Button
                    variant="contained"
                    startIcon={<FiCopy />}
                    onClick={handleCopy}
                    disabled={isLoading || !message.trim()}
                  >
                    Copy message
                  </Button>
                )}
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default AssistantDialog;
