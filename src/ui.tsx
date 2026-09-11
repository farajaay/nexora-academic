import { createContext, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpLeft,
  Code2,
  DraftingCompass,
  FileText,
  Languages,
  Presentation,
  Sigma,
  Sparkles,
} from "lucide-react";
import { services, site, type Lang } from "./config/site";
export const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
}>({ lang: "ar", toggle: () => {} });
export function useLanguage() {
  const { lang, toggle } = useContext(LanguageContext);
  return {
    lang,
    toggle,
    t: (ar: string, en: string) => (lang === "ar" ? ar : en),
  };
}
export function Logo() {
  const { lang } = useLanguage();
  return (
    <Link to="/" className="brand" aria-label={site.name[lang]}>
      <img
        src={`${import.meta.env.BASE_URL}brand-mark.svg`}
        width="42"
        height="46"
        alt=""
      />
      <span dir="ltr">
        <strong>
          Nexora<span> Academic</span>
        </strong>
        <small>
          {lang === "ar" ? "تعلّم. تواصل. تقدّم." : "Learn. Connect. Progress."}
        </small>
      </span>
    </Link>
  );
}
export function Icon({ name, size = 23 }: { name: string; size?: number }) {
  const C =
    {
      spark: Sparkles,
      math: Sigma,
      file: FileText,
      slides: Presentation,
      code: Code2,
      cad: DraftingCompass,
      language: Languages,
    }[name] || Sparkles;
  return <C size={size} strokeWidth={1.7} />;
}
export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function PageIntro({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow || "NEXORA ACADEMIC"}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
export function ServiceCard({
  service,
  index = 0,
}: {
  service: (typeof services)[number];
  index?: number;
}) {
  const { lang, t } = useLanguage();
  return (
    <Link className="service-card" to={`/contact?service=${service.id}`}>
      <div className="card-top">
        <span className={`icon-box tone-${index % 3}`}>
          <Icon name={service.icon} />
        </span>
        <ArrowUpLeft className="card-arrow" size={19} />
      </div>
      <h3>{service[lang]}</h3>
      <p>
        {service.price ? (
          <>
            {t("يبدأ من", "From")} <strong>{service.price}</strong>{" "}
            {site.currency[lang]}
            {service.unit === "hour"
              ? t(" / ساعة", " / hour")
              : service.unit === "words"
                ? t(" / 250 كلمة", " / 250 words")
                : ""}
          </>
        ) : (
          t("حسب النطاق", "Quoted by scope")
        )}
      </p>
    </Link>
  );
}
