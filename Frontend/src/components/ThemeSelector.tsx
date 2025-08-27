import { useThemeStore } from "../store/themeStore";
import { themes } from "../themes";

export default function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <select
      value={theme.name}
      onChange={(e) => setTheme(e.target.value)}
      className="border p-2 rounded"
    >
      {themes.map((t) => (
        <option key={t.name} value={t.name}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
