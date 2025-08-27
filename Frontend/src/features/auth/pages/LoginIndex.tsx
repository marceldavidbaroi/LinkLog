// features/auth/pages/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { Person, Lock, Login as LoginIcon } from "@mui/icons-material";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("1234@asdfF");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const { login, loading, error, token } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    // If any error, stop submission
    if (Object.keys(newErrors).length > 0) return;

    await login({ username, password });
  };
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <Card className="w-96 rounded-xl shadow-md">
      <CardContent className="p-6">
        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          className="text-center font-semibold mb-6 text-gray-800"
        >
          Login
        </Typography>

        {/* Server Error */}
        {error && (
          <Typography color="error" className="text-center text-sm mb-4">
            {error}
          </Typography>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          autoComplete="off"
          className="flex flex-col gap-5"
        >
          {/* Username */}
          <TextField
            label="User Name"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" className="text-gray-500" />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" className="text-gray-500" />
                </InputAdornment>
              ),
            }}
          />

          {/* Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<LoginIcon />}
            className="!mt-2 rounded-md font-medium"
            fullWidth
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
