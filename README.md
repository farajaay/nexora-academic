# Nexora Academic | نيكسورا أكاديمي

منصة سعودية للدعم الأكاديمي تشمل الشرح والمراجعة والتدقيق وتحسين التقارير والعروض ودعم البرمجة وCAD وإرشاد مشاريع التخرج. واجهة ثابتة React + TypeScript + Vite + Tailwind CSS، مع تكامل Supabase منفصل للطلبات والإدارة والدفعات وفق المتطلب الإضافي.

**الموقع:** https://farajaay.github.io/nexora-academic/

**المستودع:** https://github.com/farajaay/nexora-academic

## المميزات

- العربية RTL والإنجليزية LTR مع حفظ تفضيل اللغة فقط.
- الرئيسية، الخدمات والأسعار، آلية الطلب، الحاسبة، الأسئلة، التواصل، الخصوصية، الشروط، النزاهة، حالة الطلب ولوحة الإدارة.
- أسعار من مصدر واحد، حساب الاستعجال واللغة والصعوبة والإضافات، ونقل الاختيارات للنموذج.
- تحقق واضح من الجوال السعودي وروابط الملفات والموافقة؛ واتساب وmailto ونسخ التفاصيل.
- إدارة محمية عبر Supabase Auth وRLS، حالات الطلبات والأسعار وسجل دفعات يدوي بمرجع فريد.
- تصميم متجاوب، لوحة مفاتيح، حركات مخفضة، بيانات SEO لكل مسار وروابط مباشرة متوافقة مع GitHub Pages.
- لا توجد مفاتيح سرية أو أرقام تواصل شخصية أو حسابات إدارة افتراضية.

## التشغيل

المتطلبات: Node.js 24 وnpm وGit.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

في PowerShell استخدم `Copy-Item .env.example .env.local`. افتح http://localhost:5173/nexora-academic/.

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run preview
```

لاختبارات المتصفح: شغّل خادم التطوير ثم `npx playwright install chromium` و`npm run test:e2e`. لاختبار الإنتاج عيّن `TEST_BASE_URL` للرابط المنشور. تقارير الاختبار واللقطات لا تدخل Git.

## النشر

المستودع يستخدم `.github/workflows/deploy.yml`. من Settings → Pages اختر GitHub Actions. كل push إلى `main` يشغّل lint وtypecheck واختبارات التسعير ثم يبني وينشر. Vite base هو `/nexora-academic/`؛ يولد `scripts/seo.mjs` مستندًا لكل مسار و404 وsitemap وrobots. لا توجد حاجة إلى خادم Node في الإنتاج.

اضبط متغيري Actions `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` لتفعيل قاعدة البيانات. مفتاح publishable آمن للنشر مع سياسات RLS المرفقة؛ لا تستخدم service_role أو أي مفتاح سري. إن لم تضبط الربط، تظهر حالة عدم توفر صريحة ولا تدّعي الواجهة حفظ الطلب.

## التعديل والإطلاق

عدّل الاسم والأسعار ورقم واتساب والبريد والروابط في `src/config/site.ts`. بيانات التواصل placeholders مقصودة، والأزرار لا تتفعل قبل استبدالها. الشعار في `public/brand-mark.svg`، والألوان والخطوط في `src/index.css`.

- [دليل الإعداد والهوية وقاعدة البيانات](docs/CONFIGURATION.md)
- [دليل المحتوى](docs/CONTENT-GUIDE.md)
- [قائمة الإطلاق](docs/LAUNCH-CHECKLIST.md)
- [سجل التغييرات](CHANGELOG.md)

تطبق migration قاعدة البيانات من `supabase/migrations/`. أنشئ حساب المدير في Supabase Auth ثم أضف UUID الخاص به إلى `public.admins` من SQL Editor. لا يوجد تسجيل ذاتي يمنح الإدارة. الجلسة في الذاكرة وتنتهي بإعادة تحميل الصفحة. تتبع الدفعات يدوي وليس بوابة دفع؛ لا يجمع الموقع بيانات البطاقات.

الشهادات نماذج مؤقتة موسومة، والشعار مؤقت. يجب تحديد مشغل المنصة وقنوات التواصل وسياسة الاحتفاظ الفعلية ومراجعة السياسات قبل استقبال بيانات حقيقية. لا يضمن الموقع درجات ولا يقدم أداء اختبارات أو انتحالًا.

## English

Nexora Academic is a Saudi educational support platform for school, university and postgraduate students. It offers explanation, review, proofreading, presentation improvement, programming/CAD guidance and graduation project mentoring. Students remain responsible for understanding their work and following institutional rules.

The frontend is static React + TypeScript + Vite + Tailwind CSS and deploys to GitHub Pages. A separate Supabase integration provides persistent requests, authorized administration and a manual payment ledger, as requested in the additional scope.

**Live site:** https://farajaay.github.io/nexora-academic/

**Repository:** https://github.com/farajaay/nexora-academic

### Run and build

Use Node.js 24. Run `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. The local URL includes `/nexora-academic/`. Run `npm run lint`, `npm run typecheck`, `npm run test:unit`, and `npm run build`. `npm run preview` serves the build. Install Chromium with `npx playwright install chromium`, keep the dev server running and run `npm run test:e2e` for desktop/mobile interaction and accessibility checks.

### Deploy and configure

Select GitHub Actions in repository Pages settings. Every push to main runs checks and deploys `dist`. Set the public Supabase URL/key as Actions variables. Apply the included SQL migration, create an Auth user and provision its UUID in the admins table. Never expose service-role or secret keys. Browser requests are protected by column grants and RLS.

The shared configuration at `src/config/site.ts` controls names, contact placeholders, pricing, currency, timing and links. Replace only with real business details. Change `public/brand-mark.svg` and `src/index.css` for branding. Update the Vite base and site URL if renaming the repository. Each route has a generated HTML document for direct links and metadata; the build also creates a 404 page, sitemap and robots file.

Academic integrity is central. Testimonials are explicitly illustrative. WhatsApp/email links prepare a message; the user must complete sending in the external app. The success screen does not confuse message preparation with database submission. Payments are recorded manually after receipt, not processed by the site.

MIT license applies to the source code. Review the launch checklist before operating the service.
