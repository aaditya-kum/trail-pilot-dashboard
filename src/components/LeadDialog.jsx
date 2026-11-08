import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack, Grid } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput.jsx";
import FormSelect from "./FormSelect.jsx";
import LoadingButton from "./LoadingButton.jsx";
import { LEAD_STATUS_OPTIONS } from "../utils/leadStatus.js";

const EMPTY_LEAD = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  budget: "",
  travelDate: "",
  status: "New",
};

const leadValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\-()\s]+$/, "Enter a valid phone number")
    .required("Phone is required"),
  destination: Yup.string().trim().required("Destination is required"),
  budget: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .nullable()
    .typeError("Budget must be a number")
    .min(0, "Budget cannot be negative")
    .required("Budget is required"),
  travelDate: Yup.date()
    .transform((value, original) => (original === "" ? null : value))
    .nullable()
    .typeError("Enter a valid date")
    .required("Travel date is required"),
  status: Yup.string().trim().required("Status is required"),
});

const LeadDialog = ({
  open,
  onClose,
  onSubmit,
  lead = null,
  title = "Add lead",
  submitLabel = "Create lead",
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <Formik
        key={`${title}-${open}-${lead?.id || ""}`}
        enableReinitialize
        initialValues={lead ? { ...EMPTY_LEAD, ...lead } : EMPTY_LEAD}
        validationSchema={leadValidationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          submitCount,
          isSubmitting,
        }) => {
          const fieldProps = (name, label, extraProps = {}) => ({
            name,
            label,
            value: values[name],
            onChange: handleChange,
            onBlur: handleBlur,
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
                      <FormInput {...fieldProps("name", "Name")} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        {...fieldProps("email", "Email", { type: "email" })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput {...fieldProps("phone", "Phone")} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        {...fieldProps("destination", "Destination")}
                      />
                    </Grid>
                  </Grid>
                  <FormSelect
                    {...fieldProps("status", "Status", {
                      options: LEAD_STATUS_OPTIONS,
                    })}
                  />
                  <FormInput
                    {...fieldProps("budget", "Budget", { type: "number" })}
                  />
                  <FormInput
                    {...fieldProps("travelDate", "Travel date", {
                      type: "date",
                      slotProps: { inputLabel: { shrink: true } },
                    })}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                  loadingText="Saving..."
                  disabled={isSubmitting}
                >
                  {submitLabel}
                </LoadingButton>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default LeadDialog;
