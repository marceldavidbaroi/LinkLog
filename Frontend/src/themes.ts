export type ThemeConfig = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    sidebarBackground: string; // added complementary color for sidebars
    text: string;
    textSecondary?: string;
    error: string;
    success?: string;
    warning?: string;
    info?: string;
    icon?: string;
    iconSecondary?: string;
  };
};

export const themes: ThemeConfig[] = [
  {
    name: "light-premium",
    colors: {
      primary: "#1D4ED8",
      secondary: "#7C3AED",
      accent: "#F59E0B",
      background: "#F3F4F6",
      surface: "#FFFFFF",
      sidebarBackground: "#E5E7EB", // slightly darker than background
      text: "#111827",
      textSecondary: "#6B7280",
      error: "#B91C1C",
      success: "#16A34A",
      warning: "#F59E0B",
      info: "#2563EB",
      icon: "#111827",
      iconSecondary: "#6B7280",
    },
  },
  {
    name: "deep-dark",
    colors: {
      primary: "#4F83CC",
      secondary: "#A77AC9",
      accent: "#F2C94C",
      background: "#0D1117",
      surface: "#1B1F2B",
      sidebarBackground: "#161B27", // slightly lighter than surface
      text: "#E0E0E0",
      textSecondary: "#A0A0A0",
      error: "#EF4444",
      success: "#22C55E",
      warning: "#F59E0B",
      info: "#3B82F6",
      icon: "#E0E0E0",
      iconSecondary: "#A0A0A0",
    },
  },
  {
    name: "forest-luxe",
    colors: {
      primary: "#065F46",
      secondary: "#047857",
      accent: "#10B981",
      background: "#ECFDF5",
      surface: "#D1FAE5",
      sidebarBackground: "#C7F0D9",
      text: "#064E3B",
      textSecondary: "#065F46",
      error: "#B91C1C",
      success: "#10B981",
      warning: "#F59E0B",
      info: "#047857",
      icon: "#064E3B",
      iconSecondary: "#065F46",
    },
  },
  {
    name: "premium-navy",
    colors: {
      primary: "#0F172A",
      secondary: "#334155",
      accent: "#FACC15",
      background: "#F1F5F9",
      surface: "#FFFFFF",
      sidebarBackground: "#E2E8F0",
      text: "#1E293B",
      textSecondary: "#475569",
      error: "#B91C1C",
      success: "#0EA5E9",
      warning: "#FACC15",
      info: "#2563EB",
      icon: "#1E293B",
      iconSecondary: "#475569",
    },
  },
  {
    name: "premium-rose",
    colors: {
      primary: "#7F1D1D",
      secondary: "#9D174D",
      accent: "#FCD34D",
      background: "#FFF7ED",
      surface: "#FEF3C7",
      sidebarBackground: "#FFE6B3",
      text: "#3F3F46",
      textSecondary: "#6B7280",
      error: "#B91C1C",
      success: "#10B981",
      warning: "#F59E0B",
      info: "#9333EA",
      icon: "#3F3F46",
      iconSecondary: "#6B7280",
    },
  },
  {
    name: "premium-emerald",
    colors: {
      primary: "#064E3B",
      secondary: "#10B981",
      accent: "#FBBF24",
      background: "#ECFDF5",
      surface: "#D1FAE5",
      sidebarBackground: "#C7F0D9",
      text: "#064E3B",
      textSecondary: "#065F46",
      error: "#B91C1C",
      success: "#10B981",
      warning: "#FBBF24",
      info: "#047857",
      icon: "#064E3B",
      iconSecondary: "#065F46",
    },
  },
  {
    name: "sunset-blush",
    colors: {
      primary: "#FF6B6B",
      secondary: "#FF8E72",
      accent: "#FFD93D",
      background: "#FFF0F5",
      surface: "#FFE4E1",
      sidebarBackground: "#FFD6D9",
      text: "#4B1D3F",
      textSecondary: "#7B2D5D",
      error: "#D32F2F",
      success: "#22C55E",
      warning: "#F59E0B",
      info: "#0288D1",
      icon: "#4B1D3F",
      iconSecondary: "#7B2D5D",
    },
  },
  {
    name: "oceanic",
    colors: {
      primary: "#0288D1",
      secondary: "#26C6DA",
      accent: "#00E676",
      background: "#E0F7FA",
      surface: "#B2EBF2",
      sidebarBackground: "#9DECF6",
      text: "#014F86",
      textSecondary: "#0277BD",
      error: "#D32F2F",
      success: "#00E676",
      warning: "#F59E0B",
      info: "#0288D1",
      icon: "#014F86",
      iconSecondary: "#0277BD",
    },
  },
  {
    name: "midnight-gold",
    colors: {
      primary: "#1A1A2E",
      secondary: "#162447",
      accent: "#FFC300",
      background: "#0B0B1C",
      surface: "#1A1A2E",
      sidebarBackground: "#14142A",
      text: "#E5E5E5",
      textSecondary: "#A0A0A0",
      error: "#FF0000",
      success: "#22C55E",
      warning: "#F59E0B",
      info: "#FFC300",
      icon: "#E5E5E5",
      iconSecondary: "#A0A0A0",
    },
  },
  {
    name: "lavender-dream",
    colors: {
      primary: "#6B5B95",
      secondary: "#B8A9C9",
      accent: "#FFD6F2",
      background: "#F9F5FF",
      surface: "#EDE7F6",
      sidebarBackground: "#E3DDF0",
      text: "#4B0082",
      textSecondary: "#7B5FA0",
      error: "#D32F2F",
      success: "#22C55E",
      warning: "#F59E0B",
      info: "#6B5B95",
      icon: "#4B0082",
      iconSecondary: "#7B5FA0",
    },
  },
];
