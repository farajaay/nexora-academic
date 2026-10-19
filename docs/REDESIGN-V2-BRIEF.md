# Redesign v2 brief — NEXORA Digital Solutions

Source of truth for the next full redesign. The reference is the owner's
"NEXORA Digital Solutions" flyer (bold wordmark with a blue gradient X,
navy + electric blue, device mockups, "Your Vision. Our Digital Expertise.").

## Decisions (approved by the owner)

- **Positioning:** digital agency first. Academic support (services,
  pricing, calculator, request form, integrity) stays as a **secondary
  section**, unchanged in function.
- **Services (7):** Website Development · Brand Identity Design · UI/UX
  Design · Content Production · Digital Solutions · Product Development ·
  Industrial Consultation.
- **Default mode:** **dark navy** with electric blue accents; light mode
  stays available through the header toggle.
- **Tagline:** Ideas · Brands · Websites · Growth.
- **Headline:** "Your Vision. Our Digital Expertise." (Arabic equivalent to
  be written).
- WhatsApp is already configured: 966554517103.

## Gap vs. current site (as of 2026-10-19)

| Area         | Current                                      | Target                                                                       |
| ------------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| Name         | Nexora (Academic + Studio)                   | NEXORA Digital Solutions                                                     |
| Logo         | N mark + Newsreader serif wordmark           | Bold wordmark, blue gradient X                                               |
| Palette      | Blue-lilac (periwinkle)                      | Deep navy + electric blue (gradient)                                         |
| Type         | Newsreader + IBM Plex Sans Arabic            | Heavy geometric sans (Latin) + bold Arabic pair, self-hosted                 |
| Nav          | Home · Academic · Studio · How we work · FAQ | Home · About · Services · Portfolio · Contact (+ Academic)                   |
| Visuals      | Text only                                    | Hero device mockups, project imagery, icon set                               |
| Lead capture | Academic form only (DB `service` check)      | Agency lead form: name, company, service, budget, timeline → new table + RLS |

## Work plan

1. **Brand foundations:** logo (owner's SVG, or a redraw), navy/blue tokens
   for dark and light, fonts, tagline, favicon, `theme-color`.
2. **Information architecture:** new routes `/about`, `/portfolio`,
   `/services/<slug>` × 7 (add to `src/config/routes.ts`); Academic moves under
   its own nav item; keep all existing URLs working.
3. **Agency lead form:** new Supabase table + RLS + admin list; WhatsApp and
   email handoff.
4. **Pages:** Home (agency hero + services grid + portfolio teaser + process
   - CTA), About, Portfolio, service detail pages, Contact; restyle the
     Academic pages.
5. **Copy:** agency-voice rewrite in Arabic and English.
6. **SEO:** schema `Organization` / `ProfessionalService`, titles, sitemap,
   and a custom domain if one is owned (CNAME + Vite `base` + `site.url`).
7. **QA:** WCAG AA in both modes, RTL/LTR, 390px mobile, e2e updates,
   screenshots before merge. Work on a branch; merge only after approval.

## Needed from the owner

- Logo file (SVG preferred).
- Real portfolio items (images, client, short description) — otherwise
  clearly-labelled placeholders.
- Business email.
- Whether a domain (e.g. nexora.com) is actually owned.
- About text: who you are, experience, city.
