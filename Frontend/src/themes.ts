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
    name: "neo-cyber",
    colors: {
      primary: "#0FF1CE", // neon cyan
      secondary: "#FF4D6D", // hot pink
      accent: "#FFBF00", // vibrant yellow
      background: "#0A0A0D", // almost black
      surface: "#1B1B25", // dark gray
      sidebarBackground: "#11111A",
      text: "#E0E0E0",
      textSecondary: "#A0A0A0",
      error: "#FF6B6B",
      success: "#00E676",
      warning: "#FFD166",
      info: "#00B0FF",
      icon: "#E0E0E0",
      iconSecondary: "#A0A0A0",
    },
  },
  {
    name: "pastel-vibes",
    colors: {
      primary: "#FF8C94", // soft pink
      secondary: "#6C5B7B", // muted purple
      accent: "#FFC75F", // soft yellow
      background: "#F8F9FA", // light gray
      surface: "#FFFFFF",
      sidebarBackground: "#EFEFEF",
      text: "#333333",
      textSecondary: "#777777",
      error: "#FF6B6B",
      success: "#3DDC97",
      warning: "#FFD166",
      info: "#6C5B7B",
      icon: "#333333",
      iconSecondary: "#777777",
    },
  },
  {
    name: "vivid-ocean",
    colors: {
      primary: "#0077FF", // bright blue
      secondary: "#00FFA3", // teal green
      accent: "#FFD300", // gold
      background: "#0F1C2E", // deep navy
      surface: "#1A2B45",
      sidebarBackground: "#13203B",
      text: "#E6F1FF",
      textSecondary: "#A0C4FF",
      error: "#FF5C5C",
      success: "#00FFA3",
      warning: "#FFD300",
      info: "#00BFFF",
      icon: "#E6F1FF",
      iconSecondary: "#A0C4FF",
    },
  },
  {
    name: "electric-forest",
    colors: {
      primary: "#00FF85", // neon green
      secondary: "#0D3B66", // dark blue
      accent: "#FF6B6B", // coral
      background: "#0B1E1E", // deep greenish-black
      surface: "#12332C",
      sidebarBackground: "#0A2B24",
      text: "#DFF6F0",
      textSecondary: "#7FD3C9",
      error: "#FF4C4C",
      success: "#00FF85",
      warning: "#FFD166",
      info: "#0D3B66",
      icon: "#DFF6F0",
      iconSecondary: "#7FD3C9",
    },
  },
  {
    name: "sunset-neon",
    colors: {
      primary: "#FF6B6B", // pink-red
      secondary: "#FFB56B", // neon orange
      accent: "#FFD93D", // neon yellow
      background: "#1A1A2E", // dark navy
      surface: "#2C2C44",
      sidebarBackground: "#23233B",
      text: "#FFF1E6",
      textSecondary: "#FFCC99",
      error: "#FF4C4C",
      success: "#22C55E",
      warning: "#FFD93D",
      info: "#FF6B6B",
      icon: "#FFF1E6",
      iconSecondary: "#FFCC99",
    },
  },
  {
    name: "digital-vapor",
    colors: {
      primary: "#FF3CFF", // neon magenta
      secondary: "#3CFFFD", // cyan
      accent: "#FFFB00", // bright yellow
      background: "#0D0D0D", // pure black
      surface: "#1F1F1F",
      sidebarBackground: "#121212",
      text: "#FFFFFF",
      textSecondary: "#B3B3B3",
      error: "#FF4C4C",
      success: "#00FFA3",
      warning: "#FFD300",
      info: "#3CFFFD",
      icon: "#FFFFFF",
      iconSecondary: "#B3B3B3",
    },
  },
  {
    name: "neo-cyber",
    colors: {
      primary: "#0FF1CE",
      secondary: "#FF4D6D",
      accent: "#FFBF00",
      background: "#0A0A0D",
      surface: "#1B1B25",
      sidebarBackground: "#11111A",
      text: "#E0E0E0",
      textSecondary: "#A0A0A0",
      error: "#FF6B6B",
      success: "#00E676",
      warning: "#FFD166",
      info: "#00B0FF",
      icon: "#E0E0E0",
      iconSecondary: "#A0A0A0",
    },
  },
  {
    name: "pastel-vibes",
    colors: {
      primary: "#FF8C94",
      secondary: "#6C5B7B",
      accent: "#FFC75F",
      background: "#F8F9FA",
      surface: "#FFFFFF",
      sidebarBackground: "#EFEFEF",
      text: "#333333",
      textSecondary: "#777777",
      error: "#FF6B6B",
      success: "#3DDC97",
      warning: "#FFD166",
      info: "#6C5B7B",
      icon: "#333333",
      iconSecondary: "#777777",
    },
  },
  {
    name: "vivid-ocean",
    colors: {
      primary: "#0077FF",
      secondary: "#00FFA3",
      accent: "#FFD300",
      background: "#0F1C2E",
      surface: "#1A2B45",
      sidebarBackground: "#13203B",
      text: "#E6F1FF",
      textSecondary: "#A0C4FF",
      error: "#FF5C5C",
      success: "#00FFA3",
      warning: "#FFD300",
      info: "#00BFFF",
      icon: "#E6F1FF",
      iconSecondary: "#A0C4FF",
    },
  },

  // ----- Standard / Classic Themes -----
  {
    name: "classic-light",
    colors: {
      primary: "#1976D2", // Material Blue
      secondary: "#9C27B0", // Material Purple
      accent: "#FFC107", // Amber
      background: "#FAFAFA",
      surface: "#FFFFFF",
      sidebarBackground: "#E0E0E0",
      text: "#212121",
      textSecondary: "#757575",
      error: "#D32F2F",
      success: "#388E3C",
      warning: "#F57C00",
      info: "#1976D2",
      icon: "#212121",
      iconSecondary: "#757575",
    },
  },
  {
    name: "classic-dark",
    colors: {
      primary: "#90CAF9", // Light Blue
      secondary: "#CE93D8", // Light Purple
      accent: "#FFD54F", // Light Amber
      background: "#121212",
      surface: "#1E1E1E",
      sidebarBackground: "#1A1A1A",
      text: "#E0E0E0",
      textSecondary: "#B0B0B0",
      error: "#EF5350",
      success: "#66BB6A",
      warning: "#FFA726",
      info: "#29B6F6",
      icon: "#E0E0E0",
      iconSecondary: "#B0B0B0",
    },
  },
  {
    name: "neutral-gray",
    colors: {
      primary: "#607D8B",
      secondary: "#455A64",
      accent: "#CFD8DC",
      background: "#ECEFF1",
      surface: "#FFFFFF",
      sidebarBackground: "#CFD8DC",
      text: "#212121",
      textSecondary: "#616161",
      error: "#E53935",
      success: "#43A047",
      warning: "#FB8C00",
      info: "#1E88E5",
      icon: "#212121",
      iconSecondary: "#616161",
    },
  },
];
