import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { isThemeId } from "../src/config/theme.ts";
const {
  NEXORA_SUPABASE_URL: url,
  NEXORA_PUBLISHABLE_KEY: key,
  NEXORA_SERVICE_ROLE_KEY: secret,
  NEXORA_CREDENTIALS_PATH: path,
} = process.env;
test(
  "Live Supabase: request persistence, authorization and payment ledger",
  { skip: !url || !key || !secret || !path },
  async (t) => {
    const options = {
      auth: { persistSession: false, autoRefreshToken: false },
    };
    const owner = createClient(url, secret, options);
    const anon = createClient(url, key, options);
    const admin = createClient(url, key, options);
    const other = createClient(url, key, options);
    const creds = JSON.parse(readFileSync(path, "utf8"));
    const id = randomUUID();
    let otherId;
    const request = {
      id,
      name: "NEXORA AUTOMATED TEST",
      phone: "0500000000",
      email: "",
      stage: "university",
      major: "اختبار تقني",
      service: "code",
      description:
        "طلب اختبار آلي للتحقق من الحفظ والصلاحيات، يحذف بعد الاختبار.",
      quantity: 2,
      pages: 1,
      language: "ar",
      deadline: "standard",
      difficulty: "normal",
      extras: [],
      files_url: "",
      preferred_contact: "phone",
      consent: true,
    };
    try {
      await t.test(
        "anonymous request is persisted with server defaults",
        async () => {
          const r = await anon.from("orders").insert(request);
          assert.equal(r.error, null);
          const saved = await owner
            .from("orders")
            .select("id,status,quoted_total")
            .eq("id", id)
            .single();
          assert.equal(saved.error, null);
          assert.equal(saved.data.status, "new");
          assert.equal(saved.data.quoted_total, null);
        },
      );
      await t.test(
        "anonymous cannot read requests, payments or admin membership",
        async () => {
          for (const table of ["orders", "payments", "admins"]) {
            const r = await anon.from(table).select("*");
            assert.ok(r.error, `Anonymous read must fail for ${table}`);
          }
        },
      );
      await t.test(
        "anonymous cannot inject a price, status, timestamp or admin role",
        async () => {
          for (const data of [
            { status: "completed" },
            { quoted_total: 1 },
            { created_at: "2020-01-01" },
          ]) {
            const r = await anon
              .from("orders")
              .insert({ ...request, id: randomUUID(), ...data });
            assert.ok(r.error);
          }
          assert.ok(
            (await anon.from("admins").insert({ user_id: randomUUID() })).error,
          );
          assert.ok(
            (
              await anon
                .from("orders")
                .update({ status: "completed" })
                .eq("id", id)
            ).error,
          );
          assert.ok((await anon.from("orders").delete().eq("id", id)).error);
        },
      );
      await t.test(
        "database rejects invalid data and missing consent",
        async () => {
          for (const data of [
            { consent: false },
            { phone: "123" },
            { files_url: "javascript:alert(1)" },
            { description: "short" },
            { quantity: 0 },
            { service: "invalid" },
          ]) {
            const r = await anon
              .from("orders")
              .insert({ ...request, id: randomUUID(), ...data });
            assert.ok(r.error);
          }
        },
      );
      await t.test(
        "authenticated non-admin cannot read or modify protected records even with forged user metadata",
        async () => {
          const email = `nexora-test-${id}@example.com`;
          const password = randomBytes(24).toString("hex");
          const created = await owner.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: "admin", is_admin: true },
          });
          assert.equal(created.error, null);
          otherId = created.data.user.id;
          assert.equal(
            (await other.auth.signInWithPassword({ email, password })).error,
            null,
          );
          for (const table of ["orders", "payments", "admins"]) {
            const r = await other.from(table).select("*");
            assert.equal(r.error, null);
            assert.equal(r.data.length, 0);
          }
          const changed = await other
            .from("orders")
            .update({ status: "completed" })
            .eq("id", id)
            .select();
          assert.equal(changed.data?.length, 0);
          assert.ok(
            (
              await other
                .from("payments")
                .insert({ order_id: id, amount: 1, reference: `DENIED-${id}` })
            ).error,
          );
          assert.ok(
            (await other.from("admins").insert({ user_id: otherId })).error,
          );
        },
      );
      await t.test(
        "provisioned admin can sign in, read and update order status and quote",
        async () => {
          assert.equal(
            (
              await admin.auth.signInWithPassword({
                email: creds.email,
                password: creds.password,
              })
            ).error,
            null,
          );
          const read = await admin
            .from("orders")
            .select("id")
            .eq("id", id)
            .single();
          assert.equal(read.error, null);
          const r = await admin
            .from("orders")
            .update({ status: "agreed", quoted_total: 240 })
            .eq("id", id)
            .select("status,quoted_total")
            .single();
          assert.equal(r.error, null);
          assert.equal(r.data.quoted_total, 240);
        },
      );
      await t.test(
        "admin can append confirmed payment but cannot duplicate, overwrite or delete it",
        async () => {
          const payment = {
            order_id: id,
            amount: 100,
            reference: `TEST-${id}`,
          };
          assert.equal(
            (await admin.from("payments").insert(payment)).error,
            null,
          );
          assert.ok((await admin.from("payments").insert(payment)).error);
          assert.ok(
            (
              await admin
                .from("payments")
                .update({ amount: 200 })
                .eq("order_id", id)
            ).error,
          );
          assert.ok(
            (await admin.from("payments").delete().eq("order_id", id)).error,
          );
          const r = await admin
            .from("payments")
            .select("amount,recorded_by")
            .eq("order_id", id);
          assert.equal(r.error, null);
          assert.equal(r.data.length, 1);
          assert.equal(r.data[0].amount, 100);
          assert.equal(r.data[0].recorded_by, creds.userId);
        },
      );
    } finally {
      await admin.auth.signOut();
      await other.auth.signOut();
      const p = await owner.from("payments").delete().eq("order_id", id);
      assert.equal(p.error, null);
      const o = await owner.from("orders").delete().eq("id", id);
      assert.equal(o.error, null);
      if (otherId)
        assert.equal((await owner.auth.admin.deleteUser(otherId)).error, null);
    }
  },
);
test(
  "Live Supabase: site theme is publicly readable and admin-only writable",
  { skip: !url || !key || !secret || !path },
  async (t) => {
    const options = {
      auth: { persistSession: false, autoRefreshToken: false },
    };
    const owner = createClient(url, secret, options);
    const anon = createClient(url, key, options);
    const admin = createClient(url, key, options);
    const other = createClient(url, key, options);
    const creds = JSON.parse(readFileSync(path, "utf8"));
    let otherId;
    const before = await owner
      .from("site_settings")
      .select("theme")
      .eq("id", 1)
      .single();
    assert.equal(before.error, null);
    const original = before.data.theme;
    try {
      await t.test("anonymous can read the current theme", async () => {
        const r = await anon
          .from("site_settings")
          .select("theme")
          .eq("id", 1)
          .single();
        assert.equal(r.error, null);
        assert.ok(isThemeId(r.data.theme));
      });
      await t.test(
        "anonymous cannot change, insert or delete the theme",
        async () => {
          assert.ok(
            (
              await anon
                .from("site_settings")
                .update({ theme: "violet" })
                .eq("id", 1)
            ).error,
          );
          assert.ok((await anon.from("site_settings").insert({ id: 2 })).error);
          assert.ok(
            (await anon.from("site_settings").delete().eq("id", 1)).error,
          );
        },
      );
      await t.test(
        "authenticated non-admin cannot change the theme even with forged user metadata",
        async () => {
          const email = `nexora-theme-test-${randomUUID()}@example.com`;
          const password = randomBytes(24).toString("hex");
          const created = await owner.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: "admin", is_admin: true },
          });
          assert.equal(created.error, null);
          otherId = created.data.user.id;
          assert.equal(
            (await other.auth.signInWithPassword({ email, password })).error,
            null,
          );
          const changed = await other
            .from("site_settings")
            .update({ theme: "lime" })
            .eq("id", 1)
            .select();
          assert.equal(changed.data?.length, 0);
        },
      );
      await t.test(
        "provisioned admin can change the theme and it is immediately visible anonymously",
        async () => {
          assert.equal(
            (
              await admin.auth.signInWithPassword({
                email: creds.email,
                password: creds.password,
              })
            ).error,
            null,
          );
          const next = original === "violet" ? "lime" : "violet";
          const r = await admin
            .from("site_settings")
            .update({ theme: next })
            .eq("id", 1)
            .select("theme")
            .single();
          assert.equal(r.error, null);
          assert.equal(r.data.theme, next);
          const seen = await anon
            .from("site_settings")
            .select("theme")
            .eq("id", 1)
            .single();
          assert.equal(seen.data.theme, next);
        },
      );
      await t.test("admin cannot set an invalid theme value", async () => {
        assert.ok(
          (
            await admin
              .from("site_settings")
              .update({ theme: "sunrise" })
              .eq("id", 1)
          ).error,
        );
      });
    } finally {
      const restore = await owner
        .from("site_settings")
        .update({ theme: original })
        .eq("id", 1);
      assert.equal(restore.error, null);
      await admin.auth.signOut();
      await other.auth.signOut();
      if (otherId)
        assert.equal((await owner.auth.admin.deleteUser(otherId)).error, null);
    }
  },
);
