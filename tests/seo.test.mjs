import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { publicRoutes, privateRoutes, urlFor } from "../src/config/routes.ts";
import { DEFAULT_THEME } from "../src/config/theme.ts";

function docPath(path, lang) {
  const slug = path ? `${path}/` : "";
  return lang === "en" ? `dist/en/${slug}index.html` : `dist/${slug}index.html`;
}

test("public routes get a bilingual pair of documents with reciprocal hreflang", () => {
  const descriptionsByLang = { ar: new Set(), en: new Set() };
  for (const route of publicRoutes) {
    for (const lang of ["ar", "en"]) {
      const file = docPath(route.path, lang);
      assert.ok(existsSync(file), `missing ${file}`);
      const html = readFileSync(file, "utf8");
      assert.ok(
        html.includes(
          `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" data-theme="${DEFAULT_THEME}">`,
        ),
        `${file} should declare lang/dir for ${lang}`,
      );
      assert.ok(
        html.includes(urlFor(route.path, lang)),
        `${file} missing self canonical`,
      );
      assert.ok(html.includes("application/ld+json"));
      assert.ok(
        html.includes('content="index, follow"'),
        `${file} should be indexable`,
      );
      assert.ok(html.includes("/nexora-academic/assets/"));
      const desc = html.match(
        /<meta\s+name="description"\s+content="([^"]+)"/,
      )[1];
      descriptionsByLang[lang].add(desc);
      // Reciprocal, self-referencing hreflang, plus x-default pointing at Arabic.
      for (const hreflang of ["ar", "en"]) {
        assert.ok(
          html.includes(
            `<link rel="alternate" hreflang="${hreflang}" href="${urlFor(route.path, hreflang)}" />`,
          ),
          `${file} missing hreflang="${hreflang}"`,
        );
      }
      assert.ok(
        html.includes(
          `<link rel="alternate" hreflang="x-default" href="${urlFor(route.path, "ar")}" />`,
        ),
        `${file} missing hreflang="x-default"`,
      );
    }
  }
  // Every public route has its own description, distinct within each language.
  assert.equal(descriptionsByLang.ar.size, publicRoutes.length);
  assert.equal(descriptionsByLang.en.size, publicRoutes.length);
});

test("private routes exist in both languages but stay noindex with no hreflang", () => {
  for (const route of privateRoutes) {
    for (const lang of ["ar", "en"]) {
      const file = docPath(route.path, lang);
      assert.ok(existsSync(file), `missing ${file}`);
      const html = readFileSync(file, "utf8");
      assert.ok(
        html.includes("noindex, nofollow"),
        `${file} should be noindex`,
      );
      assert.ok(
        !html.includes('rel="alternate"'),
        `${file} should carry no hreflang`,
      );
      assert.ok(
        html.includes(
          `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" data-theme="${DEFAULT_THEME}">`,
        ),
      );
    }
  }
});

test("404 is unprefixed, noindex, and carries no hreflang", () => {
  const html = readFileSync("dist/404.html", "utf8");
  assert.ok(html.includes("noindex, nofollow"));
  assert.ok(!html.includes('rel="alternate"'));
});

test("sitemap lists every public route in both languages, and nothing private", () => {
  const xml = readFileSync("dist/sitemap.xml", "utf8");
  assert.ok(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, publicRoutes.length * 2);
  for (const route of publicRoutes) {
    assert.ok(locs.includes(urlFor(route.path, "ar")));
    assert.ok(locs.includes(urlFor(route.path, "en")));
  }
  assert.ok(!xml.includes("/admin/"));
  assert.ok(!xml.includes("/success/"));
});

test("robots.txt blocks both languages of the private routes", () => {
  const robots = readFileSync("dist/robots.txt", "utf8");
  for (const route of privateRoutes) {
    assert.ok(robots.includes(`Disallow: /nexora-academic/${route.path}/`));
    assert.ok(robots.includes(`Disallow: /nexora-academic/en/${route.path}/`));
  }
});
