# Final publication audit — 2026-09-12

## Verdict

The GitHub Pages deployment is technically operational. The site can receive requests and private attachments; authorized administrators can manage orders, record verified payments, download files and set the default theme. Commercial launch readiness remains conditional on the business details below. No claim of legal certification, malware scanning or guaranteed security is made by these checks.

Audited application commit: `fb61fecf6742463f5e8930417369e6d73a0c3414`. The audit documentation commit does not change application behavior.

- Website: https://farajaay.github.io/nexora-academic/
- Repository: https://github.com/farajaay/nexora-academic
- Verified application deployment: https://github.com/farajaay/nexora-academic/actions/runs/34650071851

## Publication and checks

- GitHub Pages uses the GitHub Actions workflow; HTTPS is enforced.
- All 24 checked live URLs returned HTTP 200: 18 public bilingual URLs, 4 private bilingual URLs, robots.txt and brand mark. Main JS and CSS assets returned 200. An unknown route returned 404.
- Clean lint, TypeScript and production build. Generated 22 bilingual route documents plus 404, 18 sitemap URLs, appropriate canonical/hreflang and private-route noindex directives. Five SEO tests passed.
- Seven unit tests passed. npm audit reported zero vulnerabilities across production and development dependencies.
- Scanned 79 tracked files for the actual provisioned admin email and password: zero matches. Private credentials and .env.local remain outside version control. The frontend uses only the intentionally public Supabase publishable key.
- Four public tables have RLS enabled. Fourteen live backend checks verify request persistence, server-owned fields, admin-only access and theme permissions, including an authenticated non-admin with forged metadata.
- Full production browser suite: 25 passed, 1 deliberate skip. It covers desktop/mobile navigation, RTL/LTR, language URLs, calculator handoff, form validation, actual request/attachment submission, upload retry, authenticated download, payment ledger, admin default persistence and visitor overrides. One duplicate mobile global-theme mutation is intentionally skipped to avoid racing shared settings.
- Automated accessibility checks cover every route in the suite, plus all six expanded theme menus. These are automated checks, not a complete manual accessibility certification.
- Tests remove synthetic orders, files, payments and temporary users; the site default is restored after theme mutation tests.

## Owner actions before general promotion

1. Set official business WhatsApp and contact email in `src/config/site.ts`. Placeholders currently keep direct-contact buttons disabled. The admin login email is deliberately not published as a business contact. Database submission remains available.
2. Identify the operating business, specify a retention schedule and provide a working channel for privacy/correction/deletion requests; review the policies for the actual operation. No owner information was invented.
3. Review the temporary logo and explicitly labelled illustrative testimonials. Submit the sitemap through your own Google Search Console account when ready.
4. Use the private credentials file to access the admin dashboard and change the provisioned password. The audit cannot confirm whether a password has been changed by the owner.

## Known operational limits

- Supabase reports one existing warning: leaked-password protection is disabled. It requires an eligible paid plan; no upgrade was purchased. [Supabase password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- Public request submission and file uploads have validation and access controls but no application CAPTCHA/per-client rate limit. Monitor abuse and storage usage before high-volume promotion. The database and Storage are on the existing free project.
- File extension/MIME and size checks do not scan for malware. Treat client files as untrusted. Interrupted uploads are recoverable while the page remains open; after closing the page, follow up with the client for any missing files.
- Payment tracking is a manual ledger, not a payment processor. Admin sessions expire on page reload by design.
- GitHub emits a non-blocking Node 20 action deprecation notice; affected actions are executed using Node 24. Deployment succeeds. A future workflow maintenance update should migrate those action versions after compatibility review.

## Documentation corrections

Marked the theme migrations complete in the launch checklist: all three were applied to the dedicated production Supabase project and real admin updates were tested. Business placeholders remain unchecked.
