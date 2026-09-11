# QC Report — UX and Structure

**Date:** 2026-09-11 · **Version under test:** 1.2.0 · **Commit:** 6df3a0b
**Scope:** independent verification of the built static site (`dist/`) served by `vite preview`, audited at 1440×1000 (desktop Chromium) and iPhone 13 (mobile Chromium) across all 13 routes.

This report re-runs the project's own suite and adds an independent UX/structure audit. It records findings only; no source behaviour was changed.

---

## 1. Verification results

| Check                                | Result         | Notes                                                                                                                          |
| ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci`                             | Pass           | 195 packages, **0 vulnerabilities**                                                                                            |
| `npm run lint`                       | Pass           | zero warnings (`--max-warnings 0`)                                                                                             |
| `npm run typecheck`                  | Pass           | clean                                                                                                                          |
| `npm run test:unit`                  | **6/6 pass**   | pricing, minimums, rush multipliers, word blocks, custom scope, query handoff, validation, message encoding, attachment limits |
| `npm run build`                      | Pass           | 11 route documents + 404 + sitemap + robots generated                                                                          |
| `node --test tests/seo.test.mjs`     | **1/1 pass**   | fails if run before `build` — see 4.4                                                                                          |
| `npm run test:e2e`                   | **12/12 pass** | desktop + mobile, after the environment fix in 1.1                                                                             |
| `node --test tests/backend.test.mjs` | **Skipped**    | correctly skips without live credentials — see 1.2                                                                             |

**Bundle:** main JS 332 kB raw / **105 kB gzip**; CSS 31 kB / 8 kB gzip; `Admin` correctly split into a lazy 4.2 kB gzip chunk. Reasonable for React 19 + Router.

### 1.1 E2E required an environment fix (not a site defect)

The suite initially failed 12/12, then 4/12. Root cause was diagnosed and is **environmental, not a site bug**:

1. The pinned Playwright expects Chromium build 1243; this runner ships 1194. Resolved by pointing `executablePath` at the installed binary.
2. The remaining 4 failures were `page.goto` timeouts. Measured cause: **every navigation cost a fixed ~12,700 ms**, because the page `load` event waits on the Google Fonts request, which has no egress in this sandbox. Blocking that one request changed navigation from **12,700 ms → 61 ms**, and all 12 tests then passed in 12.6 s (down from 2.5 min).

This is an environment artefact — but it exposes a genuine production risk, recorded as **P2-1** below.

### 1.2 Backend tests were not exercised

`tests/backend.test.mjs` and `tests/e2e/backend.spec.ts` skip cleanly without live Supabase credentials, which are not available to this session. This is **good test design** — they skip loudly rather than passing vacuously — but it means **the database, auth, RLS, payment-ledger and file-upload paths are unverified in this report**. The prior `docs/VERIFICATION.md` records them as passing against a live project; that evidence stands, but is not reproduced here.

---

## 2. What is structurally sound

Verified across all 13 routes × 2 viewports:

- **Landmarks are consistent and complete** — exactly one `header`/`nav`/`main`/`footer` on every route.
- **Exactly one `<h1>` per page**, on all 13 routes, both viewports.
- **Zero horizontal overflow** at every route and both viewports — the responsive work is genuinely solid.
- **Zero duplicate element IDs** anywhere.
- **Every form control is labelled** — no unlabelled inputs on any route.
- **No missing `alt` attributes.**
- **SPA route changes move focus to `<main>`** and reset scroll — better than most React sites.
- **`:focus-visible` styles and a `prefers-reduced-motion` block are both present.**
- **Admin is lazy-loaded, `noindex, nofollow`, and excluded from the sitemap.**
- **A skip link exists** (`src/App.tsx:127`) — though see **P1-3**, which disables it in practice.

---

## 3. Priority 1 — user-facing defects

### P1-1 · Colour contrast fails WCAG 2.1 AA (serious)

Two real failures, both confirmed by axe-core:

| Element       | Measured   | Required         | Where                | Source                                              |
| ------------- | ---------- | ---------------- | -------------------- | --------------------------------------------------- |
| `.error-code` | **1.63:1** | 3:1 (large text) | `/status/`, 404 page | `src/index.css:1042` (`#b4caed` on `#fbfdff`)       |
| `.footer-tag` | **3.65:1** | 4.5:1            | mobile, all routes   | `src/index.css:1199` (`#7a8799` on `#ffffff`, 11px) |

The 404 numeral is effectively invisible to low-vision users. `.footer-tag` is also only **11px**, which is below comfortable reading size on mobile regardless of contrast.

### P1-2 · Initial page load hijacks focus, disabling the skip link and the whole header

