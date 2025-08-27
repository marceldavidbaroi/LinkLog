import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import ThemeSelector from "../../../components/ThemeSelector";
import useAuthStore from "../../auth/store/authStore";

export default function DashboardIndex() {
  const user = useAuthStore((state) => state.user);
  console.log(user);

  return (
    <Box
      component={Paper}
      elevation={3}
      className=" min-h-screen p-6 bg-[var(--background)] text-[var(--text)]"
    >
      {user?.username}
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Hello, welcome to your Dashboard!
        </Typography>

        {/* Theme selector */}
        <ThemeSelector />
      </Box>

      {/* Stats cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
        gap={3}
        mb={4}
      >
        <Card className="bg-[var(--surface)] shadow-md">
          <CardContent>
            <Typography variant="subtitle1">Projects</Typography>
            <Typography variant="h5" mt={1}>
              5
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)] shadow-md">
          <CardContent>
            <Typography variant="subtitle1">Users</Typography>
            <Typography variant="h5" mt={1}>
              12
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)] shadow-md">
          <CardContent>
            <Typography variant="subtitle1">Revenue</Typography>
            <Typography variant="h5" mt={1}>
              $1,200
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Placeholder content */}
      <Card className="bg-[var(--surface)] shadow-md p-4">
        <Typography>
          This is your dummy dashboard. You can add charts, tables, and other
          widgets here later.
        </Typography>
        <Button variant="contained" color="primary" className="mt-4">
          Get Started
        </Button>
      </Card>
    </Box>
  );
}
