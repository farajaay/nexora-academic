import { useEffect, useState, type FormEvent } from "react";
import { LockKeyhole, LogOut, RefreshCw } from "lucide-react";
import { db, type Order, type Payment } from "./lib/backend";
import { services, site } from "./config/site";
import { Field } from "./forms";
import { PageIntro, useLanguage } from "./ui";
const statuses = [
  ["new", "جديد", "New"],
  ["reviewing", "قيد المراجعة", "Reviewing"],
  ["agreed", "تم الاتفاق", "Agreed"],
  ["in_progress", "قيد التنفيذ", "In progress"],
  ["completed", "مكتمل", "Completed"],
  ["cancelled", "ملغي", "Cancelled"],
] as const;
export default function Admin() {
  const { t, lang } = useLanguage();
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [quote, setQuote] = useState("");
  const [status, setStatus] = useState("new");
  useEffect(() => {
    if (!db) return;
    const { data } = db.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthorized(false);
        setOrders([]);
        setPayments([]);
        setSelected(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  async function load() {
    if (!db) return;
    setBusy(true);
    try {
      const [a, b] = await Promise.all([
        db.from("orders").select("*").order("created_at", { ascending: false }),
        db.from("payments").select("*").order("paid_at", { ascending: false }),
      ]);
      if (a.error || b.error) throw Error();
      setOrders(a.data as Order[]);
      setPayments(b.data as Payment[]);
    } catch {
      setNotice(
        t(
          "تعذر تحميل السجلات. حاول التحديث.",
          "Could not load records. Try refreshing.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!db) return;
    setBusy(true);
    setNotice("");
    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password,
      });
      setPassword("");
      if (error || !data.user) throw Error();
      const role = await db
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (role.error || !role.data) {
        await db.auth.signOut();
        throw Error();
      }
      setAuthorized(true);
      await load();
    } catch {
      setNotice(
        t(
          "تعذر الدخول. تحقق من بياناتك وصلاحية الإدارة.",
          "Sign-in failed. Check your credentials and admin access.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  function choose(o: Order) {
    setSelected(o);
    setQuote(o.quoted_total === null ? "" : String(o.quoted_total));
    setStatus(o.status);
    setAmount("");
    setReference("");
    setNotice("");
  }
  async function update(e: FormEvent) {
    e.preventDefault();
    if (!db || !selected) return;
    const value = quote === "" ? null : Number(quote);
    if (
      value !== null &&
      (!Number.isFinite(value) || value < 0 || value > 1000000)
    )
      return;
    setBusy(true);
    const { data, error } = await db
      .from("orders")
      .update({ status, quoted_total: value })
      .eq("id", selected.id)
      .select()
      .single();
    if (error) setNotice(t("تعذر حفظ التغيير.", "Could not save changes."));
    else {
      setSelected(data as Order);
      setNotice(t("تم تحديث الطلب.", "Order updated."));
      await load();
    }
    setBusy(false);
  }
  async function addPayment(e: FormEvent) {
    e.preventDefault();
    if (!db || !selected) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || n > 1000000 || !reference.trim())
      return;
    setBusy(true);
    const { error } = await db
      .from("payments")
      .insert({
        order_id: selected.id,
        amount: n,
        reference: reference.trim(),
      });
    if (error)
      setNotice(
        t(
          "تعذر إضافة الدفعة. تأكد من عدم تكرار المرجع.",
          "Could not add payment. Check for a duplicate reference.",
        ),
      );
    else {
      setAmount("");
      setReference("");
      setNotice(t("تم تسجيل الدفعة المؤكدة.", "Confirmed payment recorded."));
      await load();
    }
    setBusy(false);
  }
  const total = payments.reduce((a, b) => a + Number(b.amount), 0);
  const paid = selected
    ? payments
        .filter((p) => p.order_id === selected.id)
        .reduce((a, b) => a + Number(b.amount), 0)
    : 0;
  if (!authorized)
    return (
      <>
        <PageIntro
          title={t("لوحة إدارة نيكسورا", "Nexora administration")}
          subtitle={t(
            "مساحة خاصة لإدارة الطلبات والدفعات.",
            "A private space for managing orders and payments.",
          )}
        />
        <form className="panel login-panel" onSubmit={(e) => void login(e)}>
          <span className="icon-box">
            <LockKeyhole />
          </span>
          <h2>{t("تسجيل دخول الإدارة", "Admin sign in")}</h2>
          <Field name="admin-email" label={t("البريد الإلكتروني", "Email")}>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field name="admin-password" label={t("كلمة المرور", "Password")}>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </Field>
          {notice && (
            <p className="notice" role="alert">
              {notice}
            </p>
          )}
          {!db && (
            <p className="notice">
              {t(
                "قاعدة البيانات لم تربط بعد. تسجيل الدخول غير متاح.",
                "The database is not connected yet. Sign-in is unavailable.",
              )}
            </p>
          )}
          <button className="button wide" disabled={busy || !db}>
            {busy
              ? t("جارٍ التحقق…", "Checking…")
              : t("تسجيل الدخول", "Sign in")}
          </button>
          <p className="field-hint">
            {t(
              "الدخول للحسابات المخولة فقط. تنتهي جلسة الإدارة عند إعادة تحميل الصفحة.",
              "Authorized accounts only. The admin session ends when the page reloads.",
            )}
          </p>
        </form>
      </>
    );
  return (
    <>
      <div className="admin-heading">
        <PageIntro
          title={t("الطلبات والمدفوعات", "Orders & payments")}
          subtitle={t(
            "كل طلب، وخطوته القادمة.",
            "Every request and its next step.",
          )}
        />
        <button
          className="button secondary"
          onClick={() => void db?.auth.signOut()}
        >
          <LogOut size={17} />
          {t("خروج", "Sign out")}
        </button>
      </div>
      <div className="admin-stats">
        <article>
          <small>{t("إجمالي الطلبات", "Total requests")}</small>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <small>{t("طلبات نشطة", "Active requests")}</small>
          <strong>
            {
              orders.filter(
                (o) => !["completed", "cancelled"].includes(o.status),
              ).length
            }
          </strong>
        </article>
        <article>
          <small>{t("دفعات مسجلة", "Recorded payments")}</small>
          <strong>
            {total.toLocaleString()} <small>{site.currency[lang]}</small>
          </strong>
        </article>
      </div>
      <div className="admin-toolbar">
        <input
          aria-label={t("بحث في الطلبات", "Search requests")}
          placeholder={t(
            "بحث بالاسم أو رقم الطلب أو الجوال…",
            "Search name, reference or mobile…",
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label={t("حالة الطلب", "Order status")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">{t("جميع الحالات", "All statuses")}</option>
          {statuses.map(([id, ar, en]) => (
            <option value={id} key={id}>
              {t(ar, en)}
            </option>
          ))}
        </select>
        <button
          className="button secondary"
          disabled={busy}
          onClick={() => void load()}
        >
          <RefreshCw size={17} />
          {t("تحديث", "Refresh")}
        </button>
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      <div className="admin-layout">
        <div className="order-list">
          {orders
            .filter(
              (o) =>
                (filter === "all" || o.status === filter) &&
                `${o.id} ${o.name} ${o.phone}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            )
            .map((o) => (
              <button
                key={o.id}
                className={`order-row ${selected?.id === o.id ? "active" : ""}`}
                onClick={() => choose(o)}
              >
                <strong>{o.name}</strong>
                <span>
                  {services.find((s) => s.id === o.service)?.[lang] ||
                    o.service}
                </span>
                <small>
                  {new Date(o.created_at).toLocaleDateString(lang)} ·{" "}
                  {
                    statuses.find((s) => s[0] === o.status)?.[
                      lang === "ar" ? 1 : 2
                    ]
                  }
                </small>
              </button>
            ))}
          {orders.length === 0 && (
            <div className="panel">
              <h2>{t("لا توجد طلبات بعد", "No requests yet")}</h2>
              <p>
                {t(
                  "ستظهر الطلبات المحفوظة هنا.",
                  "Saved requests will appear here.",
                )}
              </p>
            </div>
          )}
        </div>
        <section className="panel order-detail">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <code dir="ltr" className="reference">
                {selected.id}
              </code>
              <dl>
                {[
                  ["الجوال", "Mobile", selected.phone],
                  ["البريد", "Email", selected.email || "—"],
                  ["التخصص", "Major", selected.major],
                  ["المرحلة", "Stage", selected.stage],
                  ["الخدمة", "Service", selected.service],
                  ["حجم العمل", "Quantity", String(selected.quantity)],
                  [
                    "الصفحات / الأسئلة",
                    "Pages / questions",
                    String(selected.pages),
                  ],
                  ["اللغة", "Language", selected.language],
                  ["الموعد", "Deadline", selected.deadline],
                  ["الصعوبة", "Difficulty", selected.difficulty],
                  ["الإضافات", "Extras", selected.extras.join(", ") || "—"],
                  [
                    "التواصل المفضل",
                    "Preferred contact",
                    selected.preferred_contact,
                  ],
                ].map(([ar, en, v]) => (
                  <div key={en}>
                    <dt>{t(ar, en)}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <h3>{t("وصف الطلب", "Request description")}</h3>
              <p className="preserve-lines">{selected.description}</p>
              {selected.files_url.startsWith("https://") && (
                <a
                  className="text-link"
                  href={selected.files_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("فتح رابط الملفات", "Open file link")}
                </a>
              )}
              <form onSubmit={(e) => void update(e)} className="admin-edit">
                <Field name="status" label={t("حالة الطلب", "Status")}>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statuses.map(([id, ar, en]) => (
                      <option value={id} key={id}>
                        {t(ar, en)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  name="quote"
                  label={t("السعر المتفق عليه (ر.س)", "Agreed price (SAR)")}
                >
                  <input
                    id="quote"
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  />
                </Field>
                <button className="button" disabled={busy}>
                  {t("حفظ التغييرات", "Save changes")}
                </button>
              </form>
              <hr />
              <h3>{t("سجل الدفعات", "Payment ledger")}</h3>
              <p>
                {t("المدفوع:", "Paid:")} {paid} {site.currency[lang]} ·{" "}
                {t("المتبقي:", "Balance:")}{" "}
                {selected.quoted_total === null
                  ? "—"
                  : (Number(selected.quoted_total) - paid).toFixed(2)}{" "}
                {site.currency[lang]}
              </p>
              <p className="field-hint">
                {t(
                  "سجّل الدفعات بعد التحقق الفعلي من استلامها فقط. هذه اللوحة لا تحصّل الأموال.",
                  "Record payments only after verifying receipt. This dashboard does not collect money.",
                )}
              </p>
              {payments
                .filter((p) => p.order_id === selected.id)
                .map((p) => (
                  <div className="payment-row" key={p.id}>
                    <span>{p.reference}</span>
                    <strong>
                      {p.amount} {site.currency[lang]}
                    </strong>
                    <small>
                      {new Date(p.paid_at).toLocaleDateString(lang)}
                    </small>
                  </div>
                ))}
              <form onSubmit={(e) => void addPayment(e)} className="admin-edit">
                <Field
                  name="amount"
                  label={t("مبلغ الدفعة (ر.س)", "Payment amount (SAR)")}
                >
                  <input
                    id="amount"
                    type="number"
                    min="0.01"
                    max="1000000"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Field>
                <Field
                  name="reference"
                  label={t("مرجع التحويل الفريد", "Unique transfer reference")}
                >
                  <input
                    id="reference"
                    required
                    maxLength={200}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </Field>
                <button className="button" disabled={busy}>
                  {t("تسجيل دفعة مؤكدة", "Record confirmed payment")}
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <h2>
                {t(
                  "اختر طلبًا لعرض تفاصيله",
                  "Select a request to view details",
                )}
              </h2>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
