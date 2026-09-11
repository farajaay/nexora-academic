import { site, type Lang, type Text } from "./site.ts";

export type RouteMeta = {
  /** Un-prefixed path segment; "" is the home route. No leading/trailing slash. */
  path: string;
  title: Text;
  description: Text;
};

// Public, bilingual, indexable routes. Each gets its own document at both
// `${site.url}<path>/` (Arabic, unprefixed — unchanged from before bilingual
// URLs existed) and `${site.url}en/<path>/` (English, new), with reciprocal
// hreflang tags between the two and an entry in the sitemap.
//
// This is the single source of truth for route titles/descriptions: both the
// client router (src/App.tsx) and the static document generator
// (scripts/seo.mjs) import it, so the two can no longer drift apart the way
// the previous Arabic-only, hand-duplicated copy in scripts/seo.mjs did.
export const publicRoutes: RouteMeta[] = [
  {
    path: "",
    title: {
      ar: "دعم أكاديمي أوضح، أسرع، وأكثر احترافية",
      en: "Clearer academic support",
    },
    description: {
      ar: "شرح ومراجعة وتطوير للأعمال الأكاديمية للثانوية والجامعة والدراسات العليا.",
      en: "Explanation, review and academic development for school, university and postgraduate students.",
    },
  },
  {
    path: "services",
    title: { ar: "الخدمات والأسعار", en: "Services & pricing" },
    description: {
      ar: "أسعار تبدأ من 40 ر.س للشرح والمراجعة والتدقيق والبرمجة وCAD.",
      en: "Academic support pricing from SAR 40: explanation, review, proofreading, coding and CAD.",
    },
  },
  {
    path: "how-it-works",
    title: { ar: "آلية الطلب", en: "How it works" },
    description: {
      ar: "تعرف على خطوات إرسال الطلب ومراجعة النطاق وتأكيد السعر.",
      en: "Learn how to submit a request, review scope and confirm the price.",
    },
  },
  {
    path: "calculator",
    title: { ar: "حاسبة السعر", en: "Price calculator" },
    description: {
      ar: "احسب النطاق السعري التقديري حسب الخدمة والموعد وحجم العمل.",
      en: "Estimate your price based on service, deadline and work quantity.",
    },
  },
  {
    path: "contact",
    title: { ar: "تواصل معنا واطلب الخدمة", en: "Contact & request a service" },
    description: {
      ar: "أرسل تفاصيل طلب الدعم الأكاديمي بأمان أو جهّز رسالة واتساب وبريد.",
      en: "Submit your academic support request or prepare a WhatsApp or email message.",
    },
  },
  {
    path: "faq",
    title: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
    description: {
      ar: "إجابات حول الأسعار والتعديلات والمواعيد والنزاهة الأكاديمية.",
      en: "Answers about pricing, revisions, delivery and academic integrity.",
    },
  },
  {
    path: "privacy",
    title: { ar: "سياسة الخصوصية", en: "Privacy policy" },
    description: {
      ar: "كيف نتعامل مع بياناتك وطلباتك وتفضيلاتك.",
      en: "How we handle your information, requests and preferences.",
    },
  },
  {
    path: "terms",
    title: { ar: "الشروط والأحكام", en: "Terms & conditions" },
    description: {
      ar: "شروط الخدمة والسعر والتعديلات ومسؤولية الطالب.",
      en: "Service terms, pricing, revisions and student responsibilities.",
    },
  },
  {
    path: "integrity",
    title: { ar: "سياسة النزاهة الأكاديمية", en: "Academic integrity policy" },
    description: {
      ar: "التزامنا بالشرح والمراجعة والإرشاد والتعلم المسؤول.",
      en: "Our commitment to explanation, review, mentoring and responsible learning.",
    },
  },
];

// Single-purpose routes that also get an /en/ mirror (so the language toggle
// and direct links behave consistently everywhere), but are always noindex,
// carry no hreflang tags and are never listed in the sitemap — they are not
// content anyone should discover through search or cross-language linking.
export const privateRoutes: RouteMeta[] = [
  {
    path: "success",
    title: { ar: "حالة الطلب", en: "Request status" },
    description: {
      ar: "تابع حالة إرسال طلبك.",
      en: "View your request submission status.",
    },
  },
  {
    path: "admin",
    title: { ar: "لوحة الإدارة", en: "Administration" },
    description: {
      ar: "إدارة خاصة للطلبات والدفعات.",
      en: "Private order and payment administration.",
    },
  },
];

export const allRoutes: RouteMeta[] = [...publicRoutes, ...privateRoutes];

/** Absolute URL for a route's document in the given language. */
export function urlFor(path: string, lang: Lang): string {
  const slug = path ? `${path}/` : "";
  return lang === "en" ? `${site.url}en/${slug}` : `${site.url}${slug}`;
}
