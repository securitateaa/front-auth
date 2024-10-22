import React, { useContext, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../context/Auth";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signIn, authError, setAuthError, user } = authContext;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  useLayoutEffect(() => {
    const params = location.state as { error?: string };
    if (params?.error) setAuthError(params.error);
    if (user) {
      navigate("/");
    }
  }, [location.state, setAuthError, user]);

  const onSubmit = async (data: any) => {
    try {
      await signIn(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unknown error occurred.");
      }
    }
  };
  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
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
                <TextField
                  {...field}
                  label="E-mail"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
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
                <TextField
                  {...field}
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
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
        First time here?{" "}
        <span
          style={{ color: "#006D80", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </Typography>
    </Container>
  );
};

export default Login;