`src/App.tsx:96–124` — the effect calls `document.getElementById("main")?.focus()` on `[pathname, lang]`, and **that dependency array includes the initial mount.**

Measured consequence on a fresh load:

```
after initial load, focus = MAIN
first Tab after load      = A "Request a service"   ← hero CTA, inside <main>
two Shift+Tabs back       = BUTTON "عربي"            ← nav is *behind* the user
```

A keyboard user landing on any page **cannot reach the skip link or any header navigation by pressing Tab forward** — the site's entire primary navigation sits behind their focus position and is only reachable by tabbing backwards, which is undiscoverable. This also nullifies the skip link the project correctly built.

**Fix:** guard the focus call with a ref so it is skipped on first mount and applies only to subsequent client-side route changes. This keeps the (valuable) SPA route-change behaviour and restores normal load-time tab order.

### P1-3 · The language toggle throws focus away from itself

Because `lang` is in the same dependency array, switching language moves focus from the toggle button to `<main>`:

```
after clicking lang toggle = MAIN
```

A keyboard or screen-reader user who switches language loses their place and cannot simply press Enter again to switch back. The same ref-guard fix should exclude `lang` from triggering the focus move, or restore focus to the toggle.

### P1-4 · English visitors get an Arabic RTL flash on every page load

Language is persisted in `localStorage` only (`src/App.tsx:302`), while every pre-rendered document ships `lang="ar" dir="rtl"` with Arabic title and description. Measured for a returning English user:

```
first commit : lang=ar  dir=rtl  title=دعم أكاديمي أوضح...
settled      : lang=en  dir=ltr  title=Clearer academic support
```

Every English visitor sees Arabic content in right-to-left layout before JavaScript flips it — a direction flip, not just a text swap, so the whole layout visibly reflows on each navigation.

---

## 4. Priority 2 — structural and SEO

### P2-1 · Half the site's content is invisible to search engines

The site is marketed as bilingual, but English exists only as a client-side toggle:

- Every generated document is `lang="ar"` with **Arabic-only** `<title>` and `<meta name="description">`.
- **Zero `hreflang` annotations** anywhere.
- `dist/sitemap.xml` lists **9 Arabic URLs and no English equivalents**.
- There is **no `/en/` route** — English content has no distinct, shareable, crawlable URL.

Consequences: the English half of the product cannot rank in English search; sharing a link never preserves the recipient's language; and there is no canonical/alternate pairing for Google to reconcile. For a platform serving university and postgraduate students — who frequently search in English — this is a commercial gap, not just a technical one.

**Direction:** introduce language-prefixed routes (e.g. `/en/services/`), emit per-language documents from `scripts/seo.mjs`, add reciprocal `hreflang` (incl. `x-default`), and list both languages in the sitemap.

### P2-2 · The critical render path depends on a third party with no fallback

`src/index.css:1` loads both font families via `@import url("https://fonts.googleapis.com/...")`. A CSS `@import` is the slowest possible way to load fonts — it serialises as CSS → parse → fetch font CSS → fetch fonts — and it gates the `load` event. Measured in this environment: **12,700 ms vs 61 ms** with the request blocked.

`&display=swap` is correctly present, so text stays visible; the exposure is total page-load dependency on an external host that is slow, blocked or restricted on some corporate and regional networks. **Self-hosting the two families** (subset to Arabic + Latin) removes the third-party dependency, improves load, and avoids sending visitor IPs to a third party — worth noting alongside the site's own privacy policy.

> Note: system-font fallbacks should be declared for both families so that any device — including those that cannot reach the font host — renders the site in a locally available Arabic-capable face rather than a default serif.

### P2-3 · The accessibility test passes because of coverage gaps, not cleanliness

`tests/e2e/site.spec.ts:121` runs axe on **4 routes** (`home`, `calculator`, `contact`, `admin`) with tags `wcag2a, wcag2aa, wcag21aa`.

Re-running axe across **all 13 routes** with `wcag22aa` and `best-practice` added surfaced **28 violations** the current suite cannot see — including both serious contrast failures in P1-1, which sit on `/status/` and the 404 page, neither of which the suite visits.

**Fix:** iterate the axe check over the full route list and widen the tag set.

### P2-4 · Heading levels skip h1 → h3

Four routes jump straight from `<h1>` to `<h3>`, breaking the document outline for screen-reader users navigating by heading:

| Route            | First offending heading                |
| ---------------- | -------------------------------------- |
| `/services/`     | `شرح ومراجعة واجب قصير` (service card) |
| `/how-it-works/` | `أخبرنا بما تحتاج`                     |
| `/status/`       | `اكتشف نيكسورا`                        |
| `/success/`      | `اكتشف نيكسورا`                        |

