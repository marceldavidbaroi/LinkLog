import { create } from "zustand";
import { themes, type ThemeConfig } from "../themes";

interface ThemeState {
  theme: ThemeConfig;
  setTheme: (name: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: themes[0], // default light
  setTheme: (name) =>
    set(() => ({
      theme: themes.find((t) => t.name === name) ?? themes[0],
    })),
}));
