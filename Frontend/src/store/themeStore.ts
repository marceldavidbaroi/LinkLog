import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themes, type ThemeConfig } from "../themes";

interface ThemeState {
  theme: ThemeConfig;
  setTheme: (name: string) => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      theme: themes[0],
      setTheme: (name) =>
        set(() => ({
          theme: themes.find((t) => t.name === name) ?? themes[0],
        })),
    }),
    {
      name: "theme-storage", // localStorage key
    }
  )
);
