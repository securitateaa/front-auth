import React, { useContext } from "react";
import { Card, CardContent, Typography, Grid2, Button } from "@mui/material";
import { AuthContext } from "../../../context/Auth";

const UserRoleCard: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { user, signOut } = authContext;

  return (
    <Grid2 justifyContent="center">
      {user ? (
        <>
          {user.role === "admin" ? (
            <Grid2>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Admin Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome, {user.email}! You have administrative privileges.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ) : (
            <Grid2>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    User Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome, {user.email}! You have standard user access.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          )}
        </>
      ) : (
        <Grid2>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Please log in to access your dashboard.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      )}
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={signOut}
        fullWidth
      >
        Sign out
      </Button>
    </Grid2>
  );
};

export default UserRoleCard;
