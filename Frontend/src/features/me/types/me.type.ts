export interface Me {
  id: string;
  email: string;
  username: string;
  preferences: Preference;
}

export interface Preference {
  frontend?: Record<string, unknown> | null;
  backend?: Record<string, unknown> | null;
}

export interface MeState {
  me: Me | null;
  loading: boolean;
  error: string | null;

  setMe: (me: Me | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePreferences: (preferences: Partial<Me["preferences"]>) => void;
}
