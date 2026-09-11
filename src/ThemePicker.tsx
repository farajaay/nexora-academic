import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { themes } from "./config/theme";
import { getThemePreference, setThemePreference } from "./lib/theme";
import { useLanguage } from "./ui";
export function ThemePicker() {
  const { lang, t } = useLanguage();
  const [choice, setChoice] = useState(getThemePreference);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const sync = () => setChoice(getThemePreference());
    window.addEventListener("nexora-theme-change", sync);
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node))
        ref.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("nexora-theme-change", sync);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  return (
    <details
      ref={ref}
      className="visitor-themes"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          ref.current?.removeAttribute("open");
          ref.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={t("اختيار المظهر", "Choose theme")}>
        <Palette size={20} />
        <span className="theme-toggle-text">{t("المظهر", "Theme")}</span>
      </summary>
      <div className="visitor-theme-panel">
        <p>
          <strong>{t("مظهرك المفضل", "Your preferred theme")}</strong>
        </p>
        <p className="field-hint">
          {t(
            "يُحفظ اختيارك في هذا المتصفح فقط.",
            "Your choice is saved only in this browser.",
          )}
        </p>
        <button
          type="button"
          className="theme-option"
          aria-pressed={choice === null}
          onClick={() => setThemePreference(null)}
        >
          {t("استخدام مظهر الموقع الافتراضي", "Use site default")}
        </button>
        <div className="theme-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className="theme-option"
              aria-pressed={choice === theme.id}
              onClick={() => setThemePreference(theme.id)}
            >
              <span className="theme-swatch" aria-hidden="true">
                {theme.swatch.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </span>
              <strong>{theme.name[lang]}</strong>
            </button>
          ))}
        </div>
      </div>
    </details>
  );
}
