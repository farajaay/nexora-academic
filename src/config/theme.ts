import type { Text } from "./site";

export type ThemeId = "light" | "dark";

export const DEFAULT_THEME: ThemeId = "dark";

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
    blurb: { ar: "أزرق ليلكي فاتح وواضح", en: "Light periwinkle, clear" },
    swatch: ["#eceef9", "#2e3570", "#4a55b8"],
  },
  {
    id: "dark",
    name: { ar: "داكن", en: "Dark" },
    blurb: {
      ar: "أزرق ليلكي داكن (الافتراضي)",
      en: "Dark periwinkle (default)",
    },
    swatch: ["#0f1120", "#b3bcf5", "#c0c6ff"],
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themes.some((t) => t.id === value);
}
