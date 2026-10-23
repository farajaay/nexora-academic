import type { Bi } from "./agency";

/** Public repository evidence checked on 2026-10-23; see docs/PORTFOLIO-SOURCES.md.
 * Status describes observable delivery, never a client relationship or ROI.
 */
export type Project = {
  id: string;
  title: Bi;
  type: Bi;
  year: string;
  scope: Bi;
  challenge: Bi;
  work: Bi;
  functions: Bi;
  outcome: Bi;
  status: Bi;
  emotion: Bi;
  services: readonly string[];
  stack: readonly string[];
  updated: string;
  repository: string;
  website?: { url: string; label: Bi };
  screen?: { file: string; alt: Bi };
};

export const projects: readonly Project[] = [
  {
    id: "atema-studio",
    title: ["أتما ستوديو", "ATEMA Studio"],
    type: ["منصة حجز للتصوير", "Photography booking platform"],
    year: "2026",
    scope: [
      "موقع ثنائي اللغة، حجز الجلسات وإدارة الاستوديو.",
      "Bilingual website, session booking and studio administration.",
    ],
    challenge: [
      "جمع اختيار الجلسة والحجز ومتابعة الطلب في تجربة عربية واضحة.",
      "Bring session selection, booking and follow-up into a clear Arabic-first experience.",
    ],
    work: [
      "واجهة عربية وإنجليزية لاستوديو تصوير نسائي في المنطقة الشرقية. يضم المشروع مسارات للحجز والإدارة وتكاملات للدفع وإشعارات الحجز.",
      "An Arabic and English interface for a women-only photography studio in the Eastern Province. The project includes booking and administration flows, payment integrations and booking notifications.",
    ],
    functions: [
      "الموقع المنشور يعرّف بالاستوديو وجلسات التصوير؛ توثّق الشيفرة مسارات الحجز والإدارة.",
      "The published site introduces the studio and photography sessions; the source documents booking and administration flows.",
    ],
    outcome: [
      "نسخة تجريبية منشورة على نطاق الاستوديو. يعتمد الدفع والإشعارات على إعداد خدمات التكامل؛ لا تُعرض هنا أرقام حجوزات أو نتائج تجارية.",
      "A published beta on the studio’s domain. Payments and notifications depend on configured integrations; booking volumes and commercial results are not reported here.",
    ],
    status: ["نسخة تجريبية منشورة", "Published beta"],
    emotion: ["الطمأنينة", "Calm"],
    services: ["websites", "uiux", "digital"],
    stack: ["React", "TypeScript", "Vite", "Supabase"],
    updated: "2026-10-23",
    repository: "https://github.com/farajaay/atema-studio",
    website: {
      url: "https://atemastudio.xyz/",
      label: ["افتح الموقع", "Open website"],
    },
    screen: {
      file: "atema-studio.jpg",
      alt: [
        "لقطة فعلية من الصفحة الرئيسية المنشورة لأتما ستوديو",
        "Actual capture of ATEMA Studio’s published homepage",
      ],
    },
  },
  {
    id: "mro-optix",
    title: ["MRO Optix", "MRO Optix"],
    type: ["منتج لمراجعة مواد الصيانة", "Maintenance material-review product"],
    year: "2026",
    scope: [
      "سير عمل Excel لمراجعة مواد التوقفات، وموقع تعريفي ثنائي اللغة.",
      "An Excel turnaround material-review workflow and bilingual product website.",
    ],
    challenge: [
      "الفصل بين الكميات المطلوبة والمقترحة والمعتمدة، وبين المخزون وأوامر الشراء المتأخرة.",
      "Separate requested, proposed and approved quantities, available stock and late purchase orders.",
    ],
    work: [
      "ينظّم المنتج مراجعة المواد في Excel، مع إبقاء اعتماد الهندسة منفصلًا عن المقترحات. يشرح الموقع نطاق الإصدار ويقدّم قائمة مراجعة ومواد إرشادية عامة.",
      "The product structures material review in Excel while keeping engineering approval separate from proposals. Its website explains the edition’s scope and provides a public checklist and guides.",
    ],
    functions: [
      "لقطة من الموقع التعريفي تتضمن تصوّرًا توضيحيًا؛ ليست لقطة من ملف Excel. المنتج سير عمل Excel دون ربط مباشر بنظام ERP.",
      "The website capture includes a labelled illustration, not a workbook screen. The product is an Excel workflow without live ERP integration.",
    ],
    outcome: [
      "الإصدار v2.1 مرشّح للإطلاق والبيع مغلق. ما زال القبول داخل Excel على Windows والتحقق من الحماية والتسليم قيد الاستكمال.",
      "Version 2.1 is a candidate release with sales closed. Native Excel for Windows acceptance, protection validation and delivery testing remain pending.",
    ],
    status: ["إصدار مرشّح؛ البيع مغلق", "Candidate release; sales closed"],
    emotion: ["الوضوح", "Clarity"],
    services: ["product", "industrial", "websites"],
    stack: ["Microsoft Excel", "HTML", "CSS"],
    updated: "2026-09-14",
    repository: "https://github.com/farajaay/mro-optix",
    website: {
      url: "https://farajaay.github.io/mro-optix/",
      label: ["عرض المنتج", "Product overview"],
    },
    screen: {
      file: "mro-optix.jpg",
      alt: [
        "لقطة فعلية من موقع MRO Optix توضح نطاق مراجعة المواد وحالة الإصدار",
        "Actual capture of the MRO Optix website explaining material review and release status",
      ],
    },
  },
  {
    id: "employee-os",
    title: ["Employee OS", "Employee OS"],
    type: ["منتج لتنظيم العمل", "Personal work operating system"],
    year: "2026",
    scope: [
      "أساس تقني عربي لتنظيم اليوم والمشاريع وسير العمل والفعاليات والمسار المهني.",
      "An Arabic-first foundation for Today, Projects, Workflow, Event Radar and Career.",
    ],
    challenge: [
      "تجهيز تطبيق العمل للانتقال التدريجي إلى الويب القابل للتثبيت ثم الهاتف.",
      "Prepare a work application for a staged move to an installable web app and mobile.",
    ],
    work: [
      "يحتوي المستودع على هيكل TypeScript قابل للبناء، مع الموجّه وإطار التطبيق ومخزن الحالة. عُرّفت عقود البيانات والتخزين المؤقت وصندوق الإرسال مع اختبارات لها.",
      "The repository contains a compiling TypeScript skeleton with routing, an application shell and state storage. Data, cache and outbox contracts are defined and tested.",
    ],
    functions: [
      "نظرة موثّقة على المشروع؛ الواجهات الخمس الحالية تعرض عناوين عربية، وبقية الوظائف موثّقة كتذاكر تنفيذ.",
      "Documented project overview: the five current views render Arabic headings, with the remaining functionality tracked as implementation tickets.",
    ],
    outcome: [
      "قيد التطوير. نسخة PWA وتطبيقات iOS وAndroid خطوات مخططة، وليست إصدارات منشورة في المتاجر.",
      "In development. The PWA and iOS/Android applications are planned stages, not published app-store releases.",
    ],
    status: ["قيد التطوير", "In development"],
    emotion: ["التركيز", "Focus"],
    services: ["product", "uiux"],
    stack: ["TypeScript", "Vite", "Vitest"],
    updated: "2026-08-26",
    repository: "https://github.com/farajaay/employee-os",
  },
  {
    id: "majlis",
    title: ["المجلس", "Majlis"],
    type: ["مساحة تعاون لوكلاء الذكاء الاصطناعي", "AI-agent collaboration hub"],
    year: "2026",
    scope: [
      "غرف نقاش، ملفات مشتركة، قرارات موثّقة وسجل محادثة مباشر.",
      "Discussion rooms, shared files, recorded decisions and a live transcript.",
    ],
    challenge: [
      "إبقاء نقاشات عدة وكلاء وقراراتهم قابلة للمتابعة والمراجعة في مكان واحد.",
      "Keep multiple agents’ discussions and decisions visible and auditable in one place.",
    ],
    work: [
      "خادم FastAPI وعميل طرفية يتيحان للإنسان والوكلاء تبادل الرسائل والملفات في غرف مشتركة. يحفظ المشروع السجل والقرارات، ويضم أيضًا تنفيذًا مستضافًا باستخدام Next.js.",
      "A FastAPI server and CLI let humans and agents exchange messages and files in shared rooms. The project persists transcripts and decisions, and also includes a hosted-app implementation in Next.js.",
    ],
    functions: [
      "غرف تجمع الرسائل والملفات المشتركة والقرارات الموثّقة، وواجهة ويب تعرض سجلًا مباشرًا للنقاش.",
      "Discussion rooms collect messages, shared files and recorded decisions; the web interface displays a live transcript.",
    ],
    outcome: [
      "تنفيذ متاح للاستضافة الذاتية مع عميل طرفية. يحتاج إعداد الخادم وبيانات الوصول؛ لا يتوفر رابط عرض عام عامل حاليًا.",
      "A self-hosted implementation and CLI are available. Server setup and access credentials are required; a working public demo is not currently available.",
    ],
    status: ["متاح للاستضافة الذاتية", "Self-hosted application"],
    emotion: ["الوضوح", "Clarity"],
    services: ["product", "digital"],
    stack: ["Python", "FastAPI", "Next.js", "TypeScript"],
    updated: "2026-07-28",
    repository: "https://github.com/farajaay/Majlis",
  },
  {
    id: "saudi-industry-forum",
    title: ["مخطّط منتدى الصناعة السعودي", "Saudi Industry Forum planner"],
    type: ["أداة تخطيط للفعاليات", "Event planning application"],
    year: "2026",
    scope: [
      "تخطيط المشاركة في المنتدى: مهام، ميزانية، مخاطر، مواد إبداعية وجاهزية.",
      "Forum participation planning: actions, budget, risks, creative assets and readiness.",
    ],
    challenge: [
      "تحويل ملفات التخطيط العربية والإنجليزية إلى متابعة عملية مرتبطة بمصدرها.",
      "Turn Arabic and English planning workbooks into an actionable interface tied to their source.",
    ],
    work: [
      "تقرأ الواجهة ملفات Excel الأصلية داخل المتصفح وتعرض لوحات للجاهزية والمهام والميزانية والمخاطر. يمكن تعديل عناصر المتابعة محليًا وتصدير التغييرات أو استيرادها بصيغة JSON.",
      "The interface reads the original Excel workbooks in the browser and presents readiness, action, budget and risk views. Follow-up items can be edited locally, with changes exported or imported as JSON.",
    ],
    functions: [
      "فلاتر للمهام، متابعة المواد الإبداعية واستكشاف ملفات المصدر، مع استيراد التعديلات المحلية وتصديرها بصيغة JSON.",
      "Action filters, creative-production follow-up and source-workbook exploration, with local JSON import and export.",
    ],
    outcome: [
      "واجهة منشورة على GitHub Pages. تُحفظ التعديلات كطبقة محلية في المتصفح، ولا تُكتب داخل ملفات Excel المستضافة.",
      "Published on GitHub Pages. Edits persist as a local browser overlay and do not write back to the hosted Excel files.",
    ],
    status: ["أداة منشورة", "Published application"],
    emotion: ["التركيز", "Focus"],
    services: ["websites", "digital"],
    stack: ["React", "TypeScript", "Vite", "SheetJS"],
    updated: "2026-07-24",
    repository:
      "https://github.com/farajaay/saudi-industry-forum-event-planner",
    website: {
      url: "https://farajaay.github.io/saudi-industry-forum-event-planner/",
      label: ["افتح المخطّط", "Open planner"],
    },
  },
  {
    id: "hadeed-dashboard",
    title: ["لوحة أداء HADEED", "HADEED performance dashboard"],
    type: ["لوحة متابعة تشغيلية", "Operational performance dashboard"],
    year: "2026",
    scope: [
      "عرض تنفيذي ولوحة مدير لمتابعة أداء المشاريع والتوقفات والصيانة الكبرى.",
      "Executive briefing and manager views for project, turnaround and major-maintenance performance.",
    ],
    challenge: [
      "تقديم قرارات الإدارة وتفاصيل بطاقات الأداء من مجموعة بيانات ومحرك تقييم واحد.",
      "Present executive decisions and scorecard detail from one dataset and scoring engine.",
    ],
    work: [
      "صفحة مستقلة تجمع موجزًا للمدير ولوحة تفصيلية لبطاقات الأداء والمخاطر والجاهزية. تتشارك الواجهتان محرك تقييم واحدًا، مع حفظ محلي احتياطي وحالات حفظ مكتوبة.",
      "A self-contained page combines a director briefing with a detailed scorecard, risk and readiness console. Both views share one scoring engine, with local-storage fallback and explicit save states.",
    ],
    functions: [
      "موجز قرارات للإدارة، استثناءات بطاقات الأداء ومتابعة التوريد، بالاعتماد على محرك تقييم مشترك.",
      "Director decision briefing, scorecard exceptions and procurement follow-up, backed by a shared scoring engine.",
    ],
    outcome: [
      "لوحة ثابتة منشورة يمكن تشغيلها دون خطوة بناء. هي أداة مساعدة؛ يبقى مصنف بطاقات الأداء وسجل جودة البيانات المرجع المعتمد.",
      "A published static dashboard that runs without a build step. It is a working aid; the controlled scorecard workbook and data-quality log remain authoritative.",
    ],
    status: ["لوحة منشورة", "Published dashboard"],
    emotion: ["الوضوح", "Clarity"],
    services: ["industrial", "digital"],
    stack: ["HTML", "CSS", "JavaScript"],
    updated: "2026-07-11",
    repository: "https://github.com/farajaay/HADEED-TA-Command-center",
    website: {
      url: "https://farajaay.github.io/HADEED-TA-Command-center/",
      label: ["افتح اللوحة", "Open dashboard"],
    },
  },
];
