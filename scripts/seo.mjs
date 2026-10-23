import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { site, services } from "../src/config/site.ts";
import { privateRoutes, publicRoutes, urlFor } from "../src/config/routes.ts";
import { DEFAULT_THEME } from "../src/config/theme.ts";
import { projects } from "../src/config/projects.ts";

const template = readFileSync("dist/index.html", "utf8");
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// A readable fallback for visitors and assistants without JavaScript.
// Interactive request/calculator behavior still requires the application.
function staticContent(route, lang) {
  const en = lang === "en";
  const links = publicRoutes
    .map(
      (page) =>
        `<li><a href="${urlFor(page.path, lang)}">${escape(page.title[lang])}</a></li>`,
    )
    .join("");
  const portfolio =
    route.path === "portfolio"
      ? projects
          .map((project) => {
            const i = en ? 1 : 0;
            return `<article id="${project.id}"><h2>${escape(project.title[i])}</h2><p>${escape(project.scope[i])}</p><p>${escape(project.status[i])}</p><p>${escape(project.outcome[i])}</p><p><a href="${project.repository}">GitHub: ${escape(project.title[i])}</a>${project.website ? ` — <a href="${project.website.url}">${escape(project.website.label[i])}</a>` : ""}</p></article>`;
          })
          .join("")
      : "";
  return `<noscript><main><h1>${escape(route.title[lang])}</h1><p>${escape(route.description[lang])}</p><p>${en ? "NEXORA builds websites, identities and digital systems. Project scopes and quotes are agreed before work begins. The portfolio documents public GitHub projects with their actual delivery status." : "نيكسورا تبني المواقع والهويات والأنظمة الرقمية. يُتفق على النطاق والسعر قبل البدء. تعرض صفحة الأعمال مشاريع GitHub عامة مع حالة تنفيذ كل مشروع."}</p>${portfolio}<p>${en ? "Enable JavaScript to use the calculator or request form. You can also contact us on WhatsApp." : "فعّل JavaScript لاستخدام الحاسبة ونموذج الطلب، أو تواصل عبر واتساب."}</p><p><a href="https://wa.me/${site.whatsapp}">${en ? "Contact on WhatsApp" : "التواصل عبر واتساب"}</a></p><nav aria-label="${en ? "Pages" : "الصفحات"}"><ul>${links}</ul></nav></main></noscript>`;
}

/** Directory a route's document is written to, for the given language. */
function outDir(path, lang) {
  const slug = path ? `${path}/` : "";
  const dir = (lang === "en" ? `dist/en/${slug}` : `dist/${slug}`).replace(
    /\/$/,
    "",
  );
  return dir || "dist";
}

function render(route, lang, { indexable }) {
  const title = route.title[lang];
  const description = route.description[lang];
  const url = urlFor(route.path, lang);
  let html = template
    .replace(
      /<html[^>]*>/,
      `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" data-theme="${DEFAULT_THEME}">`,
    )
    .replace(
      /<title>.*?<\/title>/s,
      `<title>${title} | ${site.name[lang]}</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${escape(title + " | " + site.name[lang])}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(
      /(<meta\s+property="og:locale"\s+content=")[^"]*(")/,
      `$1${lang === "ar" ? "ar_SA" : "en_US"}$2`,
    )
    .replace(
      /(<meta\s+property="og:locale:alternate"\s+content=")[^"]*(")/,
      `$1${lang === "ar" ? "en_US" : "ar_SA"}$2`,
    )
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  if (!indexable)
    html = html.replace(
      'content="index, follow"',
      'content="noindex, nofollow"',
    );
  html = html.replace(
    "<!--hreflang-->",
    indexable
      ? [
          `<link rel="alternate" hreflang="ar" href="${urlFor(route.path, "ar")}" />`,
          `<link rel="alternate" hreflang="en" href="${urlFor(route.path, "en")}" />`,
          `<link rel="alternate" hreflang="x-default" href="${urlFor(route.path, "ar")}" />`,
        ].join("\n    ")
      : "",
  );
  html = html.replace(
    "<!--schema-->",
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "ProfessionalService", "@id": site.url + "#organization", name: site.name.en, alternateName: site.name.ar, url: site.url, telephone: "+" + site.whatsapp, description: publicRoutes[0].description[lang], areaServed: { "@type": "Country", name: "Saudi Arabia" }, knowsLanguage: ["ar", "en"], logo: site.url + "nexora-logo.jpg" }, ...(route.path === "services" ? services.filter((service) => service.price).map((service) => ({ "@type": "Service", name: service[lang], provider: { "@id": site.url + "#organization" }, offers: { "@type": "Offer", priceCurrency: "SAR", priceSpecification: { "@type": "PriceSpecification", minPrice: service.price, priceCurrency: "SAR", description: lang === "en" ? "Starting price; final quote after review." : "سعر يبدأ من المبلغ المعروض، ويثبت بعد المراجعة." } } })) : [])] })}</script>`,
  );
  html = html.replace(
    /<noscript\b[^>]*>[\s\S]*?<\/noscript\s*>/,
    staticContent(route, lang),
  );
  return html;
}

let count = 0;
for (const route of publicRoutes) {
  for (const lang of ["ar", "en"]) {
    const dir = outDir(route.path, lang);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      `${dir}/index.html`,
      render(route, lang, { indexable: true }),
    );
    count++;
  }
}
for (const route of privateRoutes) {
  for (const lang of ["ar", "en"]) {
    const dir = outDir(route.path, lang);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      `${dir}/index.html`,
      render(route, lang, { indexable: false }),
    );
    count++;
  }
}
writeFileSync(
  "dist/404.html",
  template
    .replace('content="index, follow"', 'content="noindex, nofollow"')
    .replace("<!--hreflang-->", "")
    .replace(/<title>.*?<\/title>/s, "<title>صفحة غير موجودة | NEXORA</title>"),
);
writeFileSync("dist/.nojekyll", "");

const sitemapUrls = publicRoutes.flatMap((route) =>
  ["ar", "en"].map((lang) => {
    const alternates = ["ar", "en"]
      .map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(route.path, l)}"/>`,
      )
      .join("");
    const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(route.path, "ar")}"/>`;
    return `<url><loc>${urlFor(route.path, lang)}</loc>${alternates}${xDefault}</url>`;
  }),
);
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapUrls.join("")}</urlset>`,
);
writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /nexora-academic/admin/\nDisallow: /nexora-academic/success/\nDisallow: /nexora-academic/en/admin/\nDisallow: /nexora-academic/en/success/\nSitemap: ${site.url}sitemap.xml\n`,
);
console.log(
  `Generated ${count} route documents (${publicRoutes.length} public × 2 languages, ${privateRoutes.length} private × 2 languages), 404, sitemap (${sitemapUrls.length} URLs) and robots.txt.`,
);
