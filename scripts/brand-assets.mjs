/** Regenerate the outlined brand assets with Node 24 and Inkscape installed.
 * These coordinates are artwork construction, not interface layout tokens.
 * Visible ink matches --ink in src/index.css. Mask black/white only cut paths.
 * Source JPEG and generated direction are references, never embedded bitmaps.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const brandDir = "public/brand";
const constructionDir = join(tmpdir(), "nexora-brand-construction");
mkdirSync(brandDir, { recursive: true });
mkdirSync(constructionDir, { recursive: true });
const exportOptions = {
  stdio: "pipe",
  encoding: "utf8",
  env: {
    ...process.env,
    INKSCAPE_PROFILE_DIR: join(constructionDir, "inkscape-profile"),
    XDG_CACHE_HOME: join(constructionDir, "cache"),
  },
};
const ink = { light: "#232c27", dark: "#eeeee4" };
const paper = "#f2f1e9";

// A broad descending ribbon passes over the rising ribbon. A real transparent
// clearance exposes the crossing; there is no painted background or highlight.
const front =
  "M18 9C34 3 48 5 62 19C71 28 80 40 90 53L109 77C118 88 117 95 108 98C91 104 77 98 64 85C55 76 45 63 35 50L15 25C7 14 8 12 18 9Z";
const back =
  "M4 101C17 91 27 77 39 62L61 34C74 17 87 4 102 4H128C112 14 104 26 92 42L67 74C54 90 44 102 28 102Z";
const mask = `<defs><mask id="ribbon-crossing" maskUnits="userSpaceOnUse" x="0" y="0" width="132" height="108"><path fill="#fff" d="M0 0H132V108H0Z"/><path d="${front}" fill="#000" stroke="#000" stroke-width="8" stroke-linejoin="round"/></mask></defs>`;
const symbol = `${mask}<path d="${back}" mask="url(#ribbon-crossing)"/><path d="${front}"/>`;

// Original geometric lettering: uniform seven-unit stems and open counters.
// Text is drawn as paths so the master name never depends on an installed font.
const letters = [
  [0, "M0 40V0H7L25 27V0H32V40H25L7 13V40Z"],
  [40, "M0 0H28V7H7V16H25V23H7V33H28V40H0Z"],
  [76, "M0 0H9L17 13L25 0H34L22 19L35 40H26L17 25L8 40H-1L12 19Z"],
  [
    118,
    "M18 0C29 0 36 7 36 20S29 40 18 40S0 33 0 20S7 0 18 0ZM18 7C11 7 7 11 7 20S11 33 18 33S29 29 29 20S25 7 18 7Z",
  ],
  [
    162,
    "M0 40V0H17C28 0 34 5 34 13C34 19 31 23 25 25L36 40H27L17 26H7V40ZM7 7V19H17C24 19 27 17 27 13S24 7 17 7Z",
  ],
  [206, "M0 40L16 0H24L40 40H32L28 30H12L8 40ZM15 23H25L20 10Z"],
];
const wordmark = letters
  .map(
    ([x, d]) =>
      `<path transform="translate(${x})" fill-rule="evenodd" d="${d}"/>`,
  )
  .join("");
const nav = `<g transform="translate(0 3) scale(.54)">${symbol}</g><g transform="translate(80 13) scale(.95)">${wordmark}</g>`;
const full = (lang) =>
  `<g transform="translate(94 0)">${symbol}</g><g transform="translate(37 132)">${wordmark}</g><text x="160" y="202" text-anchor="middle" font-family="${lang === "ar" ? "Noto Sans Arabic" : "Noto Sans"}" font-size="${lang === "ar" ? "20" : "17"}"${lang === "ar" ? ' direction="rtl" lang="ar"' : ' letter-spacing="1"'}>${lang === "ar" ? "حلول رقمية" : "Digital Solutions"}</text>`;
const document = (title, box, body, color, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${title}"${color ? ` fill="${color}"` : ""}><title>${title}</title>${extra}${body}</svg>\n`;
function saveVector(filename, content) {
  const input = join(constructionDir, filename);
  writeFileSync(input, content);
  // Pango shapes the Arabic descriptor; export text to paths so the delivered
  // SVG has no font dependency. Exported files contain paths and vector masks.
  execFileSync(
    "inkscape",
    [
      input,
      "--export-text-to-path",
      "--export-plain-svg",
      "--export-type=svg",
      `--export-filename=${brandDir}/${filename}`,
    ],
    exportOptions,
  );
}
for (const theme of ["light", "dark"]) {
  saveVector(
    `nexora-navigation-${theme}.svg`,
    document("NEXORA", "0 0 320 64", nav, ink[theme]),
  );
  saveVector(
    `nexora-symbol-${theme}.svg`,
    document("NEXORA ribbon X", "0 0 132 108", symbol, ink[theme]),
  );
  for (const lang of ["ar", "en"]) {
    saveVector(
      `nexora-full-${lang}-${theme}.svg`,
      document(
        lang === "ar" ? "NEXORA — حلول رقمية" : "NEXORA Digital Solutions",
        "0 0 320 216",
        full(lang),
        ink[theme],
      ),
    );
  }
}

// Tab art follows the browser's light/dark preference, with transparent seams.
writeFileSync(
  "public/brand-mark.svg",
  document(
    "NEXORA",
    "0 0 132 132",
    `<g transform="translate(0 12)" fill="currentColor">${symbol}</g>`,
    null,
    `<style>svg{color:${ink.light}}@media(prefers-color-scheme:dark){svg{color:${ink.dark}}}</style>`,
  ),
);

// Link previews use an intentional paper field; website logo files stay clear.
const social = document(
  "NEXORA Digital Solutions",
  "0 0 1200 630",
  `<path fill="${paper}" d="M0 0H1200V630H0Z"/><g transform="translate(280 83) scale(2)">${full("en")}</g>`,
  ink.light,
);
const socialInput = join(constructionDir, "nexora-social.svg");
writeFileSync(socialInput, social);
execFileSync(
  "inkscape",
  [
    socialInput,
    "--export-type=png",
    "--export-width=1200",
    "--export-height=630",
    "--export-filename=public/brand/nexora-social.png",
  ],
  exportOptions,
);
console.log(
  "Created eight transparent outlined SVG variants, vector favicon and social preview.",
);
