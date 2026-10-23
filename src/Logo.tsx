/** Shared brand link. `variant` selects the navigation or full vector lockup.
 * Theme visibility and dimensions belong to CSS; the link has one local name.
 */
import { site } from "./config/site";
import { LocalizedLink, useLanguage } from "./ui";

export function Logo({
  variant = "navigation",
}: {
  variant?: "navigation" | "full";
}) {
  const { lang } = useLanguage();
  const artwork =
    variant === "full" ? `nexora-full-${lang}` : "nexora-navigation";
  return (
    <LocalizedLink
      to="/"
      className={`brand brand-${variant}`}
      aria-label={site.name[lang]}
    >
      <span className="brand-artwork" aria-hidden="true">
        {(["light", "dark"] as const).map((theme) => (
          <img
            key={theme}
            className={`brand-logo brand-${theme}`}
            src={`${import.meta.env.BASE_URL}brand/${artwork}-${theme}.svg`}
            alt=""
            width="320"
            height={variant === "full" ? "216" : "64"}
            decoding="async"
          />
        ))}
      </span>
    </LocalizedLink>
  );
}
