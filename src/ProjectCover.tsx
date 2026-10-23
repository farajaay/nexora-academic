/** Proposed deliverable illustration; `kind` is a concept's primary service id.
 * Labels explicitly identify proposals. No client screens or data are invented.
 */
import { useLanguage } from "./ui";

export function ProjectCover({ kind }: { kind: string }) {
  const { t } = useLanguage();
  if (kind === "industrial" || kind === "digital") {
    return (
      <div
        className="project-cover proof-system"
        aria-label={t(
          "تصوّر لوحة مؤشرات بلا بيانات إنتاج حقيقية",
          "Proposed dashboard, without real production data",
        )}
      >
        <span className="proof-caption">
          {t("تصوّر لنظام متابعة", "System concept")}
        </span>
        <strong>
          {t(
            "الصورة الكاملة.\nفي مكان واحد.",
            "The whole picture.\nOne place.",
          )}
        </strong>
        <div className="proof-register">
          {[
            t("الإنتاج", "Production"),
            t("التوقفات", "Downtime"),
            t("التوافر", "Availability"),
          ].map((label) => (
            <span key={label}>
              {label}
              <b aria-label={t("لا توجد بيانات", "No data")}>—</b>
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "branding" || kind === "content") {
    return (
      <div
        className="project-cover proof-brand"
        aria-label={t(
          "دراسة طباعية لهوية مقترحة",
          "Type study for a proposed identity",
        )}
      >
        <span className="proof-caption">
          {t("دراسة هوية", "Identity study")}
        </span>
        <strong lang="ar" dir="rtl">
          حَبّ
        </strong>
        <div className="proof-baseline">
          <span>{t("قهوة متخصصة", "Specialty coffee")}</span>
          <span>{t("هوية ومتجر", "Identity and store")}</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="project-cover proof-product"
      aria-label={t("مخطط رحلة استخدام مقترحة", "Proposed user journey")}
    >
      <span className="proof-caption">
        {t("دراسة تجربة استخدام", "Experience study")}
      </span>
      <strong>
        {kind === "uiux"
          ? t("موعدك،\nبوضوح.", "Your visit,\nclearly planned.")
          : t("الخطوة التالية،\nأوضح.", "A clearer\nnext step.")}
      </strong>
      <div className="proof-baseline">
        <span>{t("اختر", "Choose")}</span>
        <span>{t("راجع", "Review")}</span>
        <span>{t("أكّد", "Confirm")}</span>
      </div>
    </div>
  );
}
