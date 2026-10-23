# October 2026 redesign verification

The implementation follows the owner's supplied [DESIGN.md](../DESIGN.md)
and the [eight-line brief](REDESIGN-2026-10-BRIEF.md).

## Checks completed

- Production build, TypeScript check, repository lint and `git diff --check` pass.
- All seven unit cases pass, including pricing, request encoding, validation,
  attachment limits and the two theme modes.
- All six SEO cases pass: Arabic/English static documents, reciprocal hreflang,
  private-route indexing rules, sitemap, robots, assistant guides, JSON-LD and
  readable no-JavaScript content.
- All 31 applicable browser cases passed across the main run and focused
  rechecks. Three duplicate matrix cases are intentionally skipped in the
  mobile project because the desktop project supplies all three viewport sizes.
- The 360px, 768px and 1280px matrix covers ten routes, both languages and both
  modes: 120 page combinations, with no horizontal overflow.
- Axe accessibility scans pass on every tested route in the existing desktop
  and mobile suite. Homepage contrast also passes in both modes on both devices.
- Calculator selections reach the request form intact. Request validation,
  file selection/removal, language and theme persistence, FAQ expansion,
  protected admin entry and project-message preparation pass.
- Arrow-key, Home and End service-tab navigation work in RTL and LTR.
- Reduced motion preserves the saved-request acknowledgement without animation.
  An unconfirmed request does not receive the completion color or animation.
- Browser screenshots were visually reviewed. No JavaScript page errors were
  recorded during the screenshot pass.

The initial theme-switch transition briefly mixed foreground/background colors;
removing that transition fixed the mobile contrast check. The larger matrix
uses a 120-second test budget for its forty navigations per viewport.

## Preview captures

- [Arabic, light, 1280px](previews/home-ar-light.png)
- [English, dark, 1280px](previews/home-en-dark.png)
- [Arabic, light, 360px](previews/home-ar-mobile.png)
- [Calculator, English, light, 1280px](previews/calculator-en-light.png)

## Verification limits and release

Live authenticated Supabase administration and production database writes were
not exercised. The frontend's unavailable-backend state was tested; backend
queries, migrations and access rules are retained.

The existing [release brief](REDESIGN-V2-BRIEF.md) requires working on a branch
and approval before merging. This redesign is prepared for that review.
