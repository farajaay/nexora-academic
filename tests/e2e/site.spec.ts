import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home, language, responsive layout and navigation", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("رؤيتك");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `artifacts/${info.project.name}-ar-home.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("h1")).toContainText("Your Vision");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `artifacts/${info.project.name}-en-home.png`,
    fullPage: true,
  });
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .locator("#mobile-nav")
      .getByRole("link", { name: "Portfolio" })
      .click();
  } else
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Portfolio" })
      .click();
  await expect(page).toHaveURL(/portfolio/);
  expect(errors).toEqual([]);
});
test("calculator computes prices and prefills every selection", async ({
  page,
}, info) => {
  await page.goto("./calculator/");
  await page.locator("#service").selectOption("code");
  await page.locator("#quantity").fill("2");
  await page.locator("#deadline").selectOption("day");
  await page.locator("#language").selectOption("specialized");
  await page.locator("#stage").selectOption("postgraduate");
  await page.locator("#difficulty").selectOption("medium");
  await page.getByText("تغذية راجعة موسعة", { exact: true }).click();
  await expect(page.locator(".price-value")).toContainText("445");
  await expect(page.locator(".price-value")).toContainText("485");
  await page.screenshot({
    path: `artifacts/${info.project.name}-calculator.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "إرسال تفاصيل الطلب" }).click();
  await expect(page.locator("#service")).toHaveValue("code");
  await expect(page.locator("#quantity")).toHaveValue("2");
  await expect(page.locator("#deadline")).toHaveValue("day");
  await expect(page.locator("#stage")).toHaveValue("postgraduate");
  await expect(page.locator("#difficulty")).toHaveValue("medium");
  await expect(page.locator("#language")).toHaveValue("specialized");
  await expect(page.getByRole("checkbox").first()).toBeChecked();
});
test("form validates, preserves fields on language switch and gates unconfigured contact channels", async ({
  page,
}) => {
  await page.goto("./contact/?type=academic");
  await page.getByRole("button", { name: "نسخ الطلب" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#phone-error")).toBeVisible();
  await expect(page.locator("#description-error")).toBeVisible();
  await page.locator("#name").fill("اختبار نيكسورا");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("#name")).toHaveValue("اختبار نيكسورا");
  // WhatsApp is configured (src/config/site.ts); email is still a placeholder.
  await expect(
    page.getByRole("button", { name: "WhatsApp", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Email", exact: true }),
  ).toBeDisabled();
  // Language now lives in the URL, not in memory: navigating to the
  // unprefixed URL is Arabic regardless of the toggle clicked moments ago.
  await page.goto("./success/");
  await expect(page.locator("h1")).toContainText("ابدأ بإرسال طلبك");
  await page.goto("./en/success/");
  await expect(page.locator("h1")).toContainText("Start with your request");
});
test("all pages and FAQ work, admin is protected", async ({ page }) => {
  for (const route of [
    "services",
    "how-it-works",
    "faq",
    "privacy",
    "terms",
    "integrity",
    "admin",
  ]) {
    await page.goto(`./${route}/`);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.title()).toContain("نيكسورا");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await expect(page.locator("#admin-password")).toBeVisible();
  await expect(page.locator(".order-list")).toHaveCount(0);
  await page.goto("./faq/");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.goto("./unknown-page");
  await expect(page.locator("h1")).toContainText("غير موجودة");
});
test("accessibility: every route", async ({ page }) => {
  const routes = [
    "",
    "services/",
    "how-it-works/",
    "calculator/",
    "contact/",
    "studio/",
    "portfolio/",
    "about/",
    "faq/",
    "privacy/",
    "terms/",
    "integrity/",
    "success/",
    "admin/",
    "unknown-page",
    "en/",
    "en/services/",
    "en/contact/",
  ];
  for (const route of routes) {
    await page.goto(`./${route}`);
    await page.locator("h1").waitFor();
    const result = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      `route: ${route || "(home)"}`,
    ).toEqual([]);
  }
});

test("attachment picker validates, removes files and fits the screen", async ({
  page,
}, info) => {
  await page.goto("./contact/?type=academic");
  const input = page.locator("#attachments");
  await input.setInputFiles({
    name: "bad.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("bad"),
  });
  await expect(page.locator("#attachments-error")).toBeVisible();
  await expect(page.locator(".attachment-list li")).toHaveCount(0);
  await input.setInputFiles({
    name: "تعليمات.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 synthetic"),
  });
  await expect(page.locator(".attachment-list li")).toHaveCount(1);
  await expect(page.locator("#attachments-error")).toHaveCount(0);
  await input.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `artifacts/${info.project.name}-file-picker.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "إزالة تعليمات.pdf" }).click();
  await expect(page.locator(".attachment-list li")).toHaveCount(0);
});
test("direct load of an /en/ URL renders English with no flash", async ({
  page,
}) => {
  await page.goto("./en/services/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("h1")).toContainText(
    "Academic support, clearly priced",
  );
});
test("toggling language rewrites the current URL, and internal links stay localized", async ({
  page,
}) => {
  await page.goto("./services/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/services\/?$/);
  await expect(page.locator("h1")).toContainText(
    "Academic support, clearly priced",
  );
  await page
    .locator(".footer-grid")
    .getByRole("link", { name: "Price calculator" })
    .click();
  await expect(page).toHaveURL(/\/en\/calculator\/?$/);
  // Toggling back to Arabic from a deep English page returns the matching
  // Arabic URL for that same page, not the Arabic home page.
  await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
  await expect(page).toHaveURL(/\/calculator\/?$/);
  await expect(page).not.toHaveURL(/\/en\//);
});
test("site theme defaults to dark without a database", async ({ page }) => {
  await page.route("**/rest/v1/site_settings*", (route) => route.abort());
  // The admin default picker requires a real admin session and is covered
  // by tests/e2e/backend.spec.ts, which skips without live credentials.
  for (const route of ["", "en/", "contact/", "admin/"]) {
    await page.goto(`./${route}`, { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  }
});

test("dark mode persists across routes, languages and reloads", async ({
  page,
}) => {
  await page.route("**/rest/v1/site_settings*", (route) =>
    route.fulfill({ json: { theme: "light" } }),
  );
  await page.goto("./en/contact/?type=academic");
  await page.waitForLoadState("networkidle");
  const html = page.locator("html");
  await page.locator("#name").fill("Mode preservation");
  const toggle = page.getByRole("button", { name: "Dark mode", exact: true });
  // Turn dark mode on from whichever mode the site default produced.
  if ((await html.getAttribute("data-theme")) === "dark") await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#name")).toHaveValue("Mode preservation");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "الوضع الداكن", exact: true }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("light and dark modes meet contrast requirements", async ({ page }) => {
  await page.goto("./en/");
  const toggle = page.getByRole("button", { name: "Dark mode", exact: true });
  for (const mode of ["light", "dark"]) {
    if ((await page.locator("html").getAttribute("data-theme")) !== mode)
      await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      mode,
    ).toEqual([]);
  }
});

test("project brief opens WhatsApp with the chosen service", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as unknown as { opened: string[] }).opened = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { opened: string[] }).opened.push(String(url));
      return null;
    };
  });
  await page.goto("./en/studio/#uiux");
  await expect(
    page.getByRole("tab", { name: "UI/UX design", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const form = page.locator("#start");
  await form.getByRole("button", { name: "Send via WhatsApp" }).click();
  await expect(page.locator("#pf-name-error")).toBeVisible();
  await page.locator("#pf-name").fill("Test Client");
  await page.locator("#pf-details").fill("A redesign for our clinic website.");
  await expect(page.locator("#pf-service")).toHaveValue("uiux");
  await form.getByRole("button", { name: "Send via WhatsApp" }).click();
  const opened = await page.evaluate(
    () => (window as unknown as { opened: string[] }).opened,
  );
  expect(opened).toHaveLength(1);
  expect(opened[0]).toContain("https://wa.me/966554517103?text=");
  expect(decodeURIComponent(opened[0])).toContain("UI/UX design");
});
