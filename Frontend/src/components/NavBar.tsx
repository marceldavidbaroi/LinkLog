import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import ThemeSelector from "./ThemeSelector";

export default function NavBar() {
  const { user } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem button component={Link} to="/" onClick={toggleDrawer}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/diary" onClick={toggleDrawer}>
          <ListItemText primary="Diary" />
        </ListItem>
        {user && (
          <>
            <Divider />
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/contact"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Contact" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/logout"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Logout" />
            </ListItem>
            <ListItem>
              <ThemeSelector mobile /> {/* collapsible theme selector */}
            </ListItem>
          </>
        )}
        {!user && (
          <ListItem
            button
            component={Link}
            to="/auth/login"
            onClick={toggleDrawer}
          >
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "#fff", textDecoration: "none" }}
          >
            My App
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Button color="inherit" component={Link} to="/diary">
              Diary
            </Button>

            {user ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenu}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Me
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/contact"
                    onClick={handleClose}
                  >
                    Contact
                  </MenuItem>
                  <MenuItem component={Link} to="/logout" onClick={handleClose}>
                    Logout
                  </MenuItem>
                  <MenuItem>
                    <ThemeSelector />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/auth/login">
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </>
  );
}
