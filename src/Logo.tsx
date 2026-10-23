/** Shared brand link. No props; renders the owner's supplied artwork unchanged
 * with a localized accessible name. Dimensions belong to the design tokens.
 */
import { site } from "./config/site";
import { LocalizedLink, useLanguage } from "./ui";

export function Logo() {
  const { lang } = useLanguage();
  return (
    <LocalizedLink to="/" className="brand" aria-label={site.name[lang]}>
      <img
        className="brand-logo"
        src={`${import.meta.env.BASE_URL}nexora-logo.jpg`}
        alt={site.name[lang]}
        decoding="async"
      />
    </LocalizedLink>
  );
}
