# Changelog

## 1.2.0

- Private client request attachments with validation, upload retry and authenticated admin downloads.
- Supabase Storage policies, attachment manifests and live upload/privacy tests.
- Bilingual, indexable URLs: every public route now has its own Arabic document (unprefixed, unchanged) and English document at the matching `/en/` path, with reciprocal `hreflang` tags (`x-default` pointing at Arabic) and both listed in the sitemap. Route titles/descriptions moved to a single shared `src/config/routes.ts`.
- Language now lives in the URL, not in memory: the toggle navigates to the matching Arabic/English URL instead of flipping hidden state, and the router keeps the same page mounted across the switch so in-progress form input survives it.
- Self-hosted the site's two font families (Arabic + Latin + Latin Extended subsets) instead of loading them from Google Fonts, removing a render-blocking third-party dependency.
- Fixed a page-load focus bug that put the skip link and header navigation behind the user's starting tab position, and a related bug where switching language moved focus off the toggle button.
- Fixed WCAG AA contrast failures on the 404/empty-state numeral, the mobile footer tag, the small brand tagline and section eyebrow labels; fixed four heading-order skips (h1 → h3) on the services, how-it-works, success and 404 views; gave the fixed mobile contact bar its own landmark.
- Widened the accessibility test from 4 routes to every route in both languages, and the axe rule set to include WCAG 2.2 AA and best-practice checks.
- Six switchable site themes (Emerald Scholar, Royal Violet, Midnight Lime, Golden Sandstone, Nebula Indigo, Canyon Clay) with their own colors, typography and icon style, changeable from the admin panel and applied to every visitor immediately via a new `public.site_settings` table (publicly readable, admin-only writable). The themes' fonts (Tajawal, Plus Jakarta Sans, Sora, Inter, IBM Plex Sans Arabic) are self-hosted, covering all six Latin×Arabic pairings so no theme needs its own new font.
- Switched the default/current theme to Golden Sandstone.

## 1.1.0 — 2026-09-11

- Connected a dedicated Supabase project and provisioned private admin access.
- Verified live request persistence, admin order updates and payment recording, including unauthorized access rejection.
- Disabled public account sign-up and added password changes within the admin dashboard.
- Deferred the database SDK until request submission or administration to keep the landing page fast.
- Added reusable live database and complete browser-flow tests with automatic synthetic-data cleanup.

## 1.0.0 — 2026-09-11

- Bilingual Arabic/English academic support website with RTL, mobile navigation and a geometric brand mark.
- Twelve services from one price configuration; interactive estimates and request handoff.
- Validated request form, safe contact placeholders, WhatsApp/mailto preparation, honest submission states.
- Supabase integration, restricted admin access, order status and quote management, immutable payment ledger.
- Per-route metadata, canonical URLs, sitemap, robots, GitHub Pages deep links and 404.
- GitHub Actions deployment, automated checks and bilingual operator documentation.

## 2026-09-12 — Complete visitor and admin themes

- Preserve Claude Code's six themes and bilingual routes; add visitor selection and browser persistence with a site-default option.
- Activate the pending Supabase theme migrations; verify actual admin authorization, saved defaults and personal overrides.
- Fix silent zero-row theme save success and self-hosted font build warnings; verify desktop/mobile theme menus and existing request flows.
