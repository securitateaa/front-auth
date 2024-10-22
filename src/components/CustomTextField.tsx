import React from "react";
import { TextField, Typography } from "@mui/material";
import { FieldError } from "react-hook-form";

interface CustomTextFieldProps {
  field: any;
  label: string;
  type?: string;
  error?: FieldError | undefined;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  field,
  label,
  type = "text",
  error,
}) => {
  return (
    <>
      <TextField
        {...field}
        label={label}
        variant="outlined"
        type={type}
        fullWidth
        error={!!error}
      />
      {error && (
        <Typography variant="body2" color="error" style={{ marginTop: 4 }}>
          {error.message}
        </Typography>
      )}
    </>
  );
};

export default CustomTextField;
