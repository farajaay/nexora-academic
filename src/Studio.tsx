import {
  Check,
  Code2,
  Factory,
  Mail,
  MessageCircle,
  Palette,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { contactReady, site } from "./config/site";
import { PageIntro, useLanguage } from "./ui";

type Bi = readonly [ar: string, en: string];
type StudioService = {
  id: string;
  icon: LucideIcon;
  name: Bi;
  tagline: Bi;
  intro: Bi;
  deliverables: readonly Bi[];
  process: readonly Bi[];
};

// Professional services offered alongside academic support. Each is scoped
// and quoted individually, so no fixed price is shown here.
const studio: readonly StudioService[] = [
  {
    id: "branding",
    icon: Palette,
    name: ["تصميم الهوية التجارية", "Branding design"],
    tagline: ["هوية تُروى قبل أن تُرى.", "An identity that tells your story."],
    intro: [
      "نبني هوية بصرية متكاملة تعكس رؤيتك وقيمك، من الفكرة الأولى حتى دليل الاستخدام.",
      "We craft a complete visual identity that reflects your vision and values, from first idea to usage guide.",
    ],
    deliverables: [
      ["الشعار ونسخه المختلفة", "Logo and its variations"],
      ["لوحة الألوان والخطوط", "Color palette and typography"],
      ["دليل الهوية البصرية", "Brand guidelines"],
      [
        "قوالب التواصل الاجتماعي والمطبوعات",
        "Social media and print templates",
      ],
    ],
    process: [
      ["جلسة اكتشاف", "Discovery session"],
      ["مفاهيم أولية", "Initial concepts"],
      ["تطوير وتعديل", "Refinement"],
      ["تسليم الملفات", "Final handover"],
    ],
  },
  {
    id: "product",
    icon: Smartphone,
    name: ["تطوير المنتجات", "Product development"],
    tagline: [
      "من الفكرة إلى منتج يُستخدم.",
      "From idea to a product people use.",
    ],
    intro: [
      "نحوّل فكرتك إلى منتج رقمي قابل للإطلاق: بحث المستخدم، النموذج الأولي، وخطة الإصدار.",
      "We turn your idea into a launch-ready digital product: user research, prototype and release plan.",
    ],
    deliverables: [
      ["تحليل السوق والمستخدم", "Market and user analysis"],
      ["خريطة المنتج والأولويات", "Product roadmap and priorities"],
      ["نماذج أولية تفاعلية (UI/UX)", "Interactive UI/UX prototypes"],
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
    id: "web-apps",
    icon: Code2,
    name: ["تطوير تطبيقات الويب", "Web app development"],
    tagline: ["سريعة، آمنة، ثنائية اللغة.", "Fast, secure and bilingual."],
    intro: [
      "نطوّر مواقع وتطبيقات ويب متجاوبة تدعم العربية والإنجليزية، مع لوحات إدارة وقواعد بيانات.",
      "We build responsive websites and web apps in Arabic and English, with admin panels and databases.",
    ],
    deliverables: [
      ["مواقع تعريفية ومتاجر", "Business sites and storefronts"],
      ["تطبيقات ويب ولوحات تحكم", "Web apps and dashboards"],
      ["ربط قواعد البيانات والدفع", "Database and payment integration"],
      ["استضافة وصيانة", "Hosting and maintenance"],
    ],
    process: [
      ["تحليل المتطلبات", "Requirements"],
      ["التصميم", "Design"],
      ["التطوير والاختبار", "Development and QA"],
      ["النشر والدعم", "Deployment and support"],
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

export function Studio() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (ar: string, en: string) => t(ar, en);
  function onKey(e: KeyboardEvent) {
    const n = studio.length;
    const rtl = document.documentElement.dir === "rtl";
    const step =
      e.key === "ArrowRight"
        ? rtl
          ? -1
          : 1
        : e.key === "ArrowLeft"
          ? rtl
            ? 1
            : -1
          : 0;
    let next: number;
    if (step) next = (active + step + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  const s = studio[active];
  const inquiry = t(
    `استفسار استوديو نيكسورا: ${s.name[0]}`,
    `Nexora Studio inquiry: ${s.name[1]}`,
  );
  const Icon = s.icon;
  return (
    <>
      <PageIntro
        eyebrow="NEXORA STUDIO"
        title={t("من الفكرة إلى أثر ملموس.", "From idea to measurable impact.")}
        subtitle={t(
          "هوية تجارية، ومنتجات رقمية، وتطبيقات ويب، واستشارات صناعية — بانضباط هندسي وحسٍّ فني.",
          "Brand identity, digital products, web apps and industrial consulting — with engineering discipline and an artist’s eye.",
        )}
      />
      <div
        className="studio-tabs"
        role="tablist"
        aria-label={t("خدمات الاستوديو", "Studio services")}
        onKeyDown={onKey}
      >
        {studio.map((x, i) => {
          const TabIcon = x.icon;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`studio-tab-${x.id}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`studio-panel-${x.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
            >
              <TabIcon size={18} aria-hidden="true" />
              {pick(...x.name)}
            </button>
          );
        })}
      </div>
      <section
        className="studio-panel"
        role="tabpanel"
        id={`studio-panel-${s.id}`}
        aria-labelledby={`studio-tab-${s.id}`}
        tabIndex={0}
      >
        <div className="studio-head">
          <span className="studio-icon">
            <Icon size={26} aria-hidden="true" />
          </span>
          <div>
            <h2>{pick(...s.name)}</h2>
            <p className="studio-tagline">{pick(...s.tagline)}</p>
          </div>
        </div>
        <p>{pick(...s.intro)}</p>
        <div className="studio-columns">
          <div>
            <h3>{t("ما نقدمه", "What you get")}</h3>
            <ul className="studio-list">
              {s.deliverables.map((d) => (
                <li key={d[1]}>
                  <Check size={16} aria-hidden="true" />
                  {pick(...d)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("كيف نعمل", "How we work")}</h3>
            <ol className="studio-steps">
              {s.process.map((p) => (
                <li key={p[1]}>{pick(...p)}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="studio-cta">
          <p>
            {t(
              "كل مشروع يُسعّر حسب نطاقه بعد جلسة تعريفية مجانية.",
              "Every project is quoted on its scope after a free discovery call.",
            )}
          </p>
          <div className="studio-contact">
            {contactReady.whatsapp && (
              <a
                className="button"
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(inquiry)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {t("اطلب عرض سعر عبر واتساب", "Request a quote on WhatsApp")}
              </a>
            )}
            {contactReady.email && (
              <a
                className="button secondary"
                href={`mailto:${site.email}?subject=${encodeURIComponent(inquiry)}`}
              >
                <Mail size={18} aria-hidden="true" />
                {t("راسلنا بالبريد", "Email us")}
              </a>
            )}
            {!contactReady.whatsapp && !contactReady.email && (
              <span className="field-hint">
                {t(
                  "قنوات التواصل قيد التجهيز وستظهر هنا قريبًا.",
                  "Contact channels are being set up and will appear here soon.",
                )}
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
