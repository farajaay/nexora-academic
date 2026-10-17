import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getActiveTheme, setThemePreference } from "./lib/theme";
import { useLanguage } from "./ui";
// Light/dark toggle. The choice is remembered in this browser only; without
// one, visitors see the site default the admin picked.
export function ThemePicker() {
  const { t } = useLanguage();
  const [active, setActive] = useState(getActiveTheme);
  useEffect(() => {
    const sync = () => setActive(getActiveTheme());
    window.addEventListener("nexora-theme-change", sync);
    return () => window.removeEventListener("nexora-theme-change", sync);
  }, []);
  const dark = active === "dark";
  return (
    <button
      type="button"
      className="mode-toggle"
      aria-pressed={dark}
      aria-label={t("الوضع الداكن", "Dark mode")}
      onClick={() => setThemePreference(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
