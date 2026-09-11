import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { site } from "../src/config/site.ts";
const pages = {
  "": [
    "دعم أكاديمي أوضح، أسرع، وأكثر احترافية",
    "شرح ومراجعة وتطوير للأعمال الأكاديمية للثانوية والجامعة والدراسات العليا.",
  ],
  services: [
    "الخدمات والأسعار",
    "خدمات الشرح والمراجعة والتدقيق والبرمجة وCAD بأسعار تبدأ من 40 ر.س.",
  ],
  "how-it-works": [
    "آلية الطلب",
    "خطوات إرسال الطلب ومراجعة الملف وتثبيت السعر والموعد قبل البدء.",
  ],
  calculator: [
    "حاسبة السعر",
    "احسب نطاق سعر طلبك حسب الخدمة وحجم العمل والموعد واللغة والصعوبة.",
  ],
  contact: [
    "تواصل معنا واطلب الخدمة",
    "أرسل تفاصيل طلبك بأمان أو جهز رسالة واتساب أو بريد إلكتروني.",
  ],
  faq: [
    "الأسئلة الشائعة",
    "إجابات واضحة عن الخدمات والأسعار والتعديلات والمواعيد والنزاهة الأكاديمية.",
  ],
  privacy: [
    "سياسة الخصوصية",
    "بيانات الطلبات وكيفية استخدامها وحفظها وحقوق أصحابها.",
  ],
  terms: [
    "الشروط والأحكام",
    "شروط الدعم الأكاديمي والأسعار والتعديلات والإلغاء ومسؤولية الطالب.",
  ],
  integrity: [
    "سياسة النزاهة الأكاديمية",
    "دعم تعليمي مسؤول يشمل الشرح والمراجعة والتغذية الراجعة وتحسين المهارات.",
  ],
  success: ["حالة الطلب", "حالة إرسال طلب الدعم الأكاديمي."],
  admin: ["لوحة الإدارة", "مساحة خاصة لإدارة الطلبات والدفعات."],
};
const template = readFileSync("dist/index.html", "utf8");
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
for (const [path, [title, description]] of Object.entries(pages)) {
  const url = site.url + (path ? `${path}/` : "");
  let html = template.replace(
    /<title>.*?<\/title>/s,
    `<title>${title} | ${site.name.ar}</title>`,
  );
  html = html
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${escape(title + " | " + site.name.en)}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  if (["admin", "success"].includes(path))
    html = html.replace(
      'content="index, follow"',
      'content="noindex, nofollow"',
    );
  html = html.replace(
    "<!--schema-->",
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "EducationalOrganization", name: site.name.en, alternateName: site.name.ar, url: site.url, description: [pages[""][1], "Educational support, explanation, review and mentoring for Saudi students."], areaServed: { "@type": "Country", name: "Saudi Arabia" }, knowsLanguage: ["ar", "en"], logo: site.url + "brand-mark.svg" })}</script>`,
  );
  mkdirSync(`dist/${path}`, { recursive: true });
  writeFileSync(`dist/${path ? path + "/" : ""}index.html`, html);
}
writeFileSync(
  "dist/404.html",
  template
    .replace('content="index, follow"', 'content="noindex, nofollow"')
    .replace(
      /<title>.*?<\/title>/s,
      "<title>صفحة غير موجودة | Nexora Academic</title>",
    ),
);
writeFileSync("dist/.nojekyll", "");
const paths = Object.keys(pages).filter(
  (p) => !["admin", "success"].includes(p),
);
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${site.url}${p ? p + "/" : ""}</loc></url>`).join("")}</urlset>`,
);
writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /nexora-academic/admin/\nDisallow: /nexora-academic/success/\nSitemap: ${site.url}sitemap.xml\n`,
);
console.log(
  `Generated ${Object.keys(pages).length} route documents, 404, sitemap and robots.txt.`,
);

