import { MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { agencyServices } from "./config/agency";
import { contactReady, site } from "./config/site";
import { Field } from "./forms";
import { useLanguage } from "./ui";

const budgets = [
  ["under5", "أقل من 5,000 ر.س", "Under SAR 5,000"],
  ["5to15", "5,000 – 15,000 ر.س", "SAR 5,000 – 15,000"],
  ["15to50", "15,000 – 50,000 ر.س", "SAR 15,000 – 50,000"],
  ["over50", "أكثر من 50,000 ر.س", "Over SAR 50,000"],
  ["unsure", "لست متأكدًا بعد", "Not sure yet"],
] as const;
const timelines = [
  ["asap", "في أقرب وقت", "As soon as possible"],
  ["month", "خلال شهر", "Within a month"],
  ["quarter", "خلال 1–3 أشهر", "Within 1–3 months"],
  ["flexible", "مرن", "Flexible"],
] as const;

// Agency project brief. It needs no backend: it composes a WhatsApp
// message for the business number in src/config/site.ts.
export function ProjectForm({ initial }: { initial?: string }) {
  const { t, lang } = useLanguage();
  const [v, setV] = useState({
    name: "",
    company: "",
    service: agencyServices.some((s) => s.id === initial)
      ? initial!
      : agencyServices[0].id,
    budget: "unsure",
    timeline: "flexible",
    details: "",
  });
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof v) => (value: string) =>
    setV((old) => ({ ...old, [k]: value }));
  const nameError = !v.name.trim();
  const detailsError = v.details.trim().length < 10;
  const label = (list: readonly (readonly string[])[], id: string) => {
    const row = list.find((r) => r[0] === id)!;
    return lang === "ar" ? row[1] : row[2];
  };
  function submit(e: FormEvent) {
    e.preventDefault();
    setTried(true);
    if (nameError || detailsError || !contactReady.whatsapp) return;
    const s = agencyServices.find((x) => x.id === v.service)!;
    const lines = [
      t("طلب مشروع — نيكسورا", "Project request — NEXORA"),
      `${t("الاسم", "Name")}: ${v.name.trim()}`,
      v.company.trim() && `${t("الجهة", "Company")}: ${v.company.trim()}`,
      `${t("الخدمة", "Service")}: ${s.name[lang === "ar" ? 0 : 1]}`,
      `${t("الميزانية", "Budget")}: ${label(budgets, v.budget)}`,
      `${t("الموعد", "Timeline")}: ${label(timelines, v.timeline)}`,
      `${t("التفاصيل", "Details")}: ${v.details.trim()}`,
    ].filter(Boolean);
    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <form
      className="panel project-form"
      id="start"
      onSubmit={submit}
      noValidate
    >
      <h2>{t("ابدأ مشروعك", "Start your project")}</h2>
      <p>
        {t(
          "أخبرنا عن فكرتك، وسنرسل لك تفاصيلها عبر واتساب لنتفق على النطاق والسعر.",
          "Tell us about your idea; we’ll open WhatsApp with your brief so we can agree on scope and price.",
        )}
      </p>
      <div className="form-grid">
        <Field
          name="pf-name"
          label={t("الاسم", "Name")}
          error={tried && nameError ? t("اكتب اسمك.", "Enter your name.") : ""}
        >
          <input
            id="pf-name"
            value={v.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={tried && nameError}
            aria-describedby={tried && nameError ? "pf-name-error" : undefined}
            autoComplete="name"
          />
        </Field>
        <Field
          name="pf-company"
          label={t("الجهة (اختياري)", "Company (optional)")}
        >
          <input
            id="pf-company"
            value={v.company}
            onChange={(e) => set("company")(e.target.value)}
            autoComplete="organization"
          />
        </Field>
        <Field name="pf-service" label={t("الخدمة", "Service")}>
          <select
            id="pf-service"
            value={v.service}
            onChange={(e) => set("service")(e.target.value)}
          >
            {agencyServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name[lang === "ar" ? 0 : 1]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          name="pf-budget"
          label={t("الميزانية التقريبية", "Approximate budget")}
        >
          <select
            id="pf-budget"
            value={v.budget}
            onChange={(e) => set("budget")(e.target.value)}
          >
            {budgets.map(([id, ar, en]) => (
              <option key={id} value={id}>
                {t(ar, en)}
              </option>
            ))}
          </select>
        </Field>
        <Field name="pf-timeline" label={t("الموعد المطلوب", "Timeline")}>
          <select
            id="pf-timeline"
            value={v.timeline}
            onChange={(e) => set("timeline")(e.target.value)}
          >
            {timelines.map(([id, ar, en]) => (
              <option key={id} value={id}>
                {t(ar, en)}
              </option>
            ))}
          </select>
        </Field>
        <div className="full">
          <Field
            name="pf-details"
            label={t("حدّثنا عن المشروع", "Tell us about the project")}
            error={
              tried && detailsError
                ? t(
                    "اكتب وصفًا مختصرًا (10 أحرف على الأقل).",
                    "Add a short description (at least 10 characters).",
                  )
                : ""
            }
          >
            <textarea
              id="pf-details"
              rows={5}
              value={v.details}
              onChange={(e) => set("details")(e.target.value)}
              aria-invalid={tried && detailsError}
              aria-describedby={
                tried && detailsError ? "pf-details-error" : undefined
              }
            />
          </Field>
        </div>
      </div>
      {contactReady.whatsapp ? (
        <button className="button" type="submit">
          <MessageCircle size={18} aria-hidden="true" />
          {t("أرسل عبر واتساب", "Send via WhatsApp")}
          <Send size={16} aria-hidden="true" />
        </button>
      ) : (
        <p className="field-hint">
          {t(
            "قنوات التواصل قيد التجهيز.",
            "Contact channels are being set up.",
          )}
        </p>
      )}
    </form>
  );
}
