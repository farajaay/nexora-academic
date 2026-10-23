import {
  BarChart3,
  Boxes,
  Clapperboard,
  Factory,
  Globe,
  MousePointerClick,
  PenTool,
  type LucideIcon,
} from "lucide-react";

export type Bi = readonly [ar: string, en: string];
export type AgencyService = {
  id: string;
  icon: LucideIcon;
  name: Bi;
  tagline: Bi;
  intro: Bi;
  deliverables: readonly Bi[];
  process: readonly Bi[];
};

// NEXORA Digital Solutions services. Every project is scoped and quoted
// individually, so no fixed price is shown. Ids double as /studio#<id>
// deep links and as the service value in the project request form.
export const agencyServices: readonly AgencyService[] = [
  {
    id: "websites",
    icon: Globe,
    name: ["تطوير المواقع والتطبيقات", "Website development"],
    tagline: ["سريعة، آمنة، وبلغتين.", "Fast, secure and bilingual."],
    intro: [
      "مواقع وتطبيقات ويب متجاوبة تدعم العربية والإنجليزية، مع لوحات تحكم وقواعد بيانات وأداء عالٍ.",
      "Responsive websites and web apps in Arabic and English, with dashboards, databases and high performance.",
    ],
    deliverables: [
      ["مواقع تعريفية ومتاجر إلكترونية", "Business sites and online stores"],
      ["تطبيقات ويب ولوحات تحكم", "Web apps and dashboards"],
      ["ربط قواعد البيانات والدفع", "Database and payment integration"],
      ["استضافة وصيانة وتحسين للبحث", "Hosting, maintenance and SEO"],
    ],
    process: [
      ["تحليل المتطلبات", "Requirements"],
      ["التصميم", "Design"],
      ["التطوير والاختبار", "Development and QA"],
      ["الإطلاق والدعم", "Launch and support"],
    ],
  },
  {
    id: "branding",
    icon: PenTool,
    name: ["تصميم الهوية التجارية", "Brand identity design"],
    tagline: ["هوية تُروى قبل أن تُرى.", "An identity that tells your story."],
    intro: [
      "نبني هوية بصرية متكاملة تعكس رؤيتك وقيمك، من الفكرة الأولى حتى دليل الاستخدام.",
      "A complete visual identity that reflects your vision and values, from first idea to usage guide.",
    ],
    deliverables: [
      ["الشعار ونسخه المختلفة", "Logo and its variations"],
      ["لوحة الألوان والخطوط", "Color palette and typography"],
      ["دليل الهوية البصرية", "Brand guidelines"],
      ["المطبوعات وقوالب التواصل الاجتماعي", "Print and social templates"],
    ],
    process: [
      ["جلسة اكتشاف", "Discovery session"],
      ["مفاهيم أولية", "Initial concepts"],
      ["تطوير وتعديل", "Refinement"],
      ["تسليم الملفات", "Final handover"],
    ],
  },
  {
    id: "uiux",
    icon: MousePointerClick,
    name: ["تصميم واجهات وتجربة المستخدم", "UI/UX design"],
    tagline: [
      "تصميم يفهمه المستخدم من أول نظرة.",
      "Design users get at first glance.",
    ],
    intro: [
      "واجهات تتمحور حول المستخدم: بحث، ورحلات استخدام، ونماذج تفاعلية جاهزة للتطوير.",
      "User-centered interfaces: research, user journeys and interactive prototypes ready for development.",
    ],
    deliverables: [
      ["بحث المستخدم ورحلات الاستخدام", "User research and journeys"],
      ["مخططات هيكلية", "Wireframes"],
      ["نماذج تفاعلية عالية الدقة", "High-fidelity interactive prototypes"],
      ["نظام تصميم ومكوّنات", "Design system and components"],
    ],
    process: [
      ["الفهم", "Understand"],
      ["الهيكلة", "Structure"],
      ["التصميم", "Design"],
      ["الاختبار والتسليم", "Test and hand off"],
    ],
  },
  {
    id: "content",
    icon: Clapperboard,
    name: ["إنتاج المحتوى", "Content production"],
    tagline: ["محتوى يُرى ويُتذكّر.", "Content that is seen and remembered."],
    intro: [
      "محتوى بصري ورقمي احترافي لعلامتك: تصاميم، وموشن، وكتابة إبداعية بالعربية والإنجليزية.",
      "Professional visual and digital content for your brand: design, motion and copywriting in Arabic and English.",
    ],
    deliverables: [
      ["تصاميم منصات التواصل", "Social media design"],
      ["موشن جرافيك وفيديو قصير", "Motion graphics and short video"],
      ["كتابة إبداعية ومحتوى للموقع", "Copywriting and web content"],
      ["تقويم محتوى شهري", "Monthly content calendar"],
    ],
    process: [
      ["الاستراتيجية", "Strategy"],
      ["الأفكار", "Ideas"],
      ["الإنتاج", "Production"],
      ["النشر والقياس", "Publish and measure"],
    ],
  },
  {
    id: "digital",
    icon: BarChart3,
    name: ["الحلول الرقمية", "Digital solutions"],
    tagline: ["أنظمة مصمّمة لنموّك.", "Systems tailored to your growth."],
    intro: [
      "حلول مخصّصة تؤتمت العمل وتربط أنظمتك: لوحات مؤشرات، وأتمتة إجراءات، وتكاملات.",
      "Tailored solutions that automate work and connect your systems: dashboards, workflow automation and integrations.",
    ],
    deliverables: [
      ["لوحات مؤشرات الأداء", "KPI dashboards"],
      ["أتمتة الإجراءات والنماذج", "Workflow and form automation"],
      ["ربط الأنظمة والتكاملات", "System integrations"],
      ["تقارير مالية وتشغيلية", "Financial and operational reporting"],
    ],
    process: [
      ["تشخيص الوضع", "Diagnose"],
      ["تصميم الحل", "Design the solution"],
      ["البناء والتجربة", "Build and pilot"],
      ["التدريب والتشغيل", "Train and run"],
    ],
  },
  {
    id: "product",
    icon: Boxes,
    name: ["تطوير المنتجات", "Product development"],
    tagline: [
      "من الفكرة إلى منتج يُستخدم.",
      "From idea to a product people use.",
    ],
    intro: [
      "نحوّل فكرتك إلى منتج رقمي قابل للإطلاق: تحليل السوق، والنموذج الأولي، وخطة الإصدار.",
      "We turn your idea into a launch-ready digital product: market analysis, prototype and release plan.",
    ],
    deliverables: [
      ["تحليل السوق والمستخدم", "Market and user analysis"],
      ["خريطة المنتج والأولويات", "Product roadmap and priorities"],
      ["نموذج أولي قابل للتجربة", "Testable prototype"],
      ["منتج أولي قابل للإطلاق (MVP)", "Minimum viable product (MVP)"],
    ],
    process: [
      ["تحديد المشكلة", "Problem definition"],
      ["التصميم والنمذجة", "Design and prototyping"],
      ["البناء والاختبار", "Build and test"],
      ["الإطلاق والتحسين", "Launch and iterate"],
    ],
  },
  {
    id: "industrial",
    icon: Factory,
    name: ["الاستشارات الصناعية", "Industrial consultation"],
    tagline: [
      "كفاءة تشغيلية تُقاس بالأرقام.",
      "Operational efficiency you can measure.",
    ],
    intro: [
      "نساعد المصانع والمنشآت على رفع الكفاءة عبر الأتمتة وتحسين العمليات والتخطيط المالي والتشغيلي.",
      "We help plants and facilities raise efficiency through automation, process improvement and operational planning.",
    ],
    deliverables: [
      ["تقييم الأتمتة وأنظمة التحكم", "Automation and control assessment"],
      ["تحسين العمليات (Lean)", "Lean process improvement"],
      ["التخطيط التشغيلي والميزانيات", "Operations planning and budgeting"],
      ["مؤشرات الأداء ولوحات المتابعة", "KPIs and performance dashboards"],
    ],
    process: [
      ["زيارة وتشخيص", "Site visit and diagnosis"],
      ["تحليل البيانات", "Data analysis"],
      ["خطة التحسين", "Improvement plan"],
      ["المتابعة والقياس", "Follow-up and measurement"],
    ],
  },
];

export function serviceName(id: string, lang: "ar" | "en"): string {
  const s = agencyServices.find((x) => x.id === id);
  return s ? s.name[lang === "ar" ? 0 : 1] : id;
}
