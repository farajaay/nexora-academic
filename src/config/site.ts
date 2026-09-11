export type Lang = "ar" | "en";
export type Text = Record<Lang, string>;
export const site = {
  name: { ar: "نيكسورا أكاديمي", en: "Nexora Academic" },
  url: "https://farajaay.github.io/nexora-academic/",
  whatsapp: "REPLACE_WITH_WHATSAPP_NUMBER",
  email: "REPLACE_WITH_BUSINESS_EMAIL",
  currency: { ar: "ر.س", en: "SAR" },
  social: { instagram: "", x: "", linkedin: "" },
  turnaround: {
    ar: "عادةً 3–5 أيام، حسب النطاق والتوفر",
    en: "Usually 3–5 days, subject to scope and availability",
  },
  minimum: 40,
  urgency: { standard: 1, day: 1.3, halfday: 1.5 },
  specializedEnglish: [1.1, 1.2],
  difficulty: { normal: 1, medium: 1.15, advanced: 1.3 },
  extras: { feedback: 30, references: 40 },
};
export const services = [
  {
    id: "homework",
    ar: "شرح ومراجعة واجب قصير",
    en: "Short assignment explanation & review",
    price: 40,
    unit: "task",
    category: "learning",
    icon: "spark",
  },
  {
    id: "math",
    ar: "شرح مسائل رياضيات أو فيزياء أو إحصاء",
    en: "Math, physics & statistics guidance",
    price: 80,
    unit: "task",
    category: "learning",
    icon: "math",
  },
  {
    id: "report",
    ar: "مراجعة وتحسين تقرير 3–5 صفحات",
    en: "Report review & improvement · 3–5 pages",
    price: 100,
    unit: "report",
    category: "writing",
    icon: "file",
  },
  {
    id: "research",
    ar: "مراجعة بحث 10–15 صفحة",
    en: "Research review · 10–15 pages",
    price: 250,
    unit: "research",
    category: "writing",
    icon: "file",
  },
  {
    id: "slides",
    ar: "عرض تقديمي بمحتوى جاهز",
    en: "Presentation with provided content",
    price: 100,
    unit: "deck",
    category: "design",
    icon: "slides",
  },
  {
    id: "visual",
    ar: "عرض مع تلخيص وتصميم بصري",
    en: "Presentation summary & visual design",
    price: 180,
    unit: "deck",
    category: "design",
    icon: "slides",
  },
  {
    id: "chapter",
    ar: "تلخيص أو شرح فصل",
    en: "Chapter summary or explanation",
    price: 60,
    unit: "chapter",
    category: "learning",
    icon: "spark",
  },
  {
    id: "code",
    ar: "شرح برمجة وتصحيح أخطاء",
    en: "Programming guidance & debugging",
    price: 120,
    unit: "hour",
    category: "technical",
    icon: "code",
  },
  {
    id: "cad",
    ar: "دعم رسم هندسي وCAD",
    en: "Engineering drawing & CAD support",
    price: 150,
    unit: "hour",
    category: "technical",
    icon: "cad",
  },
  {
    id: "translation",
    ar: "ترجمة عامة",
    en: "General translation",
    price: 30,
    unit: "words",
    category: "writing",
    icon: "language",
  },
  {
    id: "proofread",
    ar: "تدقيق لغوي",
    en: "Language proofreading",
    price: 10,
    unit: "words",
    category: "writing",
    icon: "language",
  },
  {
    id: "graduation",
    ar: "إرشاد مشروع تخرج",
    en: "Graduation project mentoring",
    price: 0,
    unit: "scope",
    category: "technical",
    icon: "cad",
  },
] as const;
export const units: Record<string, Text> = {
  task: {
    ar: "عدد الواجبات / مجموعات المسائل",
    en: "Assignments / problem sets",
  },
  report: {
    ar: "عدد التقارير (3–5 صفحات لكل تقرير)",
    en: "Reports (3–5 pages each)",
  },
  research: {
    ar: "عدد الأبحاث (10–15 صفحة لكل بحث)",
    en: "Papers (10–15 pages each)",
  },
  deck: {
    ar: "عدد العروض (النطاق يراجع لاحقًا)",
    en: "Presentations (scope reviewed later)",
  },
  chapter: { ar: "عدد الفصول", en: "Chapters" },
  hour: { ar: "عدد الساعات", en: "Hours" },
  words: {
    ar: "عدد الكلمات (تحتسب كل 250 كلمة)",
    en: "Words (charged per 250 words)",
  },
  scope: { ar: "عدد الجلسات المقترح", en: "Suggested sessions" },
};
export const options = {
  stage: [
    { id: "secondary", ar: "الثانوية", en: "High school" },
    { id: "university", ar: "الجامعة", en: "University" },
    { id: "postgraduate", ar: "الدراسات العليا", en: "Postgraduate" },
  ],
  language: [
    { id: "ar", ar: "العربية", en: "Arabic" },
    { id: "en", ar: "الإنجليزية العامة", en: "General English" },
    {
      id: "specialized",
      ar: "الإنجليزية المتخصصة (+10–20%)",
      en: "Specialized English (+10–20%)",
    },
  ],
  deadline: [
    { id: "standard", ar: "عادي · 3–5 أيام", en: "Standard · 3–5 days" },
    { id: "day", ar: "خلال 24 ساعة (+30%)", en: "Within 24 hours (+30%)" },
    { id: "halfday", ar: "خلال 12 ساعة (+50%)", en: "Within 12 hours (+50%)" },
  ],
  difficulty: [
    { id: "normal", ar: "اعتيادي", en: "Standard" },
    {
      id: "medium",
      ar: "متوسط (+15% تقديري)",
      en: "Intermediate (+15% estimate)",
    },
    {
      id: "advanced",
      ar: "متقدم (+30% تقديري)",
      en: "Advanced (+30% estimate)",
    },
  ],
};
export const integrity: Text = {
  ar: "تقدم نيكسورا خدمات تعليمية تشمل الشرح، المراجعة، التغذية الراجعة، التدقيق وتحسين المهارات. يبقى الطالب مسؤولًا عن فهم العمل وصحة البيانات والالتزام بأنظمة مؤسسته التعليمية.",
  en: "Nexora provides educational services including explanation, review, feedback, proofreading and skill development. Students remain responsible for understanding their work, data accuracy and compliance with their institution’s rules.",
};
export const contactReady = {
  whatsapp: /^9665\d{8}$/.test(site.whatsapp),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email),
};
