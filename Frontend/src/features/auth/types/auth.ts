// Shape of a user
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Shape of the auth store state
export interface AuthState {
  user: User | null;
  token: string | null; // access token
  refreshToken: string | null; // refresh token
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// export interface SignupResponse {
//   user: User;
//   token: string;
//   refreshToken: string;
// }
