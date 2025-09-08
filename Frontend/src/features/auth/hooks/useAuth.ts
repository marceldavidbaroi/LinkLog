import type { ApiResponse } from "../../../types/api-response.type";
import { loginUser, signupUser } from "../api/authApi";
import useAuthStore from "../store/authStore";
import type { LoginResponse } from "../types/auth";

export const useAuth = () => {
  const {
    user,
    token,
    loading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

  // helper to handle API calls with loading and error
  const handleAuthRequest = async (
    request: () => ApiResponse<LoginResponse>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await request();
      console.log(data);
      setUser(data?.data?.user);
      setToken(data?.data?.accessToken); // store access token in memory
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err; // rethrow so caller can handle if needed
    } finally {
      setLoading(false);
    }
  };

  const login = (payload: { username: string; password: string }) =>
    handleAuthRequest(() => loginUser(payload));

  const signup = (payload: { username: string; password: string }) =>
    handleAuthRequest(() => signupUser(payload));

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // clear HTTP-only cookie
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      clearAuth();
    }
  };

  return { user, token, loading, error, login, signup, logout };
};
