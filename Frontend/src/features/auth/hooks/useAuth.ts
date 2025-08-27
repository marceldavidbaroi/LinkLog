import { loginUser, signupUser } from "../api/authApi";
import useAuthStore from "../store/authStore";
import type { LoginResponse, SignupResponse } from "../types/auth";

export const useAuth = () => {
  const {
    user,
    token,
    refreshToken,
    loading,
    error,
    setUser,
    setToken,
    setRefreshToken,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

  const login = async (payload: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data: LoginResponse = await loginUser(payload);
      console.log(data);
      setUser(data.user);
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data: SignupResponse = await signupUser(payload);
      setUser(data.user);
      setToken(data.token);
      setRefreshToken(data.refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => clearAuth();

  return {
    user,
    token,
    refreshToken,
    loading,
    error,
    login,
    logout,
    signup,
  };
};
