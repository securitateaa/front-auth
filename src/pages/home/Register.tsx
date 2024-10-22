import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
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
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
    });
const currentPassword= watch("password")
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
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Display Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.displayName}
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
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: "Confirm Password is required",
                                validate: (value, context) =>
                                    value === context.password || "Passwords do not match",
                            }}
                            render={({ field }) => (
                                <>
                                    <TextField
                                        {...field}
                                        label="Confirm Password"
                                        variant="outlined"
                                        type="password"
                                        fullWidth
                                        error={!!errors.confirmPassword}
                                    />
                                    {errors.confirmPassword && (
                                        <p >
                                            {(errors.confirmPassword as FieldError).message}
                                        </p>
                                    )}
                                </>
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
                                    <TextField
                                        {...field}
                                        label="Admin Token"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.adminToken}
                                    />
                                )}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
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
