import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function NavBar() {
  const { user, logout } = useAuthStore();

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6">My App</Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