### P2-5 · Mobile content outside any landmark

`.mobile-contact` falls outside all landmark regions on **every route at mobile width**, so screen-reader users navigating by landmark cannot reach it.

### P2-6 · SEO test depends on build order

`tests/seo.test.mjs` reads from `dist/` and fails outright on a clean checkout. It is not wired into any `npm` script, so it is easy to run at the wrong time (it failed here on first run for exactly this reason). Add it as e.g. `"test:seo": "npm run build && node --test tests/seo.test.mjs"`.

---

## 5. Priority 3 — minor and maintainability

- **Language button is 41×23 px**, nominally 1px under the WCAG 2.5.8 (AA) 24×24 minimum. Probably rescued by the spacing exception, but trivially fixed.
- **Footer links (21px tall) and checkboxes (18×18)** are likewise under the nominal minimum; both likely qualify for the spacing/inline exceptions, but are worth a deliberate review rather than an accident.
- **Three internal policy links open in a new tab** (`src/forms.tsx:694, 698, 702`) with no advisory to the user. Opening in a new tab is the right call — it protects a part-filled form — but it should be announced (e.g. visually-hidden "opens in a new tab").
- **Node version drift:** README requires Node 24; this runner has 22 and everything built and passed. `package.json` declares no `engines` field, so nothing enforces the documented version.
- **Large modules:** `src/forms.tsx` (837 lines), `src/pages.tsx` (695), `src/Admin.tsx` (688). Functional, but these are the three files most likely to resist safe change as the product grows; splitting by feature would pay off before the next major addition.

---

## 6. Recommended order of work

1. **P1-2 / P1-3** — one focused change to the effect in `src/App.tsx` fixes both the load-time focus hijack and the language-toggle focus loss. Highest impact per line changed.
2. **P1-1** — two CSS colour values.
3. **P2-3** — widen the axe route/tag coverage, so items 1–2 stay fixed.
4. **P2-2** — self-host fonts with proper device-safe fallbacks.
5. **P1-4 / P2-1** — the bilingual URL strategy. Largest change, largest commercial upside; worth planning deliberately rather than patching.

---

## 7. Method and reproducibility

Served `dist/` via `vite preview --port 5173`. All browser work used the runner's Chromium 1194 via `executablePath`, with `fonts.googleapis.com` / `fonts.gstatic.com` aborted so the sandbox's lack of egress could not mask site behaviour. Audits covered 13 routes (including an unknown route for the 404 view) at both viewports, measuring heading outlines, landmarks, duplicate IDs, target sizes, overflow, labelling, tab order, focus destinations, and first-paint language state, plus axe-core with `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`.

Temporary QC scripts were removed after the run; no test or source file was modified. Automated checks do not replace manual accessibility evaluation, and the unverified backend scope in 1.2 remains outstanding.

---

## 8. Follow-up — fixes applied (same day)

