import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Grid,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useForm, Controller, FieldError } from "react-hook-form";
import { AuthContext } from "../../context/Auth";
import CustomTextField from "../../components/CustomTextField";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signUp, authError, setAuthError } = authContext;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await signUp({
        ...data,
        adminToken: isAdmin ? data.adminToken : undefined,
      });
      navigate("/");
    } catch (error) {
      const typedError = error as { message: string };
      setAuthError(typedError.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="displayName"
              control={control}
              rules={{
                required: "Display Name is required",
                min: 5,
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  label="Display Name"
                  error={errors.displayName as FieldError}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "E-mail is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "E-mail is not valid",
                },
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  label="E-mail"
                  error={errors.email as FieldError}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  label="Password"
                  type="password"
                  error={errors.password as FieldError}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value, context) =>
                  value === context.password || "Passwords do not match",
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  type="password"
                  label="Confirm Password"
                  error={errors.confirmPassword as FieldError}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAdmin}
                  onChange={(event) => {
                    setIsAdmin(event.target.checked);
                  }}
                />
              }
              label="Enable Admin Token"
            />
          </Grid>
          {isAdmin && (
            <Grid item xs={12}>
              <Controller
                name="adminToken"
                control={control}
                rules={{
                  required: "Admin Token is required if enabled",
                }}
                render={({ field }) => (
                  <CustomTextField
                    field={field}
                    label="Admin Token"
                    error={errors.adminToken as FieldError}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      {authError && (
        <Snackbar
          open={!!authError}
          autoHideDuration={6000}
          onClose={() => setAuthError("")}
        >
          <Alert
            onClose={() => setAuthError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {authError}
          </Alert>
        </Snackbar>
      )}

      <Typography variant="body2" style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <span
          style={{ color: "#006D80", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </Typography>
    </Container>
  );
};

export default Register;
