// Operator-only utility. Never bundle this script into the browser.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
const {
  NEXORA_SUPABASE_URL,
  NEXORA_SERVICE_ROLE_KEY,
  NEXORA_ADMIN_EMAIL,
  NEXORA_CREDENTIALS_PATH,
} = process.env;
if (
  ![
    NEXORA_SUPABASE_URL,
    NEXORA_SERVICE_ROLE_KEY,
    NEXORA_ADMIN_EMAIL,
    NEXORA_CREDENTIALS_PATH,
  ].every(Boolean)
)
  throw new Error("Required operator environment variables are missing.");
const client = createClient(NEXORA_SUPABASE_URL, NEXORA_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const password = randomBytes(24).toString("base64url");
const { data, error } = await client.auth.admin.createUser({
  email: NEXORA_ADMIN_EMAIL,
  password,
  email_confirm: true,
});
if (error) {
  console.error("Admin creation failed:", error.code || error.status);
  process.exit(1);
}
// Persist locally before provisioning the role, so a failed role write cannot lose credentials.
mkdirSync(dirname(NEXORA_CREDENTIALS_PATH), { recursive: true });
writeFileSync(
  NEXORA_CREDENTIALS_PATH,
  JSON.stringify(
    {
      email: NEXORA_ADMIN_EMAIL,
      password,
      userId: data.user.id,
      adminUrl: "https://farajaay.github.io/nexora-academic/admin/",
    },
    null,
    2,
  ),
  { mode: 0o600 },
);
const role = await client.from("admins").insert({ user_id: data.user.id });
if (role.error) {
  console.error(
    "Account created but admin membership failed:",
    role.error.code,
  );
  process.exit(1);
}
console.log(
  "Admin account provisioned. Credentials saved to the private local file; no email sent.",
);
