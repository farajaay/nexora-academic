import { test, expect } from "@playwright/test";

for (const width of [360, 768, 1280]) {
  test(`bilingual pages fit ${width}px in both modes`, async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "This test supplies its own viewport matrix.",
    );
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    for (const lang of ["ar", "en"]) {
      for (const mode of ["light", "dark"]) {
        await page.evaluate(
          (theme) => localStorage.setItem("nexora-theme-preference", theme),
          mode,
        );
        for (const route of [
          "",
          "studio/",
          "portfolio/",
          "about/",
          "services/",
          "calculator/",
          "contact/?type=academic",
          "faq/",
          "privacy/",
          "admin/",
        ]) {
          await page.goto(`./${lang === "en" ? "en/" : ""}${route}`);
          await expect(page.locator("h1")).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            mode,
          );
          await expect(page.locator("html")).toHaveAttribute(
            "dir",
            lang === "ar" ? "rtl" : "ltr",
          );
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            `${lang}/${route}, ${mode}, ${width}px`,
          ).toBeTruthy();
        }
      }
    }
  });
}

test("service tabs can be operated in both reading directions", async ({
  page,
}) => {
  for (const lang of ["ar", "en"]) {
    await page.goto(`./${lang === "en" ? "en/" : ""}studio/#uiux`);
    const tabs = page.getByRole("tab");
    await tabs.nth(2).focus();
    await page.keyboard.press(lang === "ar" ? "ArrowLeft" : "ArrowRight");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  }
});

test("an unconfirmed request has no completion celebration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./en/success/");
  await expect(page.locator("h1")).toContainText("Start with your request");
  await expect(page.locator(".success-icon")).toHaveAttribute(
    "data-saved",
    "false",
  );
  expect(
    await page
      .locator(".success-icon")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.evaluate(() =>
    history.replaceState(
      { ...history.state, usr: { channel: "save", id: "LOCAL-QA-REFERENCE" } },
      "",
    ),
  );
  await page.reload();
  await expect(page.locator("h1")).toContainText("Your request has been saved");
  await expect(page.locator(".success-icon")).toHaveAttribute(
    "data-saved",
    "true",
  );
  await expect(page.locator(".reference")).toContainText("LOCAL-QA-REFERENCE");
  expect(
    await page
      .locator(".success-icon")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
