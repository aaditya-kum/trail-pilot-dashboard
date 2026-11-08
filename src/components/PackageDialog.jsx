import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput.jsx";

const EMPTY_PACKAGE = {
  name: "",
  destination: "",
  price: "",
  duration: "",
  description: "",
  image: "",
};

const packageValidationSchema = Yup.object({
  name: Yup.string().trim().required("Package name is required"),
  destination: Yup.string().trim().required("Destination is required"),
  price: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  duration: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Duration must be a number")
    .integer("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .required("Duration is required"),
  description: Yup.string().trim().required("Description is required"),
  image: Yup.string().trim().url("Enter a valid image URL").required("Image URL is required"),
});

const PackageDialog = ({
  open,
  onClose,
  onSubmit,
  travelPackage = null,
  title = "Add package",
  submitLabel = "Create package",
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <Formik
      key={`${title}-${open}-${travelPackage?.id ?? travelPackage?._id ?? ""}`}
      enableReinitialize
      initialValues={travelPackage ? { ...EMPTY_PACKAGE, ...travelPackage } : EMPTY_PACKAGE}
      validationSchema={packageValidationSchema}
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
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput {...fieldProps("name", "Package name")} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput {...fieldProps("destination", "Destination")} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput {...fieldProps("price", "Price", { type: "number" })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput {...fieldProps("duration", "Duration (days)", { type: "number" })} />
                  </Grid>
                </Grid>
                <FormInput {...fieldProps("image", "Image URL")} />
                <FormInput
                  {...fieldProps("description", "Description", {
                    multiline: true,
                    minRows: 3,
                  })}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </DialogActions>
          </form>
        );
      }}
    </Formik>
  </Dialog>
);

export default PackageDialog;
