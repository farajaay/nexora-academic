# NEXORA vector identity

The everyday mark is a flat geometric interpretation of the owner’s interwoven
ribbon X. The master name remains NEXORA. It uses the same foreground ink as
the website, with transparent seams and transparent space around the artwork.
There are no metallic highlights, gradients, shadows or gold edging.

## Master assets

“Light” means artwork for a light surface; “dark” means artwork for a dark
surface. Every SVG below uses vector paths and masks. Names and descriptors
are outlined, so no fonts or raster images are required to display them.

| Master                           | Light surface                                      | Dark surface                                      |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| Horizontal navigation, name only | [SVG](../public/brand/nexora-navigation-light.svg) | [SVG](../public/brand/nexora-navigation-dark.svg) |
| Full wordmark, Digital Solutions | [SVG](../public/brand/nexora-full-en-light.svg)    | [SVG](../public/brand/nexora-full-en-dark.svg)    |
| Full wordmark, حلول رقمية        | [SVG](../public/brand/nexora-full-ar-light.svg)    | [SVG](../public/brand/nexora-full-ar-dark.svg)    |
| Symbol only                      | [SVG](../public/brand/nexora-symbol-light.svg)     | [SVG](../public/brand/nexora-symbol-dark.svg)     |

The adaptive [favicon](../public/brand-mark.svg) is also genuine SVG. It follows
the browser’s color-scheme preference and contains no embedded JPEG. The
[social preview](../public/brand/nexora-social.png) is a 1200 × 630 PNG export
with an intentional paper field for link previews; it is not the website logo.

The original [metallic artwork](../public/nexora-logo.jpg) is retained unchanged
for presentations or promotional material. It is not loaded by the header,
footer, favicon, structured logo metadata or social preview.

## Website use

`src/Logo.tsx` uses the horizontal lockup in navigation and the full lockup in
the footer. The name-only navigation lockup is shared across languages. The
full Arabic lockup adds حلول رقمية; the English version adds Digital Solutions.
Each homepage link has one localized accessible name.

The shared CSS theme chooses the matching light/dark asset. Asset foregrounds
match `--ink`: `#232c27` on light surfaces, `#eeeee4` on dark surfaces. These
are identity foregrounds, not additional status colors. SVG mask black/white
defines transparent geometry and never appears as painted artwork.

UI display dimensions live in `src/index.css`: navigation is 192px wide on
desktop and 160px on mobile; the full footer lockup is 256px wide. The horizontal
layout gives NEXORA substantially more of that width than the previous stacked
JPEG. Use symbol-only artwork at favicon or app-icon sizes. Keep proportions
and negative-space seams; do not add a plate behind the website lockup.

## Regeneration

`scripts/brand-assets.mjs` defines the ribbon curves, eight-unit crossing
clearance and geometric NEXORA lettering. Descriptor text is shaped by Pango
and outlined with Inkscape using Noto Sans and Noto Sans Arabic. Those fonts
are required only for regeneration; the shipped files do not load them.

With Node 24, Inkscape and those fonts installed, run:

```sh
node scripts/brand-assets.mjs
```

The generator writes only to `public/brand`, `public/brand-mark.svg` and a
task-specific temporary construction directory. It uses a temporary Inkscape
profile/cache. Font downloads and Inkscape are not part of the website build.
Changing the website palette also requires regenerating the exported assets.

## Review

Checked the symbol at 16, 24, 32 and 64px. All eight SVG variants and the favicon
contain paths and no text, embedded images, gradients or opaque background
plate. The Arabic descriptor is outlined and reads in the correct direction.
Checked both language routes and both themes at 360, 768 and 1280px, including
asset loading, transparent surfaces, clear wordmarks and no horizontal overflow.
Build/typecheck, lint and seven SEO checks passed. Eight existing desktop/mobile
browser cases passed for navigation, theme contrast, portfolio accessibility
and project deep links. The metallic JPEG’s original content hash is unchanged.
