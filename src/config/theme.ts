import type { Text } from "./site";

export type ThemeId =
  "emerald" | "violet" | "lime" | "sandstone" | "nebula" | "clay";

export const DEFAULT_THEME: ThemeId = "emerald";

// Pure data, no browser or database dependency, so it is safe to import from
// both the client (src/App.tsx, src/Admin.tsx) and the static document
// generator (scripts/seo.mjs), matching the src/config/routes.ts pattern.
// `swatch` mirrors this theme's --primary/--accent/--tertiary in src/index.css,
// duplicated here only for the small fixed-color preview dots in the admin
// theme picker (which must show every theme's own colors side by side,
// regardless of which theme is currently active) -- update both together.
export const themes: {
  id: ThemeId;
  name: Text;
  blurb: Text;
  swatch: [string, string, string];
}[] = [
  {
    id: "emerald",
    name: { ar: "زمردي أكاديمي", en: "Emerald Scholar" },
    blurb: { ar: "هادئ وموثوق ومنعش", en: "Calm, trustworthy, fresh" },
    swatch: ["#0e7c6b", "#8a5a1c", "#7a4fa0"],
  },
  {
    id: "violet",
    name: { ar: "بنفسجي ملكي", en: "Royal Violet" },
    blurb: { ar: "ذكي ورقمي وواثق", en: "Intelligent, digital, confident" },
    swatch: ["#5b3fd6", "#b0338a", "#9a6a16"],
  },
  {
    id: "lime",
    name: { ar: "ليموني منتصف الليل", en: "Midnight Lime" },
    blurb: { ar: "عصري وحاد ونشيط", en: "Sleek, focused, energetic" },
    swatch: ["#101828", "#84cc16", "#3b5bdb"],
  },
  {
    id: "sandstone",
    name: { ar: "رملي ذهبي", en: "Golden Sandstone" },
    blurb: { ar: "دافئ ومتفائل وقريب", en: "Warm, optimistic, approachable" },
    swatch: ["#241c16", "#1f4436", "#c1592e"],
  },
  {
    id: "nebula",
    name: { ar: "نيلي سديمي", en: "Nebula Indigo" },
    blurb: { ar: "مستقبلي وذكي ولافت", en: "Futuristic, smart, bold" },
    swatch: ["#6d28d9", "#4338ca", "#0e7490"],
  },
  {
    id: "clay",
    name: { ar: "طيني صخري", en: "Canyon Clay" },
    blurb: { ar: "ترابي وهادئ ومنضبط", en: "Earthy, grounded, disciplined" },
    swatch: ["#8c4a2f", "#8f5713", "#3b6e71"],
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themes.some((t) => t.id === value);
}
