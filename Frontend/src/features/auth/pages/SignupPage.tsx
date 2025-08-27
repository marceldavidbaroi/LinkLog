import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const { signup, error, loading } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: {
      username?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // TODO: call your signup API
    await signup({ username, password });
    if (!error) {
      navigate("/auth/login");
    }
  };

  return (
    <Card className="w-96 rounded-xl shadow-md">
      <CardContent className="p-6">
        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          className="text-center font-semibold mb-6 text-gray-800"
        >
          Sign Up
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
          onSubmit={handleSignup}
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

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
            className="!mt-2 rounded-md font-medium flex justify-center items-center"
            fullWidth
          >
            {loading ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
