import { TextField } from "@mui/material";

const FormInput = ({ name, label, value, onChange, type = "text", ...props }) => (
  <TextField
    id={name}
    name={name}
    label={label}
    value={value ?? ""}
    onChange={onChange}
    type={type}
    fullWidth
    variant="outlined"
    size="small"
    {...props}
  />
);

export default FormInput;
