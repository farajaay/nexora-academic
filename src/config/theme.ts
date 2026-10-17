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
    blurb: { ar: "ليلكي هادئ وواضح", en: "Calm lilac, clear" },
    swatch: ["#efe9f7", "#3d2a6b", "#7a3ea6"],
  },
  {
    id: "dark",
    name: { ar: "داكن", en: "Dark" },
    blurb: { ar: "مريح للعين ليلًا", en: "Easy on the eyes at night" },
    swatch: ["#14111c", "#cdb8f5", "#d9b8ff"],
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themes.some((t) => t.id === value);
}
