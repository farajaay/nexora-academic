import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
test.use({ trace: "off" }); // Login credentials must not be captured in traces.
test("live flow: student request → admin quote/status → confirmed payment", async ({
  page,
}, info) => {
  const url = process.env.NEXORA_SUPABASE_URL,
    secret = process.env.NEXORA_SERVICE_ROLE_KEY,
    path = process.env.NEXORA_CREDENTIALS_PATH;
  test.skip(
    !url || !secret || !path,
    "Requires explicit operator credentials and a connected live database.",
  );
  const creds = JSON.parse(readFileSync(path!, "utf8"));
  const operator = createClient(url!, secret!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const marker = `NEXORA UI TEST ${randomUUID().slice(0, 8)}`;

  try {
    await page.goto("./contact/?service=code&quantity=2");
    await page.locator("#name").fill(marker);
    await page.locator("#phone").fill("0500000000");
    await page.locator("#major").fill("اختبار برمجي");
    await page
      .locator("#description")
      .fill(
        "طلب اختبار آلي كامل للتحقق من حفظ الطلب ومتابعة الإدارة والدفعات، يحذف بعد الاختبار.",
      );
    await page.locator("#preferred_contact").selectOption("phone");
    await page.locator("#attachments").setInputFiles({
      name: "تعليمات.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Nexora attachment verification"),
    });
    // Simulate an interrupted first upload; retry must reuse the saved request.
    let interrupted = false;
    await page.route("**/storage/v1/object/request-files/**", async (route) => {
      if (route.request().method() === "POST" && !interrupted) {
        interrupted = true;
        await route.abort("failed");
      } else await route.continue();
    });
    await page.locator("#consent").check();
    await page.getByRole("button", { name: "إرسال وحفظ الطلب" }).click();
    await expect(page.getByRole("status")).toContainText(
      "رفع بعض المرفقات لم يكتمل",
      { timeout: 30000 },
    );
    await expect(page.locator("#attachments")).toBeDisabled();
    await page
      .getByRole("button", { name: "إعادة محاولة رفع الملفات" })
      .click();
    await expect(page.locator("h1")).toContainText("تم حفظ طلبك بنجاح");
    const id = (await page.locator(".reference").textContent())!.trim();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    await page.goto("./admin/");
    await page.locator("#admin-email").fill(creds.email);
    await page.locator("#admin-password").fill(creds.password);
    await page
      .getByRole("button", { name: "تسجيل الدخول", exact: true })
      .click();
    const row = page.locator(".order-row").filter({ hasText: marker });
    await expect(row).toBeVisible();
    await row.click();
    await expect(page.locator(".attachment-list")).toContainText("تعليمات.txt");
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "تنزيل", exact: true }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe("تعليمات.txt");
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    expect(Buffer.concat(chunks).toString()).toBe(
      "Nexora attachment verification",
    );
    const recordsWithFiles = await operator
      .from("orders")
      .select("attachments")
      .eq("id", id)
      .single();
    const attachment = recordsWithFiles.data!.attachments[0];
    const env = readFileSync(".env.local", "utf8");
    const publicKey =
      process.env.NEXORA_PUBLISHABLE_KEY ||
      env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.+)/)![1].trim();
    const guest = createClient(url!, publicKey, {
      auth: { persistSession: false },
    });
    expect(
      (await guest.storage.from("request-files").download(attachment.path))
        .error,
    ).not.toBeNull();
    expect(
      (
        await guest.storage
          .from("request-files")
          .createSignedUrl(attachment.path, 60)
      ).error,
    ).not.toBeNull();
    expect(
      (
        await guest.storage
          .from("request-files")
          .upload(`${id}/${randomUUID()}.txt`, Buffer.from("unregistered"), {
            contentType: "text/plain",
          })
      ).error,
    ).not.toBeNull();
    expect(
      (
        await guest.storage
          .from("request-files")
          .upload(attachment.path, Buffer.from("overwrite"), {
            contentType: "text/plain",
            upsert: true,
          })
      ).error,
    ).not.toBeNull();
    const listed = await guest.storage.from("request-files").list(id);
    expect(listed.data?.length || 0).toBe(0);
    const publicResponse = await page.request.get(
      `${url}/storage/v1/object/public/request-files/${attachment.path}`,
    );
    expect(publicResponse.ok()).toBeFalsy();
    expect(
      (await operator.from("orders").select("id").eq("name", marker)).data,
    ).toHaveLength(1);
    await page.locator("#status").selectOption("in_progress");
    await page.locator("#quote").fill("260");
    await page.getByRole("button", { name: "حفظ التغييرات" }).click();
    await expect(page.getByRole("status")).toContainText("تم تحديث الطلب");
    await page.locator("#amount").fill("100");
    await page.locator("#reference").fill(`UI-TEST-${id}`);
    await page.getByRole("button", { name: "تسجيل دفعة مؤكدة" }).click();
    await expect(page.getByRole("status")).toContainText(
      "تم تسجيل الدفعة المؤكدة",
    );
    await expect(page.locator(".payment-row")).toContainText("100");
    await expect(page.locator(".order-detail")).toContainText("160.00");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `artifacts/${info.project.name}-admin-verified.png`,
      fullPage: true,
    });
    const stored = await operator
      .from("orders")
      .select("status,quoted_total")
      .eq("id", id)
      .single();
    expect(stored.data).toEqual({ status: "in_progress", quoted_total: 260 });
    const ledger = await operator
      .from("payments")
      .select("amount")
      .eq("order_id", id);
    expect(ledger.data).toEqual([{ amount: 100 }]);

    await page.getByRole("button", { name: "خروج", exact: true }).click();
    await expect(page.locator("#admin-password")).toBeVisible();
    await expect(page.locator(".order-list")).toHaveCount(0);
  } finally {
    // Match only this run's synthetic row, even if UI submission failed after saving.
    const records = await operator
      .from("orders")
      .select("id,attachments")
      .eq("name", marker);
    for (const record of records.data || []) {
      const paths = (record.attachments || []).map(
        (f: { path: string }) => f.path,
      );
      if (paths.length)
        expect(
          (await operator.storage.from("request-files").remove(paths)).error,
        ).toBeNull();
      expect(
        (await operator.from("payments").delete().eq("order_id", record.id))
          .error,
      ).toBeNull();
      expect(
        (await operator.from("orders").delete().eq("id", record.id)).error,
      ).toBeNull();
    }
  }
});

