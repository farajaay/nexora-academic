# دليل الإعداد والتعديل / Configuration guide

## بيانات المنصة

المصدر الموحد: `src/config/site.ts`.

- `whatsapp`: استبدل `REPLACE_WITH_WHATSAPP_NUMBER` برقم المنصة بصيغة `9665XXXXXXXX` دون + أو مسافات. لا تستخدم رقمًا وهميًا نشطًا. الأزرار معطلة حتى يصبح الرقم صحيحًا.
- `email`: استبدل `REPLACE_WITH_BUSINESS_EMAIL` ببريد العمل الرسمي. يتفعّل mailto بعد التعديل.
- `services`: الأسعار والتسميات والوحدات. البطاقات والحاسبة تقرآن القائمة نفسها.
- `urgency`, `difficulty`, `specializedEnglish`, `extras`, `minimum`: معاملات السعر. تعديل أسعار الصعوبة والإضافات يستلزم تحديث التسميات التوضيحية بجوارها.
- `url`: رابط الإنتاج مع `/` في النهاية. يولد منه canonical وsitemap وSchema عند البناء.
- `social`: الروابط الفارغة لا تظهر.
- `turnaround`: المدة العادية المعروضة.

## الهوية

الشعار الهندسي المؤقت في `public/brand-mark.svg` يستخدم كذلك favicon. تركيب الاسم في `src/ui.tsx`، والألوان والخطوط والتصميم في `src/index.css`. الصور المرفقة كانت مرجعًا بصريًا وليست صور واجهة منشورة. لا توجد صور stock أو إحصاءات عملاء مختلقة.

## قاعدة البيانات والإدارة

1. أنشئ مشروع Supabase مستقلًا.
2. طبّق `supabase/migrations/20260911133120_orders_admin_payments.sql` في SQL Editor أو CLI.
3. ضع رابط المشروع والمفتاح **publishable** في `.env.local` لتجربتك المحلية.
4. أضف `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` إلى GitHub → Settings → Secrets and variables → Actions → Variables.
5. أنشئ مستخدم الإدارة من Supabase → Authentication → Users. استخدم بريدك الإداري الحقيقي وكلمة مرور قوية؛ لا تضف كلمة المرور إلى المستودع.
6. من SQL Editor، أضف UUID المستخدم: `insert into public.admins(user_id) values ('USER_UUID');`.
7. افتح `/nexora-academic/admin/`. لا توجد صفحة تسجيل ذاتي أو بيانات دخول افتراضية. تسجيل الدخول وحده لا يمنح صلاحية الإدارة.
8. اختبر حفظ طلب، وصوله للوحة، تغيير حالته وسعره، ثم تسجيل دفعة مؤكدة بمرجع فريد.

تخضع جميع الجداول لـRLS. الزائر يستطيع إنشاء طلب ولا يستطيع قراءة أي طلبات أو دفعات. لا يستطيع المتصفح إضافة مدير. الدفعات سجل إداري يدوي ولا تمثل تحصيلًا آليًا أو فاتورة ضريبية. لا تُخزّن بيانات بطاقات. الدفعات لا تعدّل ولا تحذف من الواجهة؛ تصحيح التسجيلات يتم بواسطة مشغل قاعدة البيانات مع توثيق السبب. راقب إساءة استخدام نموذج الاستقبال وأضف CAPTCHA/حدود طلبات قبل الحمل العام الكبير.

احتفظ بنسخ احتياطية وفق خطة مزودك. حدد سياسة احتفاظ فعلية وبريد استقبال طلبات الخصوصية قبل استقبال بيانات حقيقية. منطقة الاستضافة ومقدم الخدمة يحتاجان مراعاة متطلبات المشغل عند الإطلاق.

## English

Edit `src/config/site.ts` for the business WhatsApp number, business email, canonical URL, prices, multipliers and social links. Replace `public/brand-mark.svg` for the logo/favicon and edit `src/index.css` for the visual identity. Prices use one source of truth.

Apply the SQL migration to a dedicated Supabase project, configure the two public Vite environment variables, create an Auth user in the Supabase dashboard, and add that user's UUID to `public.admins` through the SQL editor. Never expose service-role credentials. Anonymous visitors may insert requests but cannot read them. Only provisioned admins can read orders, update their status/quote and append confirmed payments. Payment references are unique. No real funds are collected by the site.

Run the GitHub Pages workflow after editing configuration. Public environment variables are intentionally browser-visible and rely on RLS, not secrecy. Every `VITE_` variable is public; never place secrets in them.
