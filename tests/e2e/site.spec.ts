import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home, language, responsive layout and navigation", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("دعم أكاديمي");
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
  await expect(page.locator("h1")).toContainText("Clearer");
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
      .getByRole("link", { name: "Price calculator" })
      .click();
  } else
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Price calculator" })
      .click();
  await expect(page).toHaveURL(/calculator/);
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
test("form validates, preserves fields on language switch and safe contact placeholders", async ({
  page,
}) => {
  await page.goto("./contact/");
  await page.getByRole("button", { name: "نسخ الطلب" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#phone-error")).toBeVisible();
  await expect(page.locator("#description-error")).toBeVisible();
  await page.locator("#name").fill("اختبار نيكسورا");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("#name")).toHaveValue("اختبار نيكسورا");
  await expect(
    page.getByRole("button", { name: "WhatsApp", exact: true }),
  ).toBeDisabled();
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
  await page.goto("./contact/");
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
  await expect(page.locator("h1")).toContainText("Flexible support");
});
test("toggling language rewrites the current URL, and internal links stay localized", async ({
  page,
}) => {
  await page.goto("./services/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/services\/?$/);
  await expect(page.locator("h1")).toContainText("Flexible support");
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
