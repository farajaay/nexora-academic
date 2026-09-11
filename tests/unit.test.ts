import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaults,
  estimate,
  choicesToQuery,
  choicesFromQuery,
} from "../src/lib/pricing.ts";
import {
  validateOrder,
  orderMessage,
  type OrderInput,
} from "../src/lib/orders.ts";
import { services } from "../src/config/site.ts";
import {
  DEFAULT_THEME,
  isThemeId,
  themes,
  type ThemeId,
} from "../src/config/theme.ts";
test("pricing: minimum, urgency, translation blocks and custom scope", () => {
  assert.deepEqual(estimate(defaults), { low: 40, high: 46 });
  assert.equal(
    estimate({ ...defaults, service: "proofread", quantity: 250 })?.low,
    40,
  );
  assert.equal(
    estimate({ ...defaults, service: "translation", quantity: 501 })?.low,
    90,
  );
  assert.equal(estimate({ ...defaults, deadline: "day" })?.low, 52);
  assert.equal(estimate({ ...defaults, deadline: "halfday" })?.low, 60);
  assert.deepEqual(
    estimate({ ...defaults, service: "report", language: "specialized" }),
    { low: 110, high: 120 },
  );
  assert.equal(estimate({ ...defaults, service: "graduation" }), null);
});
test("all fixed-price services use configured starting prices", () => {
  for (const s of services.filter((s) => s.price > 0))
    assert.equal(
      estimate({ ...defaults, service: s.id })?.low,
      Math.max(40, s.price),
    );
});
test("calculator selections survive request URL handoff", () => {
  const choices = {
    ...defaults,
    service: "cad",
    quantity: 3,
    language: "specialized",
    deadline: "halfday",
    extras: ["feedback"],
  };
  assert.deepEqual(
    choicesFromQuery(new URLSearchParams(choicesToQuery(choices))),
    choices,
  );
  assert.equal(
    choicesFromQuery(new URLSearchParams("service=bogus&quantity=-2")).service,
    "homework",
  );
});
const valid: OrderInput = {
  ...defaults,
  name: "اختبار نيكسورا",
  phone: "0500000000",
  email: "",
  major: "هندسة",
  description: "طلب اختبار آلي للتحقق من صحة النموذج دون إرسال بيانات فعلية.",
  pages: 3,
  files_url: "https://example.com/test",
  preferred_contact: "whatsapp",
  consent: true,
};
test("reject invalid mobile, insecure links, short descriptions and missing consent", () => {
  assert.deepEqual(validateOrder(valid, "ar"), {});
  const errors = validateOrder(
    {
      ...valid,
      phone: "123",
      files_url: "javascript:alert(1)",
      description: "قصير",
      consent: false,
    },
    "ar",
  );
  for (const key of ["phone", "files_url", "description", "consent"])
    assert.ok(errors[key]);
});
test("messages include request detail and safely survive URL encoding", () => {
  const message = orderMessage(
    {
      ...valid,
      description: valid.description + " & # +",
      email: "test@example.com",
    },
    "ar",
  );
  for (const text of [
    valid.name,
    valid.phone,
    valid.major,
    valid.files_url,
    "test@example.com",
    "النزاهة",
  ])
    assert.ok(message.includes(text));
  assert.equal(decodeURIComponent(encodeURIComponent(message)), message);
});

// Validation is shared by selection and submission.
test("attachment limits reject oversized, empty, unsupported and excess files", async () => {
  const { attachmentError } = await import("../src/lib/attachments");
  assert.equal(attachmentError([{ name: "report.PDF", size: 1024 }], "en"), "");
  for (const files of [
    [{ name: "a.exe", size: 1 }],
    [{ name: "a.pdf", size: 0 }],
    [{ name: "a.pdf", size: 10485761 }],
    Array.from({ length: 6 }, () => ({ name: "a.pdf", size: 1 })),
  ]) {
    assert.ok(attachmentError(files, "en"));
    assert.ok(attachmentError(files, "ar"));
  }
});
test("themes: default is valid, every theme has bilingual text and a real swatch", () => {
  const ids: ThemeId[] = ["emerald", "violet", "lime"];
  assert.equal(themes.length, ids.length);
  assert.ok(isThemeId(DEFAULT_THEME));
  assert.ok(ids.includes(DEFAULT_THEME));
  for (const id of ids) {
    const theme = themes.find((t) => t.id === id);
    assert.ok(theme, `missing theme entry for ${id}`);
    for (const lang of ["ar", "en"] as const) {
      assert.ok(theme!.name[lang].trim().length > 0);
      assert.ok(theme!.blurb[lang].trim().length > 0);
    }
    assert.equal(theme!.swatch.length, 3);
    for (const color of theme!.swatch) assert.match(color, /^#[0-9a-f]{6}$/);
  }
  assert.ok(!isThemeId("sunrise"));
  assert.ok(!isThemeId(""));
});
