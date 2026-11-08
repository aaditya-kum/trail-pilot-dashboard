import { MenuItem, TextField } from "@mui/material";

const FormSelect = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  options,
  error = false,
  helperText,
  ...props
}) => (
  <TextField
    id={name}
    name={name}
    label={label}
    value={value ?? ""}
    onChange={onChange}
    onBlur={onBlur}
    select
    fullWidth
    variant="outlined"
    size="small"
    error={error}
    helperText={helperText}
    {...props}
  >
    {options.map((option) => {
      const optionValue = typeof option === "string" ? option : option.value;
      const optionLabel = typeof option === "string" ? option : option.label;

      return (
        <MenuItem key={optionValue} value={optionValue}>
          {optionLabel}
        </MenuItem>
      );
    })}
  </TextField>
);

export default FormSelect;
