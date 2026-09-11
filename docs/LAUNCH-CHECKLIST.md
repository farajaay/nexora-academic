# قائمة الإطلاق / Launch checklist

- [ ] إدخال واتساب المنصة الرسمي في site.ts / Set official business WhatsApp.
- [ ] إدخال بريد العمل ومعلومات المشغل / Set business email and operator details.
- [ ] ربط مشروع Supabase مستقل وتطبيق migration / Connect dedicated database and apply migration.
- [ ] إنشاء مستخدم مدير ومنحه عضوية admins / Provision an authorized admin.
- [ ] اختبار طلب فعلي بإذن صاحبه: حفظ → لوحة الإدارة → حالة وسعر → دفعة مؤكدة / Verify end-to-end order and payment tracking.
- [ ] اختبار منع الزوار والمستخدمين غير المدراء من قراءة البيانات / Verify unauthorized reads are denied.
- [ ] تحديد مدة الاحتفاظ ووسيلة طلب التصحيح والحذف / Define retention and privacy contact.
- [ ] مراجعة السياسات وفق هوية المشغل ونموذج الخدمة الفعلي / Review policies for the actual operation.
- [ ] استبدال الشهادات التجريبية أو إبقاء وسمها الصريح / Replace sample testimonials or retain their labels.
- [ ] مراجعة الشعار المؤقت / Review temporary logo.
- [ ] تشغيل lint وtypecheck وtest:unit وbuild وtest:e2e / Run all quality checks.
- [ ] فحص الهاتف وRTL وEN والروابط المباشرة / Verify mobile, RTL, EN and deep links.
- [ ] التأكد من اكتمال GitHub Actions وعمل رابط الإنتاج / Verify successful deployment and live URL.

إطلاق الواجهة وحده لا يعني جاهزية التشغيل التجاري. لا تفعل استقبال البيانات قبل تحديد المشغل وقنوات التواصل والاحتفاظ، ولا تعتبر رسالة واتساب مرسلة لمجرد فتح التطبيق.
