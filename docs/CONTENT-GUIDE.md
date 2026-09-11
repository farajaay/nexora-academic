# دليل المحتوى / Content guide

## النبرة

لغة عربية واضحة ومهنية وودودة. نستخدم «دعم أكاديمي»، «شرح ومراجعة»، «إرشاد»، «تدقيق» و«تحسين وتطوير». نخاطب الثانوية والجامعة والدراسات العليا دون وعود بنتيجة أو درجة.

لا نعرض تنفيذ اختبارات أو انتحالًا أو اختلاق مراجع وبيانات، ولا تسليم أعمال نيابة عن الطالب. النص الأساسي لسياسة النزاهة في `src/config/site.ts` ويجب الحفاظ على معناه.

الشهادات الحالية نماذج توضيحية مؤقتة تحمل وسمًا ظاهرًا. لا تحذف الوسم إلا عند الاستبدال بشهادات حقيقية مأذون بنشرها. لا تنشر أسماء أو صور عملاء دون موافقة.

جميع الأسعار «يبدأ من». أكد أن السعر النهائي بعد مراجعة الملف، وأن العاجل حسب التوفر. احتفظ بنسخة عربية وإنجليزية لكل نص في الصفحات والنماذج — للإنجليزية الآن رابط مستقل قابل للفهرسة تحت `/en/`، وليست مجرد نص بديل خلف زر تبديل، فجودة الترجمة تؤثر مباشرة في ظهور الصفحة بالبحث الإنجليزي. عند إضافة صفحة عامة جديدة، أضف عنوانها ووصفها بكلا اللغتين في `src/config/routes.ts` فقط؛ لا حاجة لتكرارها في مكان آخر. عند إضافة خدمة، حدث schema الخاص بالتحقق في قاعدة البيانات أيضًا.

## English

Use clear, friendly and professional language. Describe educational support, explanation, review, mentoring, proofreading and skill development. Never promise grades or offer exam impersonation, plagiarism, fabricated references or work submitted on a student's behalf.

Testimonials are labeled temporary examples. Replace them only with consented, authentic feedback. Maintain both Arabic and English text — English now has its own indexable URL under `/en/` rather than being text behind a toggle, so translation quality directly affects how the page ranks in English search. Add a new public page's title and description in both languages to `src/config/routes.ts` only; nothing else needs updating. Every price is a starting price confirmed after scope review. Keep service identifiers synchronized with database validation when adding a service.
