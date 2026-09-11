import type { Lang } from "../config/site";

const EN_PREFIX = "/en";

export function isEnglishPath(pathname: string): boolean {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`);
}

/**
 * Rewrite an app-internal path for the given language by adding or removing
 * the `/en` prefix. External links, hashes and anything already carrying a
 * scheme are returned unchanged.
 */
export function localize(to: string, lang: Lang): string {
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(to) || to.startsWith("#")) return to;
  const bare = isEnglishPath(to)
    ? to.slice(EN_PREFIX.length) || "/"
    : to || "/";
  if (lang !== "en") return bare;
  return bare === "/" ? EN_PREFIX : EN_PREFIX + bare;
}
