// Shape of a user
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Shape of the auth store state
export interface AuthState {
  user: User | null;
  token: string | null; // access token in memory
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

// Response shape for login
export interface LoginResponse {
  user: User;
  accessToken: string;
  // refreshToken is not returned to frontend; it's stored as HTTP-only cookie
}
