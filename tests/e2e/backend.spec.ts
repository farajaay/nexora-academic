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
    await page.locator("#consent").check();
    await page.getByRole("button", { name: "إرسال وحفظ الطلب" }).click();
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
      .select("id")
      .eq("name", marker);
    for (const record of records.data || []) {
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
