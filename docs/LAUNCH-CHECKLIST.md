# قائمة الإطلاق / Launch checklist

- [ ] إدخال واتساب المنصة الرسمي في site.ts / Set official business WhatsApp.
- [ ] إدخال بريد العمل ومعلومات المشغل / Set business email and operator details.
- [x] ربط مشروع Supabase مستقل وتطبيق migration / Connect dedicated database and apply migration.
- [x] إنشاء مستخدم مدير ومنحه عضوية admins / Provision an authorized admin.
- [x] اختبار طلب اصطناعي ودفعة اختبار: حفظ → لوحة الإدارة → حالة وسعر → سجل دفعة، ثم حذف سجلات الاختبار / Verify end-to-end flow with synthetic data and cleanup.
- [x] اختبار منع الزوار والمستخدمين غير المدراء من قراءة البيانات / Verify unauthorized reads are denied.
- [ ] تحديد مدة الاحتفاظ ووسيلة طلب التصحيح والحذف / Define retention and privacy contact.
- [ ] مراجعة السياسات وفق هوية المشغل ونموذج الخدمة الفعلي / Review policies for the actual operation.
- [x] استبدال الشهادات التجريبية أو إبقاء وسمها الصريح / Replace sample testimonials or retain their labels.
- [ ] مراجعة الشعار المؤقت / Review temporary logo.
- [x] تشغيل lint وtypecheck وtest:unit وbuild وtest:e2e / Run all quality checks.
- [x] فحص الهاتف وRTL وEN والروابط المباشرة / Verify mobile, RTL, EN and deep links.
- [x] التأكد من اكتمال GitHub Actions وعمل رابط الإنتاج / Verify successful deployment and live URL.
- [x] التحقق من مستندات `/en/` وhreflang المتبادل في كل مسار عام وsitemap / Verify `/en/` documents and reciprocal hreflang on every public route, and the sitemap.
- [ ] تسجيل رابط sitemap.xml الجديد في Google Search Console / Submit the updated sitemap.xml in Google Search Console.
- [ ] تطبيق migration جدول مظهر الموقع (`site_settings`) على قاعدة الإنتاج، ثم اختيار المظهر من لوحة الإدارة / Apply the site theme migration (`site_settings`) to the production database, then pick a theme from the admin panel.

إطلاق الواجهة وحده لا يعني جاهزية التشغيل التجاري. لا تفعل استقبال البيانات قبل تحديد المشغل وقنوات التواصل والاحتفاظ، ولا تعتبر رسالة واتساب مرسلة لمجرد فتح التطبيق.
