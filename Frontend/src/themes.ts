export type ThemeConfig = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    error: string;
  };
};

export const themes: ThemeConfig[] = [
  {
    name: "light",
    colors: {
      primary: "#2563EB", // blue
      secondary: "#9333EA", // purple
      accent: "#F59E0B", // amber
      background: "#F9FAFB",
      surface: "#FFFFFF",
      text: "#111827",
      error: "#DC2626",
    },
  },
  {
    name: "dark",
    colors: {
      primary: "#3B82F6",
      secondary: "#A855F7",
      accent: "#FBBF24",
      background: "#111827",
      surface: "#1F2937",
      text: "#F9FAFB",
      error: "#F87171",
    },
  },
  {
    name: "forest",
    colors: {
      primary: "#065F46",
      secondary: "#047857",
      accent: "#10B981",
      background: "#ECFDF5",
      surface: "#D1FAE5",
      text: "#064E3B",
      error: "#DC2626",
    },
  },
  {
    name: "premium-navy",
    colors: {
      primary: "#0F172A", // deep navy
      secondary: "#334155", // slate
      accent: "#FACC15", // gold accent
      background: "#F1F5F9",
      surface: "#FFFFFF",
      text: "#1E293B",
      error: "#B91C1C",
    },
  },
  {
    name: "premium-rose",
    colors: {
      primary: "#7F1D1D", // dark red wine
      secondary: "#9D174D", // rose
      accent: "#FCD34D", // warm gold
      background: "#FFF7ED",
      surface: "#FEF3C7",
      text: "#3F3F46",
      error: "#B91C1C",
    },
  },
  {
    name: "premium-emerald",
    colors: {
      primary: "#064E3B", // deep emerald
      secondary: "#10B981", // minty green
      accent: "#FBBF24", // soft gold
      background: "#ECFDF5",
      surface: "#D1FAE5",
      text: "#064E3B",
      error: "#B91C1C",
    },
  },
];
