import { DEFAULT_THEME, isThemeId, type ThemeId } from "../config/theme";

export {
  DEFAULT_THEME,
  isThemeId,
  themes,
  type ThemeId,
} from "../config/theme";

/** Applies a theme to the document immediately (no network involved). */
export function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
}

// `./backend` pulls in @supabase/supabase-js. It's imported dynamically here
// (matching the pattern in forms.tsx) so the database client stays out of
// the main bundle: most visitors never touch the admin panel or submit a
// request, and the landing page should stay fast for them regardless of
// this being a site-wide, database-backed setting.

/**
 * Reads the site-wide theme from the database. Falls back to the built-in
 * default when the database isn't configured or the read fails -- the same
 * "explicit unavailability, never a silent guess" approach used elsewhere
 * (see contactReady in config/site.ts).
 */
export async function loadStoredTheme(): Promise<ThemeId> {
  try {
    const { db } = await import("./backend");
    if (!db) return DEFAULT_THEME;
    const { data, error } = await db
      .from("site_settings")
      .select("theme")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data || !isThemeId(data.theme)) return DEFAULT_THEME;
    return data.theme;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Admin-only: persists the theme for every visitor. Requires `db`. */
export async function saveTheme(id: ThemeId): Promise<boolean> {
  const { db } = await import("./backend");
  if (!db) return false;
  const { error } = await db
    .from("site_settings")
    .update({ theme: id })
    .eq("id", 1)
    .select("theme")
    .single();
  return !error;
}

export const THEME_PREFERENCE_KEY = "nexora-theme-preference";
let siteTheme: ThemeId = DEFAULT_THEME;
let preference: ThemeId | null = null;
export function getThemePreference() {
  return preference;
}
export function updateSiteTheme(id: ThemeId) {
  siteTheme = id;
  applyTheme(preference ?? siteTheme);
  window.dispatchEvent(new Event("nexora-theme-change"));
}
export function setThemePreference(id: ThemeId | null) {
  preference = id;
  try {
    if (id) localStorage.setItem(THEME_PREFERENCE_KEY, id);
    else localStorage.removeItem(THEME_PREFERENCE_KEY);
  } catch {
    /* The choice still works for this page when storage is unavailable. */
  }
  updateSiteTheme(siteTheme);
}
export function initializeThemes() {
  let active = true;
  const readPreference = () => {
    try {
      const stored = localStorage.getItem(THEME_PREFERENCE_KEY);
      preference = stored && isThemeId(stored) ? stored : null;
    } catch {
      /* Retain this page's in-memory choice. */
    }
    updateSiteTheme(siteTheme);
  };
  const refresh = () => {
    void loadStoredTheme().then((id) => {
      if (active) updateSiteTheme(id);
    });
  };
  const storage = (event: StorageEvent) => {
    if (event.key === THEME_PREFERENCE_KEY || event.key === null)
      readPreference();
  };
  readPreference();
  refresh();
  window.addEventListener("focus", refresh);
  window.addEventListener("storage", storage);
  return () => {
    active = false;
    window.removeEventListener("focus", refresh);
    window.removeEventListener("storage", storage);
  };
}
