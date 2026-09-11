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

## UX/structure fixes and bilingual URLs

An independent QC pass (`docs/QC-REPORT.md`) found and this fixed: a load-time focus bug hijacking the skip link and header navigation, a language-toggle focus-loss bug, two WCAG AA contrast failures (404 numeral, mobile footer tag), a third-party render-blocking font dependency, four heading-order skips, a mobile contact bar outside any landmark, and an accessibility test that only covered 4 of 13 routes.

The same effort then implemented bilingual, indexable URLs: every public route now has an Arabic document at its existing unprefixed URL and an English document at the matching `/en/` URL, with reciprocal `hreflang` tags on each (`x-default` pointing at Arabic) and both listed in the sitemap. Admin and success also get a document per language for toggle and direct-link consistency, but stay `noindex` and out of the sitemap/hreflang. Route titles and descriptions moved from two hand-maintained, already-drifted dictionaries into one shared `src/config/routes.ts`. Two real defects were only found once English content actually got dual URLs: a router design that remounted the page (and lost in-progress form input) when the language toggle navigated between the Arabic and English URL of the same page, and two more WCAG AA contrast failures in small English-only text that the original 4-route axe test never rendered. Both were fixed in the same change.

- `npm run lint`, `npm run typecheck`, `npm run test:unit` (6 tests): passed.
- `npm run test:seo` (rewritten): 5 tests passed — every public route has both documents with correct `lang`/`dir`, self-canonical and all three reciprocal hreflang tags; admin/success have both documents but no hreflang; 404 stays single, unprefixed and hreflang-free; the sitemap lists exactly 18 URLs (9 routes × 2 languages) and nothing private; robots.txt blocks both languages of the private routes.
- `npm run build`: passed, generating 22 route documents plus 404, sitemap and robots.txt.
- `npm run test:e2e`: 16 tests passed on desktop and mobile (2 backend tests correctly skipped without live credentials), including two new tests (a direct `/en/` load with no flash, and a language-toggle test asserting the URL itself changes and internal navigation while browsing English stays under `/en/`) and the widened accessibility test — now 15 routes × 2 viewports including three `/en/` routes, WCAG 2.2 AA plus best-practice — with zero violations.
- Self-hosted fonts verified to produce zero external requests on any route in this environment's sandboxed network.

## تحديثات الواجهة والبنية والمسارات ثنائية اللغة

عولجت نتائج مراجعة جودة مستقلة (`docs/QC-REPORT.md`): خلل في نقل التركيز عند التحميل يعطّل رابط التخطي والتنقل، وفقدان التركيز عند تبديل اللغة، وعيبا تباين ألوان، واعتماد الخطوط على مصدر خارجي، وأربعة تجاوزات في ترتيب العناوين، وشريط تواصل هاتفي خارج أي معلم، واختبار إتاحة كان يغطي 4 من 13 مسارًا فقط.

أُضيفت بعدها مسارات ثنائية اللغة فعلية وقابلة للفهرسة: مستند عربي على الرابط الأصلي بلا بادئة، ومستند إنجليزي مطابق تحت `/en/`، مع وسوم hreflang متبادلة وx-default للعربية، وكلاهما في sitemap. صفحتا الإدارة وحالة الطلب لهما مستند بكل لغة أيضًا لكنهما تبقيان noindex. اكتُشف عيبان حقيقيان أثناء التنفيذ وأُصلحا: تبديل اللغة كان يُفرغ نموذج التواصل الجاري تعبئته، وعيبا تباين إضافيان في نص إنجليزي صغير لم يكشفهما اختبار الإتاحة السابق. جميع الفحوص نجحت بعد الإصلاح.

## مظاهر الموقع الثلاثة

أُضيفت ثلاثة مظاهر بصرية جاهزة (زمردي أكاديمي الافتراضي، بنفسجي ملكي، ليموني منتصف الليل)، كل منها بألوان وخطوط وأسلوب أيقونات مختلف عبر أكثر من 60 موضع تنسيق في `src/index.css` أعيد ربطها بمتغيرات CSS بدل قيم ثابتة. الاختيار يُحفظ في جدول `public.site_settings` (صف واحد، قراءة عامة، تعديل للمدراء فقط عبر RLS) ويظهر فورًا لكل الزوار، لا في متصفح المدير وحده. الخطوط الثلاثة الجديدة (Tajawal، Plus Jakarta Sans، Sora) استُضيفت محليًا بنفس أسلوب خطي الموقع الأصليين.

اكتُشف عيبان أثناء التنفيذ وأُصلحا فورًا: تباين نص فاتر (`--muted`) في مظهر Midnight Lime كان يفشل تحديدًا على خلفية القسم الملوّن `--bg-tinted` رغم نجاحه على الخلفية الأساسية (Ratio 4.29 بدل 4.5 المطلوب) — اكتُشف بفحص axe الموسّع الذي يمر الآن على كل مسار بكل لغة؛ وتسرّب مكتبة Supabase إلى الحزمة الرئيسية للموقع بسبب استيراد ثابت غير مقصود، ما كان يُبطل تحسين "تأجيل قاعدة البيانات" الموثّق سابقًا — أُصلح بجعل الاستيراد ديناميكيًا داخل دوال القراءة والحفظ فقط، وتأكّد التحقق أن الحزمة الرئيسية عادت لحجمها الأصلي.

- `npm run lint`، `npm run typecheck`، `npm run test:unit` (7 اختبارات تشمل اختبارًا جديدًا لسلامة بيانات المظاهر): نجحت.
- `npm run test:seo` (مُحدّث لاحتساب سمة `data-theme` الافتراضية في كل مستند): 5 اختبارات نجحت.
- فحص axe عبر المظاهر الثلاثة و6 مسارات رئيسية: صفر مخالفات بعد إصلاح تباين Midnight Lime.
- `npm run test:e2e`: 18 اختبارًا نجحت على سطح المكتب والهاتف، من ضمنها اختبار جديد يتحقق من المظهر الافتراضي بلا قاعدة بيانات على عدة مسارات. أُضيف أيضًا تدقيق كامل لتبديل المظهر من لوحة الإدارة الحقيقية (حفظ، بقاؤه بعد إعادة التحميل، رفضه من غير المدراء) إلى `tests/e2e/backend.spec.ts` الذي يتخطى التنفيذ بلا بيانات اعتماد حقيقية — لم يُنفَّذ فعليًا في هذه البيئة لعدم توفرها.
- تحقق يدوي بلقطات شاشة للثلاثة مظاهر بالعربية والإنجليزية، ولوحة اختيار المظهر في الإدارة (عبر تجاوز مؤقت للدخول أثناء التطوير فقط، أُزيل قبل أي التزام).
