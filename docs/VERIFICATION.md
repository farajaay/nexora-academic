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

## Database integration

A dedicated Supabase project (swgosjtqchcjuvxggxkv, eu-central-1) is provisioned. Live database tests passed: anonymous insertion, prohibited reads and field injection, input constraints, denial for non-admin users even with forged user metadata, admin login/read/update, payment insertion and duplicate/overwrite/delete rejection. Eight Node test results passed. The full browser request-to-admin-to-payment flow also passed on desktop and mobile against the built site and real database. Synthetic orders, payments and the temporary non-admin were removed. Supabase security advisors returned no findings. Public sign-up is disabled; initial credentials remain in a private local file outside Git.

Business WhatsApp/email remain explicit configuration placeholders. Message validation/encoding is tested; no real message was sent to a placeholder. No personal contact information is published. Testimonials remain labeled illustrative examples.

## بالعربية

ربط مشروع Supabase مستقل، وأُنشئ حساب الإدارة. نجحت اختبارات حفظ الطلبات والصلاحيات والدفعات على قاعدة البيانات الحقيقية، ونجح المسار الكامل من المتصفح على الهاتف وسطح المكتب. حذفت سجلات الاختبار. بيانات واتساب والبريد الرسمية لم تُضف، وبريد الإدارة غير منشور.

