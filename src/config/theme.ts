import type { Text } from "./site";

export type ThemeId = "light" | "dark";

export const DEFAULT_THEME: ThemeId = "dark";

// Pure data, no browser or database dependency, so it is safe to import from
// both the client (src/App.tsx, src/Admin.tsx) and the static document
// generator (scripts/seo.mjs), matching the src/config/routes.ts pattern.
export const themes: {
  id: ThemeId;
  name: Text;
  blurb: Text;
}[] = [
  {
    id: "light",
    name: { ar: "فاتح", en: "Light" },
    blurb: { ar: "ورق معدني وحبر داكن", en: "Mineral paper and dark ink" },
  },
  {
    id: "dark",
    name: { ar: "داكن", en: "Dark" },
    blurb: {
      ar: "ظل هادئ ونص واضح (الافتراضي)",
      en: "Quiet shade and clear type (default)",
    },
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themes.some((t) => t.id === value);
}