test("admin publishes site default while visitors keep personal choices", async ({
  page,
  context,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Shared global setting tested once to prevent parallel writes.",
  );
  const url = process.env.NEXORA_SUPABASE_URL,
    secret = process.env.NEXORA_SERVICE_ROLE_KEY,
    path = process.env.NEXORA_CREDENTIALS_PATH;
  test.skip(!url || !secret || !path, "Needs operator credentials");
  const creds = JSON.parse(readFileSync(path!, "utf8"));
  const operator = createClient(url!, secret!, {
    auth: { persistSession: false },
  });
  const before = await operator
    .from("site_settings")
    .select("theme")
    .eq("id", 1)
    .single();
  expect(before.error).toBeNull();
  const original = before.data!.theme;
  const next = original === "violet" ? "emerald" : "violet";
  try {
    await page.goto("./en/admin/");
    await page.locator("#admin-email").fill(creds.email);
    await page.locator("#admin-password").fill(creds.password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    const panel = page
      .locator(".account-settings")
      .filter({ has: page.locator(".theme-grid") });
    await panel.locator("summary").click();
    await expect(panel.locator(".theme-option")).toHaveCount(6);
    await panel
      .getByRole("button", {
        name: next === "violet" ? /Royal Violet/ : /Emerald Scholar/,
      })
      .click();
    await expect(panel.getByRole("status")).toContainText(
      "Site default updated",
    );
    const visitor = await context.newPage();
    await visitor.goto("./en/");
    await expect(visitor.locator("html")).toHaveAttribute("data-theme", next);
    await visitor.getByLabel("Choose theme", { exact: true }).click();
    await visitor
      .getByRole("button", { name: "Canyon Clay", exact: true })
      .click();
    await visitor.reload();
    await expect(visitor.locator("html")).toHaveAttribute("data-theme", "clay");
    await page.reload(); // auth intentionally expires on reload
    await expect(page.locator("#admin-password")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "clay");
    expect(
      (
        await operator
          .from("site_settings")
          .select("theme")
          .eq("id", 1)
          .single()
      ).data!.theme,
    ).toBe(next);
    await visitor.close();
  } finally {
    expect(
      (
        await operator
          .from("site_settings")
          .update({ theme: original })
          .eq("id", 1)
      ).error,
    ).toBeNull();
  }
});
