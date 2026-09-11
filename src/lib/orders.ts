import { options, services, units, type Lang } from "../config/site";
import type { Choices } from "./pricing";
export type OrderInput = Choices & {
  name: string;
  phone: string;
  email: string;
  major: string;
  description: string;
  pages: number;
  files_url: string;
  preferred_contact: string;
  consent: boolean;
};
export function validateOrder(
  o: OrderInput,
  lang: Lang,
): Record<string, string> {
  const e: Record<string, string> = {};
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  if (o.name.trim().length < 2 || o.name.length > 100)
    e.name = t(
      "أدخل اسمًا من حرفين إلى 100 حرف.",
      "Enter a name of 2–100 characters.",
    );
  if (
    !/^(?:\+9665\d{8}|9665\d{8}|05\d{8})$/.test(o.phone.replace(/[\s-]/g, ""))
  )
    e.phone = t(
      "أدخل رقم جوال سعودي صحيحًا، مثل 05XXXXXXXX.",
      "Enter a valid Saudi mobile number: 05XXXXXXXX.",
    );
  if (
    o.email.length > 254 ||
    (o.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email))
  )
    e.email = t(
      "أدخل بريدًا إلكترونيًا صحيحًا.",
      "Enter a valid email address.",
    );
  if (o.major.trim().length < 2 || o.major.length > 100)
    e.major = t(
      "أدخل تخصصك أو مسارك الدراسي.",
      "Enter your major or study track.",
    );
  if (o.description.trim().length < 20 || o.description.length > 4000)
    e.description = t(
      "صف طلبك في 20 إلى 4000 حرف.",
      "Describe your request in 20–4000 characters.",
    );
  if (!Number.isInteger(o.pages) || o.pages < 1 || o.pages > 10000)
    e.pages = t(
      "أدخل عددًا صحيحًا بين 1 و10000.",
      "Enter a whole number from 1 to 10000.",
    );
  if (!Number.isInteger(o.quantity) || o.quantity < 1 || o.quantity > 100000)
    e.quantity = t("أدخل حجم عمل صحيحًا.", "Enter a valid work quantity.");
  if (o.files_url) {
    try {
      if (
        new URL(o.files_url).protocol !== "https:" ||
        o.files_url.length > 2048 ||
        /\s/.test(o.files_url)
      )
        throw Error();
    } catch {
      e.files_url = t(
        "استخدم رابط ملفات آمنًا يبدأ بـ https://.",
        "Use a secure file link starting with https://.",
      );
    }
  }
  if (!o.consent)
    e.consent = t(
      "يجب الموافقة على سياسة الاستخدام والنزاهة الأكاديمية.",
      "Please accept the usage and academic integrity policies.",
    );
  for (const field of ["stage", "language", "deadline", "difficulty"] as const)
    if (!options[field].some((x) => x.id === o[field]))
      e[field] = t("اختر قيمة صحيحة.", "Select a valid option.");
  if (!services.some((s) => s.id === o.service))
    e.service = t("اختر خدمة صحيحة.", "Select a valid service.");
  if (
    !["whatsapp", "phone", "email"].includes(o.preferred_contact) ||
    (o.preferred_contact === "email" && !o.email)
  )
    e.preferred_contact = t(
      "أضف بريدًا صحيحًا أو اختر طريقة تواصل أخرى.",
      "Add a valid email or choose another contact method.",
    );
  return e;
}
export function orderMessage(o: OrderInput, lang: Lang) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const s = services.find((s) => s.id === o.service)!;
  const label = (key: "stage" | "language" | "deadline" | "difficulty") =>
    options[key].find((x) => x.id === o[key])?.[lang];
  return [
    t(
      "طلب دعم أكاديمي | نيكسورا أكاديمي",
      "Academic support request | Nexora Academic",
    ),
    `${t("الاسم", "Name")}: ${o.name}`,
    `${t("الجوال", "Mobile")}: ${o.phone}`,
    `${t("البريد", "Email")}: ${o.email || "—"}`,
    `${t("المرحلة", "Stage")}: ${label("stage")}`,
    `${t("التخصص", "Major")}: ${o.major}`,
    `${t("الخدمة", "Service")}: ${s[lang]}`,
    `${units[s.unit][lang]}: ${o.quantity}`,
    `${t("الصفحات أو الأسئلة", "Pages or questions")}: ${o.pages}`,
    `${t("اللغة", "Language")}: ${label("language")}`,
    `${t("التسليم", "Delivery")}: ${label("deadline")}`,
    `${t("الصعوبة", "Difficulty")}: ${label("difficulty")}`,
    `${t("إضافات", "Extras")}: ${o.extras.map((x) => (x === "feedback" ? t("تغذية راجعة موسعة", "Extended feedback") : t("مراجعة المراجع", "Reference review"))).join(", ") || "—"}`,
    `${t("وصف الطلب", "Description")}: ${o.description}`,
    `${t("رابط الملفات", "File link")}: ${o.files_url || "—"}`,
    `${t("التواصل المفضل", "Preferred contact")}: ${o.preferred_contact}`,
    t(
      "تمت الموافقة على سياسة الاستخدام والنزاهة الأكاديمية. السعر يثبت بعد المراجعة.",
      "Usage and integrity policies accepted. Price confirmed after review.",
    ),
  ].join("\n");
}
