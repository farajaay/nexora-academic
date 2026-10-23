import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("real projects have source links, honest status and useful filters", async ({
  page,
}) => {
  await page.goto("./en/portfolio/");
  const records = page.locator(".project-record");
  await expect(records).toHaveCount(6);
  await expect(page.locator("#atema-studio")).toContainText("Published beta");
  await expect(page.locator("#mro-optix")).toContainText(
    "Candidate release; sales closed",
  );
  await expect(page.locator("#employee-os")).toContainText(
    "not published app-store releases",
  );
  await expect(page.locator("#majlis a[href*='majlis-webapp']")).toHaveCount(0);
  const repoLinks = records.getByRole("link", { name: /^Project on GitHub:/ });
  await expect(repoLinks).toHaveCount(6);
  expect(
    await repoLinks.evaluateAll((links) =>
      links.map((a) => a.getAttribute("href")),
    ),
  ).toEqual([
    "https://github.com/farajaay/atema-studio",
    "https://github.com/farajaay/mro-optix",
    "https://github.com/farajaay/employee-os",
    "https://github.com/farajaay/Majlis",
    "https://github.com/farajaay/saudi-industry-forum-event-planner",
    "https://github.com/farajaay/HADEED-TA-Command-center",
  ]);
  const industrial = page.getByRole("button", {
    name: "Industrial consultation",
    exact: true,
  });
  await industrial.focus();
  await page.keyboard.press("Enter");
  await expect(industrial).toHaveAttribute("aria-pressed", "true");
  await expect(records).toHaveCount(2);
  await expect(page.locator("#mro-optix")).toBeVisible();
  await expect(page.locator("#hadeed-dashboard")).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Showing 2 of 6 projects",
  );
  await page
    .locator("#mro-optix")
    .getByRole("link", { name: "Next project: HADEED performance dashboard" })
    .click();
  await expect(page).toHaveURL(/#hadeed-dashboard$/);
  await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(records).toHaveCount(2);
  await page.getByRole("button", { name: "الكل", exact: true }).click();
  await expect(records).toHaveCount(6);
});

test("project records remain accessible in both languages and modes", async ({
  page,
}) => {
  await page.goto("./");
  for (const lang of ["ar", "en"]) {
    for (const mode of ["light", "dark"]) {
      await page.evaluate(
        (theme) => localStorage.setItem("nexora-theme-preference", theme),
        mode,
      );
      await page.goto(`./${lang === "en" ? "en/" : ""}portfolio/`);
      await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((violation) => ({
          id: violation.id,
          targets: violation.nodes.map((node) => node.target),
        })),
        `${lang}/${mode}`,
      ).toEqual([]);
    }
  }
});

test("homepage project links reach visible facts and capture errors have a fallback", async ({
  page,
}) => {
  await page.goto("./en/");
  await page
    .locator("#mro-optix")
    .getByRole("link", { name: "Project details", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/portfolio#mro-optix$/);
  const project = page.locator("#mro-optix");
  await expect(
    project.getByRole("heading", { name: "MRO Optix", exact: true }),
  ).toBeInViewport();
  await expect(project.locator(".project-facts")).toContainText(
    "Maintenance material-review product",
  );
  await expect(project.locator("img")).toBeVisible();
  expect(
    await project
      .locator("img")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBeTruthy();
  await page.route("**/projects/*.jpg", (route) => route.abort());
  await page.reload();
  await expect(project.locator(".project-cover")).toContainText(
    "Project overview",
  );
  await expect(
    project.getByRole("link", {
      name: "Project on GitHub: MRO Optix",
      exact: true,
    }),
  ).toBeVisible();
});
