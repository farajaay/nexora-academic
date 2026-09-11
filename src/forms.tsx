import { useState, type FormEvent, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  ArrowLeft,
  Calculator as CalcIcon,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { contactReady, options, services, site, units } from "./config/site";
import {
  choicesFromQuery,
  choicesToQuery,
  defaults,
  estimate,
  type Choices,
} from "./lib/pricing";
import { orderMessage, validateOrder, type OrderInput } from "./lib/orders";
import { db } from "./lib/backend";
import { PageIntro, useLanguage } from "./ui";
export function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && (
        <span id={`${name}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
export function ChoiceFields({
  value,
  change,
  errors = {},
}: {
  value: Choices;
  change: (patch: Partial<Choices>) => void;
  errors?: Record<string, string>;
}) {
  const { lang, t } = useLanguage();
  const service = services.find((s) => s.id === value.service)!;
  return (
    <>
      <Field
        name="stage"
        label={t("المرحلة الدراسية", "Study stage")}
        error={errors.stage}
      >
        <select
          id="stage"
          value={value.stage}
          onChange={(e) => change({ stage: e.target.value })}
        >
          {options.stage.map((x) => (
            <option value={x.id} key={x.id}>
              {x[lang]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        name="service"
        label={t("نوع الخدمة", "Service type")}
        error={errors.service}
      >
        <select
          id="service"
          value={value.service}
          onChange={(e) =>
            change({
              service: e.target.value,
              quantity:
                services.find((s) => s.id === e.target.value)?.unit === "words"
                  ? 250
                  : 1,
            })
          }
        >
          {services.map((x) => (
            <option value={x.id} key={x.id}>
              {x[lang]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        name="quantity"
        label={units[service.unit][lang]}
        error={errors.quantity}
      >
        <input
          id="quantity"
          type="number"
          min="1"
          max="100000"
          step="1"
          required
          value={value.quantity}
          onChange={(e) => change({ quantity: Number(e.target.value) })}
        />
      </Field>
      {(["language", "deadline", "difficulty"] as const).map((key) => (
        <Field
          key={key}
          name={key}
          label={
            key === "language"
              ? t("لغة المحتوى", "Content language")
              : key === "deadline"
                ? t("موعد التسليم", "Delivery time")
                : t("مستوى الصعوبة", "Difficulty")
          }
          error={errors[key]}
        >
          <select
            id={key}
            value={value[key]}
            onChange={(e) => change({ [key]: e.target.value })}
          >
            {options[key].map((x) => (
              <option value={x.id} key={x.id}>
                {x[lang]}
              </option>
            ))}
          </select>
        </Field>
      ))}
      <fieldset className="extras full">
        <legend>
          {t("خدمات إضافية (اختياري)", "Additional services (optional)")}
        </legend>
        {(["feedback", "references"] as const).map((key) => (
          <label key={key} className="check-row">
            <input
              type="checkbox"
              checked={value.extras.includes(key)}
              onChange={(e) =>
                change({
                  extras: e.target.checked
                    ? [...value.extras, key]
                    : value.extras.filter((x) => x !== key),
                })
              }
            />
            <span>
              {key === "feedback"
                ? t("تغذية راجعة موسعة", "Extended feedback")
                : t("مراجعة تنسيق المراجع", "Reference formatting review")}
            </span>
            <small>
              +{site.extras[key]} {site.currency[lang]}
            </small>
          </label>
        ))}
      </fieldset>
    </>
  );
}
export function PriceSummary({ value }: { value: Choices }) {
  const { t, lang } = useLanguage();
  const price = estimate(value);
  return (
    <aside className="price-summary">
      <span className="icon-box">
        <CalcIcon size={25} />
      </span>
      <h2>{t("تقديرك المبدئي", "Your initial estimate")}</h2>
      <p>
        {t(
          "مساحة أوضح لاتخاذ قرارك",
          "A clearer starting point for your decision",
        )}
      </p>
      <div className="price-value" aria-live="polite">
        {price ? (
          <>
            <b dir="ltr">
              {price.low.toLocaleString("en")} –{" "}
              {price.high.toLocaleString("en")}
            </b>
            <span>{site.currency[lang]}</span>
          </>
        ) : (
          <b>{t("حسب النطاق", "Custom quote")}</b>
        )}
      </div>
      <div className="summary-detail">
        <CheckCircle2 size={17} />
        {t("جولة تعديل واحدة مشمولة", "One revision included")}
      </div>
      <div className="summary-detail">
        <ShieldCheck size={17} />
        {t("السعر يؤكد قبل البدء", "Price confirmed before starting")}
      </div>
      <p className="estimate-note">
        {t(
          "هذا نطاق تقديري وليس سعرًا نهائيًا. يثبت السعر بعد مراجعة الملف والتعليمات. المرحلة الدراسية للسياق ولا تضيف رسومًا تلقائية.",
          "This is an estimate, not a final price. The price is confirmed after reviewing files and instructions. Study stage is contextual and adds no automatic charge.",
        )}
      </p>
      <small>
        {t(
          "علاوات الصعوبة والإضافات تقديرية. تُضرب علاوة الاستعجال واللغة في المجموع، مع حد أدنى 40 ر.س.",
          "Difficulty and extras are estimates. Rush and language multipliers apply to the subtotal, with a SAR 40 minimum.",
        )}
      </small>
    </aside>
  );
}
export function Calculator() {
  const { t } = useLanguage();
  const [value, setValue] = useState(defaults);
  const navigate = useNavigate();
  return (
    <>
      <PageIntro
        title={t(
          "خطط لطلبك، واعرف تقديره",
          "Plan your request. Know the estimate.",
        )}
        subtitle={t(
          "تفاصيل بسيطة تمنحك نطاقًا سعريًا أقرب لاحتياجك.",
          "A few details give you a price range tailored to your needs.",
        )}
      />
      <div className="form-layout">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/contact?${choicesToQuery(value)}`);
          }}
        >
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div>
              <h2>{t("تفاصيل الخدمة", "Service details")}</h2>
              <p>
                {t(
                  "عدّل الخيارات وشاهد التقدير مباشرة.",
                  "Change your options to update your estimate instantly.",
                )}
              </p>
            </div>
          </div>
          <div className="form-grid">
            <ChoiceFields
              value={value}
              change={(patch) => setValue({ ...value, ...patch })}
            />
          </div>
          <button className="button wide">
            {t("إرسال تفاصيل الطلب", "Send request details")}
            <ArrowLeft size={18} />
          </button>
        </form>
        <PriceSummary value={value} />
      </div>
    </>
  );
}
export function Contact() {
  const { t, lang } = useLanguage();
  const [query] = useSearchParams();
  const [value, setValue] = useState<OrderInput>(() => ({
    ...choicesFromQuery(query),
    name: "",
    phone: "",
    email: "",
    major: "",
    description: "",
    pages: 1,
    files_url: "",
    preferred_contact: "whatsapp",
    consent: false,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const patch = (p: Partial<OrderInput>) => setValue((v) => ({ ...v, ...p }));
  function valid() {
    const next = validateOrder(value, lang);
    setErrors(next);
    if (Object.keys(next).length) {
      setMessage(
        t("راجع الحقول الموضحة أدناه.", "Review the highlighted fields below."),
      );
      setTimeout(
        () => document.getElementById(Object.keys(next)[0])?.focus(),
        0,
      );
      return false;
    }
    setMessage("");
    return true;
  }
  async function send(
    channel: "save" | "whatsapp" | "email" | "copy",
    e?: FormEvent,
  ) {
    e?.preventDefault();
    if (!valid()) return;
    const text = orderMessage(value, lang);
    if (channel === "copy") {
      try {
        await navigator.clipboard.writeText(text);
        setMessage(
          t(
            "تم نسخ تفاصيل الطلب. لم يتم إرسالها بعد.",
            "Request details copied. They have not been sent.",
          ),
        );
      } catch {
        setMessage(
          t(
            "تعذر النسخ. تحقق من إذن الحافظة.",
            "Copy failed. Check clipboard permissions.",
          ),
        );
      }
      return;
    }
    if (channel === "whatsapp") {
      if (!contactReady.whatsapp) return;
      window.open(
        `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      navigate("/success", { state: { channel } });
      return;
    }
    if (channel === "email") {
      if (!contactReady.email) return;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(t("طلب دعم أكاديمي", "Academic support request"))}&body=${encodeURIComponent(text)}`;
      navigate("/success", { state: { channel } });
      return;
    }
    if (!db) {
      setMessage(
        t(
          "الحفظ الإلكتروني غير متاح حاليًا. يمكنك نسخ تفاصيل الطلب.",
          "Online submission is currently unavailable. You can copy your request details.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const { consent, ...payload } = value;
      const id = crypto.randomUUID();
      const { error } = await db
        .from("orders")
        .insert({
          ...payload,
          id,
          consent,
          phone: value.phone.replace(/[\s-]/g, ""),
          name: value.name.trim(),
          description: value.description.trim(),
        });
      if (error) throw error;
      navigate("/success", { state: { channel: "save", id } });
    } catch {
      setMessage(
        t(
          "تعذر حفظ الطلب. لم نؤكد الاستلام. تحقق من الاتصال وحاول مجددًا أو انسخ التفاصيل.",
          "Your request could not be saved. Receipt is not confirmed. Check your connection and retry or copy the details.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageIntro
        title={t("لنبدأ من احتياجك", "Let’s start with what you need")}
        subtitle={t(
          "أخبرنا بالتفاصيل، ونراجعها معك خطوة بخطوة.",
          "Share the details and we’ll review them with you, step by step.",
        )}
      />
      <div className="form-layout">
        <form
          className="panel order-form"
          onSubmit={(e) => void send("save", e)}
          noValidate
        >
          <h2>{t("طلب دعم أكاديمي", "Academic support request")}</h2>
          <p>
            {t(
              "جميع الحقول مطلوبة ما لم يذكر أنها اختيارية.",
              "All fields are required unless marked optional.",
            )}
          </p>
          <div className="form-grid">
            {(
              [
                ["name", t("الاسم", "Name"), "text", "name"],
                ["phone", t("رقم الجوال", "Mobile number"), "tel", "tel"],
                [
                  "email",
                  t("البريد الإلكتروني (اختياري)", "Email (optional)"),
                  "email",
                  "email",
                ],
                [
                  "major",
                  t("التخصص / المسار", "Major / study track"),
                  "text",
                  "off",
                ],
              ] as const
            ).map(([key, label, type, auto]) => (
              <Field key={key} name={key} label={label} error={errors[key]}>
                <input
                  id={key}
                  type={type}
                  autoComplete={auto}
                  maxLength={key === "email" ? 254 : 100}
                  value={value[key]}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  onChange={(e) => patch({ [key]: e.target.value })}
                />
              </Field>
            ))}
            <ChoiceFields value={value} change={patch} errors={errors} />
            <div className="full">
              <Field
                name="description"
                label={t(
                  "وصف الطلب وما تحتاج فهمه أو تحسينه",
                  "Request description and what you want to understand or improve",
                )}
                error={errors.description}
              >
                <textarea
                  id="description"
                  rows={5}
                  maxLength={4000}
                  value={value.description}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </Field>
            </div>
            <Field
              name="pages"
              label={t("عدد الصفحات أو الأسئلة", "Pages or questions")}
              error={errors.pages}
            >
              <input
                id="pages"
                type="number"
                min="1"
                max="10000"
                value={value.pages}
                onChange={(e) => patch({ pages: Number(e.target.value) })}
              />
            </Field>
            <Field
              name="preferred_contact"
              label={t("طريقة التواصل المفضلة", "Preferred contact")}
            >
              <select
                id="preferred_contact"
                value={value.preferred_contact}
                onChange={(e) => patch({ preferred_contact: e.target.value })}
              >
                <option value="whatsapp">{t("واتساب", "WhatsApp")}</option>
                <option value="phone">{t("اتصال هاتفي", "Phone call")}</option>
                <option value="email" disabled={!value.email}>
                  {t("البريد الإلكتروني", "Email")}
                </option>
              </select>
            </Field>
            <div className="full">
              <Field
                name="files_url"
                label={t("رابط الملفات (اختياري)", "File link (optional)")}
                error={errors.files_url}
              >
                <input
                  id="files_url"
                  type="url"
                  dir="ltr"
                  placeholder="https://"
                  value={value.files_url}
                  onChange={(e) => patch({ files_url: e.target.value })}
                />
              </Field>
              <p className="field-hint">
                {t(
                  "شارك فقط الملفات اللازمة، وتأكد من صلاحية الوصول للرابط.",
                  "Share only necessary files and check the link’s access permissions.",
                )}
              </p>
            </div>
          </div>
          <label className="check-row consent">
            <input
              id="consent"
              type="checkbox"
              checked={value.consent}
              onChange={(e) => patch({ consent: e.target.checked })}
            />
            <span>
              {t("أوافق على", "I accept the")}{" "}
              <Link to="/terms" target="_blank">
                {t("شروط الاستخدام", "terms")}
              </Link>{" "}
              {t("و", "and")}{" "}
              <Link to="/privacy" target="_blank">
                {t("الخصوصية", "privacy")}
              </Link>{" "}
              {t("و", "and")}{" "}
              <Link to="/integrity" target="_blank">
                {t("سياسة النزاهة الأكاديمية", "academic integrity policy")}
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="field-error">{errors.consent}</p>}
          {message && (
            <p className="notice" role="status">
              {message}
            </p>
          )}
          <button className="button wide" disabled={busy || !db}>
            {busy
              ? t("جارٍ حفظ الطلب…", "Saving request…")
              : t("إرسال وحفظ الطلب", "Submit & save request")}
            <ArrowLeft size={18} />
          </button>
          {!db && (
            <p className="notice">
              {t(
                "استقبال الطلبات الإلكتروني قيد الإعداد. يمكنك تجهيز تفاصيلك ونسخها.",
                "Online request submission is being set up. You can prepare and copy your details.",
              )}
            </p>
          )}
          <div className="contact-buttons">
            <button
              className="button secondary"
              type="button"
              disabled={!contactReady.whatsapp}
              onClick={() => void send("whatsapp")}
            >
              <MessageCircle size={18} />
              {t("عبر واتساب", "WhatsApp")}
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={!contactReady.email}
              onClick={() => void send("email")}
            >
              <Mail size={18} />
              {t("عبر البريد", "Email")}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => void send("copy")}
            >
              <Copy size={18} />
              {t("نسخ الطلب", "Copy request")}
            </button>
          </div>
          {(!contactReady.whatsapp || !contactReady.email) && (
            <p className="field-hint">
              {t(
                "قنوات التواصل المباشر قيد التجهيز؛ تتفعّل عند إضافة بيانات المنصة الرسمية.",
                "Direct contact channels are being prepared and activate when official business details are added.",
              )}
            </p>
          )}
        </form>
        <div>
          <PriceSummary value={value} />
          <div className="support-note">
            <ShieldCheck size={24} />
            <h3>
              {t("دعم يحترم رحلتك", "Support that respects your journey")}
            </h3>
            <p>
              {t(
                "نشرح ونراجع ونرشد. يبقى فهم العمل والالتزام بأنظمة المؤسسة مسؤوليتك.",
                "We explain, review and guide. Understanding the work and following institutional rules remain your responsibility.",
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export function Success() {
  const { t } = useLanguage();
  const { state } = useLocation();
  const saved = state?.channel === "save";
  return (
    <div className="empty-state">
      <span className="success-icon">
        <CheckCircle2 size={40} />
      </span>
      <h1>
        {saved
          ? t("تم حفظ طلبك بنجاح", "Your request has been saved")
          : state
            ? t("تفاصيل طلبك جاهزة", "Your request details are ready")
            : t("ابدأ بإرسال طلبك", "Start with your request")}
      </h1>
      <p>
        {saved
          ? t(
              "وصلت التفاصيل إلى لوحة الإدارة لمراجعتها. احتفظ برقم الطلب للمتابعة.",
              "Your details reached the admin dashboard for review. Keep your reference for follow-up.",
            )
          : state
            ? t(
                "أكمل الإرسال داخل تطبيق واتساب أو البريد. فتح التطبيق لا يعني أن الرسالة أرسلت أو أن الطلب تم حفظه.",
                "Complete sending in WhatsApp or your email app. Opening the app does not mean the message was sent or the request saved.",
              )
            : t(
                "لم يتم تأكيد أي طلب في هذه الصفحة.",
                "No request has been confirmed on this page.",
              )}
      </p>
      {saved && (
        <code className="reference" dir="ltr">
          {state.id}
        </code>
      )}
      <Link className="button" to={state ? "/" : "/contact"}>
        {state
          ? t("العودة للرئيسية", "Back to home")
          : t("اطلب الخدمة", "Request a service")}
      </Link>
    </div>
  );
}
