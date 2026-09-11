# Verification — 2026-09-11

Verified against the built static site and the live GitHub Pages deployment:

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm run test:unit`: 5 tests passed (pricing, minimum, rush multipliers, word blocks, custom scope, query handoff, validation, message encoding).
- `node --test tests/seo.test.mjs`: 1 test passed (route descriptions, canonical URLs, generated documents, noindex and sitemap exclusion).
- `npm run build`: passed. Main JavaScript approximately 105 kB gzip; CSS approximately 8 kB gzip. Admin code is a separate lazy-loaded chunk.
- `npm run test:e2e`: 10 tests passed on the built site, then all 10 passed against the live deployment. Chromium desktop 1440×1000 and mobile iPhone 13 dimensions.
- Axe checks for WCAG 2 A/AA and 2.1 AA: no violations reported on home, calculator, contact and admin login for both tested sizes. Automated checks do not replace all manual accessibility evaluation.
- Visually inspected Arabic desktop and mobile home screenshots; English and calculator screenshots are available locally in ignored `artifacts/`.
- Direct home, services, calculator, admin, sitemap and robots URLs returned HTTP 200. Unknown routes render the custom 404 interface.
- `npm audit --omit=dev`: zero known vulnerabilities at verification time.

## Explicitly pending

The database migration and client integration are implemented, but a dedicated Supabase project and admin provisioning are pending organization selection. No claim is made that live request persistence, RLS enforcement or payment operations have been tested against a real database yet. Submission and admin sign-in are disabled when backend settings are absent.

Business WhatsApp/email remain explicit configuration placeholders. Message validation/encoding is tested; no real message was sent to a placeholder. No personal contact information is published. Testimonials remain labeled illustrative examples.

## بالعربية

الواجهة المنشورة اجتازت الاختبارات أعلاه، بما فيها الروابط المباشرة وRTL وتبديل اللغة ونقل اختيارات الحاسبة والتحقق من المدخلات. ربط قاعدة البيانات واختبار حفظ الطلبات وصلاحيات الإدارة والدفعات فعليًا ما زال ينتظر تحديد المؤسسة. لا تعتبر هذه الوظائف مفعّلة بمجرد وجود واجهتها. بيانات واتساب والبريد الرسمية لم تُضف.