Two rounds of fixes landed after this report, both fully verified (lint, typecheck, unit, SEO, and the full e2e suite — desktop + mobile — all passing; see 8.2 for the widened coverage's own numbers).

### 8.1 Round 1 — P1-1 through P1-4, and the contained P2 items

Fixed as specified in sections 3–4: the load-time focus hijack and the language-toggle focus loss (P1-2/P1-3, one change in `src/App.tsx`'s effects), both colour-contrast failures (P1-1), fonts self-hosted removing the third-party render-blocking dependency (P2-2), the axe route/tag coverage widened from 4 routes to every route (P2-3), all four h1→h3 heading skips (P2-4), the mobile contact bar given a landmark (P2-5), and `test:seo` wired to build first (P2-6). P1-4 (the RTL first-paint flash) was patched with an inline pre-paint script reading the same `localStorage` key the app used — a contained fix, since the full URL-based solution was P2-1's scope. This round is commit `7b1193f`.

### 8.2 Round 2 — P2-1, the bilingual URL and hreflang architecture

Implemented as planned: Arabic keeps every existing URL unprefixed; English is the same path under `/en/`, generated as its own static document with reciprocal `hreflang` tags (`x-default` → Arabic) and listed in the sitemap. Admin and success also get a document per language for toggle/direct-link consistency, but stay `noindex` and out of the sitemap/hreflang. Route titles and descriptions moved out of two hand-duplicated dictionaries (App.tsx's `meta`, seo.mjs's Arabic-only `pages` — confirmed to have drifted on 7 of 11 routes) into one shared `src/config/routes.ts`. P1-4's inline pre-paint script was removed entirely and superseded: every static document now bakes its own correct `lang`/`dir` in, so the flash is eliminated at the source rather than patched after paint.

Two things were discovered only once the router carried real dual-language routes, both fixed in the same round:

- **Language switching remounted the page, losing in-progress form input.** The first routing design mirrored the route tree once for Arabic and once under `/en`; navigating between the two matched two different `<Route>` elements, so React unmounted and remounted the page component — an e2e test written for this round (checking that a partially filled contact form survives a language switch) caught it immediately. Fixed by matching both languages with a single route per page (`:lang?/segment`, guarded against any value but `"en"`), which React Router treats as the same route across the navigation and keeps mounted.
- **Two more real WCAG AA contrast failures**, invisible until English content was actually run through axe for the first time: the small brand tagline (`.brand small`, 4.36:1) and the section eyebrow label on tinted backgrounds (`.eyebrow`, 4.3:1), both just under the 4.5:1 normal-text minimum. Neither route in the original 4-route axe test (home/calculator/contact/admin, section 4's own P2-3 finding) rendered enough English text in the right spots to surface them; the widened `en/` coverage this round added did. Fixed the same way as 3's contrast pair: darker colours from the existing palette (`var(--muted)`, and a darker teal in the same family as the original).

**Verification for this round:** the accessibility test now covers 15 routes × 2 viewports (12 Arabic/neutral + `en/`, `en/services/`, `en/contact/`) with the WCAG 2.2 AA + best-practice tag set from round 1 — zero violations. Two new e2e tests were added: a direct `/en/` load asserting no flash, and a language-toggle test asserting the URL itself changes (`/services/` → `/en/services/` → back) and that internal navigation while browsing English stays under `/en/`. `tests/seo.test.mjs` was rewritten to assert, for all 9 public routes: both documents exist, correct `lang`/`dir`, correct self-canonical, and all three reciprocal hreflang tags; plus that admin/success get both documents but no hreflang, 404 stays single and unprefixed, the sitemap lists exactly 18 URLs, and robots.txt blocks both languages of the private routes.

Not done, deliberately out of scope for this change: actually submitting the new sitemap in Google Search Console (tracked in `docs/LAUNCH-CHECKLIST.md`) and a follow-up crawl check once the site is live with the new URLs.

---

## بالعربية — ملخص

نجحت جميع الفحوص الثابتة: التدقيق اللغوي للشيفرة والأنواع والبناء و6 اختبارات وحدة واختبار SEO، و12 اختبار متصفح على سطح المكتب والهاتف بعد معالجة مشكلة بيئية في المشغّل. اختبارات قاعدة البيانات تخطّت التنفيذ لعدم توفر بيانات الاعتماد، لذا لم تُتحقق في هذا التقرير.

البنية سليمة: معالم صفحة متسقة، عنوان رئيسي واحد لكل صفحة، لا تجاوز أفقي، ولا معرّفات مكررة، وجميع الحقول موسومة.

أهم الملاحظات: نقص تباين الألوان في صفحتي الحالة و404 وفي تذييل الهاتف، ونقل التركيز إلى المحتوى عند أول تحميل مما يُعطّل رابط التخطي ويمنع الوصول إلى التنقل بلوحة المفاتيح، وفقدان التركيز عند تبديل اللغة، وظهور المحتوى العربي للحظة لمستخدمي الإنجليزية، وغياب روابط ومسارات مستقلة للغة الإنجليزية مما يحجبها عن محركات البحث، واعتماد تحميل الصفحة على خطوط خارجية دون بديل محلي.

### تحديث لاحق

عولجت جميع الملاحظات في جولتين. الأولى (القسمان 3 و4): إصلاح التركيز عند التحميل وعند تبديل اللغة، تباين الألوان، استضافة الخطوط محليًا، ترتيب العناوين، معلم الفوتر الهاتفي، وربط اختبار SEO بالبناء. الثانية: بناء مسارات ثنائية اللغة فعلية — العربية على رابطها الأصلي، والإنجليزية على `/en/` بنفس المسار، مع وسوم hreflang متبادلة وx-default للعربية، ومصدر واحد لعناوين المسارات في `src/config/routes.ts`. اكتُشف أثناء التنفيذ عيبان حقيقيان جديدان وأُصلحا فورًا: تبديل اللغة كان يُفرغ حقول نموذج التواصل الجاري تعبئته (أُصلح بجعل مسار العربية والإنجليزية لنفس الصفحة مسارًا واحدًا في الموجّه)، وعيبا تباين إضافيان في الشعار الفرعي والعناوين الفرعية لم يظهرا إلا بعد فحص المحتوى الإنجليزي فعليًا بأداة axe لأول مرة.
