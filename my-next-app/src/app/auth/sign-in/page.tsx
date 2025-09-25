"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/features/auth/hooks/useAuth";

const SignInPage = () => {
  const { login, loading, error, token } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("1234@asdfF"); //keep it for dev
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await login({ username, password });
        console.log(response);

        if (response) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Login failed", err);
        // error already handled in useAuth
      }
    }
  };

  // Redirect if token exists (already logged in)
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "transparent" }}
    >
      <Card
        sx={{
          width: 400,
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: 3,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            color="primary"
            fontWeight={600}
            variant="h5"
            textAlign="center"
            mb={3}
          >
            Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              onClick={handleSubmit} // instead of type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Typography variant="body2" textAlign="center" mt={2}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              style={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignInPage;
