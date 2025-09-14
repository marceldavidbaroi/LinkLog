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
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import ThemeSelector from "./ThemeSelector";

export default function NavBar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElFinance, setAnchorElFinance] = useState<null | HTMLElement>(
    null
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFinanceOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFinance(event.currentTarget);
  };

  const handleFinanceClose = (path?: string) => {
    setAnchorElFinance(null);
    if (path) navigate(path);
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

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
            <Button color="inherit" component={Link} to="/interactions">
              Diary
            </Button>

            {/* New Finance dropdown */}
            <Button color="inherit" onClick={handleFinanceOpen}>
              Finance
            </Button>
            <Menu
              anchorEl={anchorElFinance}
              open={Boolean(anchorElFinance)}
              onClose={() => handleFinanceClose()}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => handleFinanceClose("/finance/dashboard")}
              >
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => handleFinanceClose("/finance/budgets")}>
                Budgets
              </MenuItem>
              <MenuItem
                onClick={() => handleFinanceClose("/finance/savings-goals")}
              >
                Savings Goals
              </MenuItem>
              <MenuItem onClick={() => handleFinanceClose("/finance/reports")}>
                Reports
              </MenuItem>
            </Menu>

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
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem component={Link} to="/me" onClick={handleClose}>
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
    </>
  );
}
