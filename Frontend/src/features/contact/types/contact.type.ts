// Shape of a user
export interface Person {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  birthday?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Shape of the auth store state
export interface ContactState {
  person: Person | null;
  contactList: Person[]; // use empty array [] instead of null
  loading: boolean;
  error: string | null;

  setPerson: (person: Person | null) => void;
  setContactList: (list: Person[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
