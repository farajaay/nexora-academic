import type { Text } from "./site";

export type ThemeId = "light" | "dark";

export const DEFAULT_THEME: ThemeId = "light";

// Pure data, no browser or database dependency, so it is safe to import from
// both the client (src/App.tsx, src/Admin.tsx) and the static document
// generator (scripts/seo.mjs), matching the src/config/routes.ts pattern.
// One identity in two modes. `swatch` mirrors each mode's --bg/--primary/
// --accent in src/index.css for the admin preview dots -- update both together.
export const themes: {
  id: ThemeId;
  name: Text;
  blurb: Text;
  swatch: [string, string, string];
}[] = [
  {
    id: "light",
    name: { ar: "فاتح", en: "Light" },
    blurb: { ar: "دافئ وهادئ وواضح", en: "Warm, calm, clear" },
    swatch: ["#f2e1d9", "#263238", "#8a3f2c"],
  },
  {
    id: "dark",
    name: { ar: "داكن", en: "Dark" },
    blurb: { ar: "مريح للعين ليلًا", en: "Easy on the eyes at night" },
    swatch: ["#121110", "#f0d4c6", "#f2a68f"],
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themes.some((t) => t.id === value);
}
