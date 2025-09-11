export type MoodType = "happy" | "excited" | "neutral" | "sad" | "angry";
export type InteractionTag =
  | "work"
  | "personal"
  | "friendship"
  | "romance"
  | "networking"
  | "family"
  | "other";

// Shape of an interaction
export interface Interaction {
  id: number;
  user_id: number; // the user who created this interaction
  person?: number; // optional, can be unknown
  title: string; // required
  date: Date;
  description: string; // main diary note

  // Contextual info
  context?: string; // e.g., "Met at coffee shop"
  medium?: string; // in-person, call, etc.
  duration_minutes?: number;
  location?: string;

  // Emotional / reflective
  mood?: MoodType;
  energy_level?: number; // 1-10
  person_mood?: string;
  gratitude_level?: number; // 1-10
  reflection?: string;
  takeaways?: string;
  memorable_quote?: string;

  // Engagement / tracking
  fun_factor?: number; // 1-10
  novelty_flag?: boolean;
  mystery_flag?: boolean;
  reminder_at?: Date;
  highlight?: string; // short note about what made it stand out

  // Tags & attachments
  tags?: InteractionTag[];
  attachments?: string[];

  created_at: Date;
  updated_at: Date;
}

// Shape of the interaction store state
export interface InteractionState {
  interaction: Interaction | null;
  interactionList: Interaction[]; // default empty array []
  loading: boolean;
  error: string | null;

  setInteraction: (interaction: Interaction | null) => void;
  setInteractionList: (list: Interaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
