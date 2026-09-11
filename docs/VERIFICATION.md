# Verification — 2026-09-11

Verified against the built static site and the live GitHub Pages deployment:

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm run test:unit`: 5 tests passed (pricing, minimum, rush multipliers, word blocks, custom scope, query handoff, validation, message encoding).
- `node --test tests/seo.test.mjs`: 1 test passed (route descriptions, canonical URLs, generated documents, noindex and sitemap exclusion).
- `npm run build`: passed. Main JavaScript approximately 105 kB gzip; CSS approximately 8 kB gzip. Admin code is a separate lazy-loaded chunk.
- `npm run test:e2e`: 12 tests passed on the built site, then all 12 passed against the live deployment, including real request submission, admin sign-in, status/quote changes and payment recording. Chromium desktop 1440×1000 and mobile iPhone 13 dimensions.
- Axe checks for WCAG 2 A/AA and 2.1 AA: no violations reported on home, calculator, contact and admin login for both tested sizes. Automated checks do not replace all manual accessibility evaluation.
- Visually inspected Arabic desktop and mobile home screenshots; English and calculator screenshots are available locally in ignored `artifacts/`.
- Direct home, services, calculator, admin, sitemap and robots URLs returned HTTP 200. Unknown routes render the custom 404 interface.
- `npm audit --omit=dev`: zero known vulnerabilities at verification time.

## Database integration

A dedicated Supabase project (swgosjtqchcjuvxggxkv, eu-central-1) is provisioned. Live database tests passed: anonymous insertion, prohibited reads and field injection, input constraints, denial for non-admin users even with forged user metadata, admin login/read/update, payment insertion and duplicate/overwrite/delete rejection. Eight Node test results passed. The full browser request-to-admin-to-payment flow also passed on desktop and mobile against both the built site and the public GitHub Pages site with the real database. Synthetic orders, payments and the temporary non-admin were removed. The final Supabase security advisor reported one Auth warning: leaked-password protection is disabled. This feature requires Pro or above; the connected organization is on Free. No table/RLS warnings were reported. See [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). The initial admin password is cryptographically random and the configured minimum is 12 characters. Public sign-up is disabled; initial credentials remain in a private local file outside Git.

Business WhatsApp/email remain explicit configuration placeholders. Message validation/encoding is tested; no real message was sent to a placeholder. No personal contact information is published. Testimonials remain labeled illustrative examples.

## بالعربية

ربط مشروع Supabase مستقل، وأُنشئ حساب الإدارة. نجحت اختبارات حفظ الطلبات والصلاحيات والدفعات على قاعدة البيانات الحقيقية، ونجح المسار الكامل من المتصفح على الهاتف وسطح المكتب. حذفت سجلات الاختبار. بيانات واتساب والبريد الرسمية لم تُضف، وبريد الإدارة غير منشور.

Performance advisor reported two informational unused indexes on the new database. They are retained for timestamp/status queries as data grows; the final Auth advisory is documented above. [Supabase index advisor reference](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

## File attachments — version 1.2.0

- Lint, TypeScript and production build passed.
- Six unit tests, SEO test and eight live backend checks passed.
- Mobile/desktop upload, interrupted upload retry, private admin download with byte comparison and guest access denials passed.
- File picker validation/removal and responsive screenshots verified.
- Supabase bucket is private with 10 MiB limit; wrong-order paths and malformed manifests rejected. No new security advisor findings.
- Synthetic request attachments are removed through the Storage API after tests.
