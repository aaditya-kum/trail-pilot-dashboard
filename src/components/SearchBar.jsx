import { InputAdornment } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import FormInput from "./FormInput.jsx";

const SearchBar = ({
  name,
  label = "Search",
  value,
  onChange,
  placeholder,
  sx,
}) => (
  <FormInput
    name={name}
    label={label}
    value={value ?? ""}
    onChange={onChange}
    placeholder={placeholder}
    sx={sx}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <FiSearch aria-hidden="true" />
          </InputAdornment>
        ),
      },
    }}
  />
);

export default SearchBar;
