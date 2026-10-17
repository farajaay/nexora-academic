import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  MessageCircle,
  GraduationCap,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { integrity, services, site } from "./config/site";
import {
  LocalizedLink,
  PageIntro,
  SectionHeading,
  BrandMark,
  ServiceCard,
  useLanguage,
} from "./ui";
export function Steps() {
  const { t } = useLanguage();
  return (
    <div className="steps-grid">
      {[
        [
          t("شاركنا التفاصيل", "Share the brief"),
          t(
            "أخبرنا بما تحتاجه، وأرفق ما لديك من ملفات أو روابط.",
            "Tell us what you need and attach any files or links you have.",
          ),
        ],
        [
          t("نتفق على النطاق", "Agree on the scope"),
          t(
            "نراجع طلبك ونؤكد النطاق والسعر والموعد قبل أن نبدأ.",
            "We review your request and confirm scope, price and timeline before we start.",
          ),
        ],
        [
          t("ننجز ونتابع", "Deliver and follow through"),
          t(
            "نسلّم العمل مع الشرح أو التوثيق اللازم، ونتابع معك حتى يكتمل.",
            "We deliver with the explanation or documentation you need, and follow up until it is complete.",
          ),
        ],
      ].map(([title, text], i) => (
        <article className="step" key={title}>
          <span className="step-number">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}
export function CTA() {
  const { t } = useLanguage();
  return (
    <section className="cta">
      <div>
        <span className="eyebrow">{t("لنبدأ", "LET’S BEGIN")}</span>
        <h2>
          {t(
            "لديك مهمة أو مشروع؟ لنجعله أوضح.",
            "Have an assignment or a project? Let’s make it clear.",
          )}
        </h2>
        <p>
          {t(
            "أرسل التفاصيل، وسنعود إليك بنطاق وسعر واضحين.",
            "Send the details and we will come back with a clear scope and price.",
          )}
        </p>
      </div>
      <LocalizedLink className="button white" to="/contact">
        {t("ابدأ طلبك", "Start your request")}
        <ArrowLeft size={18} />
      </LocalizedLink>
    </section>
  );
}
export function Home() {
  const { t } = useLanguage();
  const paths = [
    {
      id: "academic",
      Icon: GraduationCap,
      label: t("نيكسورا أكاديمي", "Nexora Academic"),
      title: t("للطلاب والباحثين", "For students and researchers"),
      text: t(
        "شرح ومراجعة وتدقيق وإرشاد يعمّق فهمك ويرفع جودة عملك، بأسعار معلنة تبدأ من 40 ر.س.",
        "Explanation, review, proofreading and mentoring that deepen your understanding and raise the quality of your work, with published prices from SAR 40.",
      ),
      items: [
        t("شرح الواجبات والمسائل", "Assignment and problem-set guidance"),
        t("مراجعة التقارير والأبحاث", "Report and research review"),
        t("العروض التقديمية والتدقيق", "Presentations and proofreading"),
        t(
          "البرمجة وCAD ومشاريع التخرج",
          "Programming, CAD and graduation projects",
        ),
      ],
      links: [
        ["/services", t("الخدمات والأسعار", "Services & pricing")],
        ["/calculator", t("احسب السعر", "Estimate a price")],
      ],
    },
    {
      id: "studio",
      Icon: Layers,
      label: t("استوديو نيكسورا", "Nexora Studio"),
      title: t("للشركات ورواد الأعمال", "For companies and founders"),
      text: t(
        "هوية تجارية، ومنتجات رقمية، وتطبيقات ويب، واستشارات صناعية تحوّل الأفكار إلى نتائج قابلة للقياس.",
        "Brand identity, digital products, web apps and industrial consulting that turn ideas into measurable results.",
      ),
      items: [
        t("تصميم الهوية التجارية", "Branding design"),
        t("تطوير المنتجات", "Product development"),
        t("تطوير تطبيقات الويب", "Web app development"),
        t("الاستشارات الصناعية", "Industrial consultation"),
      ],
      links: [
        ["/studio", t("خدمات الاستوديو", "Studio services")],
        ["/contact", t("اطلب عرض سعر", "Request a quote")],
      ],
    },
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span />
            {t("أكاديمي · استوديو", "ACADEMIC · STUDIO")}
          </span>
          <h1>
            {t("نصنع الوضوح", "We craft clarity")}
            <br />
            <span>
              {t("في التعلّم والأعمال.", "for learners and businesses.")}
            </span>
          </h1>
          <p>
            {t(
              "دعم أكاديمي يرسّخ الفهم، وخدمات احترافية تبني الهوية والمنتج وتطوّر العمليات — بمعيار واحد: الدقة والشفافية والالتزام.",
              "Academic support that builds real understanding, and professional services that shape brands, products and operations — held to one standard: precision, transparency and commitment.",
            )}
          </p>
          <div className="hero-actions">
            <LocalizedLink className="button" to="/contact">
              {t("ابدأ طلبك", "Start your request")}
              <ArrowLeft size={18} />
            </LocalizedLink>
            <a className="button secondary" href="#paths">
              {t("استكشف خدماتنا", "Explore our services")}
            </a>
          </div>
        </div>
        <aside
          className="hero-panel"
          aria-label={t("نيكسورا في أرقام", "Nexora at a glance")}
        >
          <BrandMark size={84} />
          <dl>
            <div>
              <dt>{services.length}</dt>
              <dd>{t("خدمة أكاديمية", "academic services")}</dd>
            </div>
            <div>
              <dt>4</dt>
              <dd>{t("مسارات أعمال", "business practices")}</dd>
            </div>
            <div>
              <dt>{site.minimum}</dt>
              <dd>{t("ر.س تبدأ منها الأسعار", "SAR starting price")}</dd>
            </div>
            <div>
              <dt lang="en">AR · EN</dt>
              <dd>{t("بلغتين", "bilingual")}</dd>
            </div>
          </dl>
          <span className="hero-panel-foot" dir="ltr">
            LEARN · BUILD · PROGRESS
          </span>
        </aside>
      </section>
      <section className="section" id="paths">
        <SectionHeading
          eyebrow={t("مساران، معيار واحد", "TWO PATHS, ONE STANDARD")}
          title={t("اختر المسار الذي يناسبك", "Choose the path that fits you")}
        />
        <div className="paths">
          {paths.map(({ id, Icon, label, title, text, items, links }) => (
            <article className={`path-card path-${id}`} key={id}>
              <div className="path-head">
                <span className="icon-box">
                  <Icon size={22} />
                </span>
                <span className="path-label">{label}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="path-links">
                {links.map(([to, text], i) => (
                  <LocalizedLink
                    key={to}
                    to={to}
                    className={i === 0 ? "button" : "button secondary"}
                  >
                    {text}
                    {i === 0 && <ArrowLeft size={17} />}
                  </LocalizedLink>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="trust-strip">
        {[
          [
            ShieldCheck,
            t("الشفافية أولًا", "Transparency first"),
            t("سعر ونطاق متفق عليهما مسبقًا", "Price and scope agreed upfront"),
          ],
          [
            Clock3,
            t("التزام بالمواعيد", "Reliable timelines"),
            t(
              "جداول واضحة ومتابعة مستمرة",
              "Clear schedules, steady follow-up",
            ),
          ],
          [
            MessageCircle,
            t("بلغتين", "Bilingual by default"),
            t(
              "عربي وإنجليزي بالجودة نفسها",
              "Arabic and English, same quality",
            ),
          ],
          [
            Zap,
            t("خصوصية محفوظة", "Privacy respected"),
            t(
              "نطّلع فقط على ما تحتاجه الخدمة",
              "We access only what the work needs",
            ),
          ],
        ].map(([C, title, text]) => {
          const Comp = C as typeof ShieldCheck;
          return (
            <div key={String(title)}>
              <Comp size={23} />
              <span>
                <strong>{String(title)}</strong>
                <small>{String(text)}</small>
              </span>
            </div>
          );
        })}
      </div>
      <section className="section tinted">
        <SectionHeading
          eyebrow={t("كيف نعمل", "HOW WE WORK")}
          title={t(
            "من الفكرة إلى النتيجة في ثلاث خطوات",
            "From brief to result in three steps",
          )}
        />
        <Steps />
      </section>
      <section className="section why">
        <div>
          <span className="eyebrow">{t("لماذا نيكسورا؟", "WHY NEXORA?")}</span>
          <h2>
            {t("انضباط المهندس،", "An engineer’s discipline,")}
            <br />
            <span className="gradient-text">
              {t("وحسّ الفنان.", "an artist’s eye.")}
            </span>
          </h2>
          <p>
            {t(
              "نجمع خبرة عملية في الأتمتة والعمليات والتخطيط المالي مع حسٍّ فني يهتم بالتفاصيل، فيأتي العمل دقيقًا وجميلًا معًا.",
              "We pair hands-on experience in automation, operations and financial planning with an artistic eye for detail, so the work is both rigorous and beautiful.",
            )}
          </p>
          <LocalizedLink className="text-link" to="/integrity">
            {t(
              "التزامنا بالنزاهة الأكاديمية",
              "Our academic integrity commitment",
            )}
            <ArrowLeft size={17} />
          </LocalizedLink>
        </div>
        <div className="benefits">
          {[
            [
              t("نتائج يمكنك البناء عليها", "Results you can build on"),
              t(
                "نشرح أسباب كل قرار وتعديل، لتفهم العمل وتطوّره بنفسك.",
                "We explain the reasoning behind every decision and change, so you can understand and extend the work yourself.",
              ),
            ],
            [
              t("اتفاق واضح قبل البدء", "Clarity before we start"),
              t(
                "نطاق وسعر وموعد مكتوبة ومتفق عليها، بلا مفاجآت.",
                "A written, agreed scope, price and timeline, without surprises.",
              ),
            ],
            [
              t("عناية بالتفاصيل", "Care in every detail"),
              t(
                "مراجعة منظّمة لكل تسليم، وحماية لملفاتك وبياناتك.",
                "A structured review of every delivery, and protection for your files and data.",
              ),
            ],
          ].map(([a, b]) => (
            <div key={a}>
              <span className="benefit-check">
                <Check size={18} />
              </span>
              <div>
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section testimonials">
        <SectionHeading
          title={t(
            "التجربة التي نعمل لتقديمها",
            "The experience we work to deliver",
          )}
          text={t(
            "نماذج توضيحية مؤقتة — ليست شهادات عملاء حقيقيين.",
            "Temporary illustrative examples — not real customer testimonials.",
          )}
        />
        <div className="testimonial-grid">
          {[
            [
              t(
                "«الملاحظات خطوة بخطوة جعلت نقاط التحسين في تقريري واضحة.»",
                "“Step-by-step feedback made it clear how to improve my report.”",
              ),
              t(
                "نموذج تجربة · مراجعة تقرير",
                "Example experience · report review",
              ),
            ],
            [
              t(
                "«خرجنا بهوية متكاملة ودليل استخدام يسهّل عمل فريقنا.»",
                "“We came away with a complete identity and a guide our team can actually use.”",
              ),
              t(
                "نموذج تجربة · هوية تجارية",
                "Example experience · brand identity",
              ),
            ],
          ].map(([a, b]) => (
            <article key={b}>
              <span className="sample-badge">
                {t("نموذج مؤقت", "ILLUSTRATIVE EXAMPLE")}
              </span>
              <blockquote>{a}</blockquote>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function Services() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  return (
    <>
      <PageIntro
        eyebrow="NEXORA ACADEMIC"
        title={t(
          "دعم أكاديمي بأسعار واضحة.",
          "Academic support, clearly priced.",
        )}
        subtitle={t(
          "اختر ما تحتاجه — من شرح مسألة إلى إرشاد مشروع تخرج — واعرف السعر قبل أن تبدأ.",
          "Choose what you need — from a single problem to a graduation project — and know the price before you start.",
        )}
      />
      <div
        className="filter-row"
        aria-label={t("تصفية الخدمات", "Filter services")}
      >
        {[
          ["all", "جميع الخدمات", "All services"],
          ["learning", "الشرح والمراجعة", "Learning"],
          ["writing", "الكتابة واللغة", "Writing & language"],
          ["design", "العروض", "Presentations"],
          ["technical", "البرمجة والهندسة", "Code & engineering"],
        ].map(([id, ar, en]) => (
          <button
            className={filter === id ? "selected" : ""}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            key={id}
          >
            {t(ar, en)}
          </button>
        ))}
      </div>
      <h2 className="visually-hidden">{t("قائمة الخدمات", "Services list")}</h2>
      <div className="services-grid">
        {services
          .filter((s) => filter === "all" || s.category === filter)
          .map((s, i) => (
            <ServiceCard service={s} index={i} key={s.id} />
          ))}
      </div>
      <section className="pricing-notes section">
        <div>
          <h2>{t("ما الذي يشمله السعر؟", "What is included?")}</h2>
          <p>
            {t(
              "جولة تعديل واحدة ضمن المتطلبات الأصلية. السعر النهائي يثبت بعد مراجعة الملف والتعليمات.",
              "One revision within the original requirements. The final price is confirmed after reviewing the files and instructions.",
            )}
          </p>
          <p>
            {t("الحد الأدنى للطلب:", "Minimum order:")} {site.minimum}{" "}
            {site.currency[lang]}
          </p>
        </div>
        <ul>
          <li>{t("خلال 24 ساعة: زيادة 30%", "Within 24 hours: +30%")}</li>
          <li>{t("خلال 12 ساعة: زيادة 50%", "Within 12 hours: +50%")}</li>
          <li>
            {t(
              "الإنجليزية المتخصصة: زيادة 10–20%",
              "Specialized English: +10–20%",
            )}
          </li>
          <li>
            {t(
              "الاستعجال حسب التوفر، ويؤكد قبل البدء.",
              "Rush delivery is subject to availability and confirmed before starting.",
            )}
          </li>
        </ul>
        <LocalizedLink to="/calculator" className="button">
          {t("احسب السعر التقديري", "Estimate your price")}
        </LocalizedLink>
      </section>
    </>
  );
}
export function How() {
  const { t, lang } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("كيف نعمل", "How we work")}
        subtitle={t(
          "الخطوات نفسها لكل طلب، أكاديميًا كان أو مشروع أعمال: تواصل واضح واتفاق مكتوب قبل البدء.",
          "The same steps for every request, academic or business: clear communication and a written agreement before we start.",
        )}
      />
      <h2 className="visually-hidden">{t("خطوات الطلب", "Request steps")}</h2>
      <Steps />
      <section className="section two-cards">
        <article className="panel">
          <h2>{t("جهّز هذه التفاصيل", "Have these details ready")}</h2>
          <ul>
            <li>
              {t(
                "تعليمات الخدمة ومعايير التقييم إن وجدت.",
                "Service instructions and assessment criteria, if available.",
              )}
            </li>
            <li>
              {t(
                "الملفات الحالية وما تحتاج فهمه أو تحسينه.",
                "Your current files and what you want to understand or improve.",
              )}
            </li>
            <li>
              {t(
                "الموعد المطلوب وحجم العمل المتوقع.",
                "Your preferred deadline and expected scope.",
              )}
            </li>
          </ul>
        </article>
        <article className="panel">
          <h2>{t("قبل أن نبدأ", "Before we begin")}</h2>
          <p>
            {t(
              "نؤكد النطاق والسعر والموعد وطريقة الدفع مباشرة. تتبع الدفعات يتم إداريًا؛ لا يجمع الموقع بيانات البطاقات البنكية.",
              "We confirm the scope, price, deadline and payment method directly. Payments are tracked administratively; the website does not collect card details.",
            )}
          </p>
          <p>{site.turnaround[lang]}</p>
        </article>
      </section>
      <CTA />
    </>
  );
}
export const faqs = [
  [
    "ما الخدمات التي تقدمها نيكسورا؟",
    "What does Nexora offer?",
    "مساران: نيكسورا أكاديمي (شرح ومراجعة وتدقيق، وتطوير التقارير والعروض، ودعم البرمجة وCAD، وإرشاد مشاريع التخرج)، واستوديو نيكسورا للأعمال (الهوية التجارية، وتطوير المنتجات وتطبيقات الويب، والاستشارات الصناعية).",
    "Two paths: Nexora Academic (explanation, review, proofreading, report and presentation improvement, programming and CAD support, graduation project mentoring) and Nexora Studio for businesses (branding, product and web app development, industrial consulting).",
  ],
  [
    "كيف تُسعّر مشاريع الاستوديو؟",
    "How are Studio projects priced?",
    "كل مشروع يُسعّر حسب نطاقه بعد جلسة تعريفية مجانية، ونرسل عرضًا مكتوبًا بالمخرجات والجدول الزمني قبل البدء.",
    "Each project is quoted on its scope after a free discovery call. You receive a written proposal with deliverables and timeline before we start.",
  ],
  [
    "هل تنفذون الاختبارات أو الأعمال بدلًا عن الطالب؟",
    "Do you take exams or submit work for students?",
    "لا. نقدّم مساعدة تعليمية تحافظ على مسؤولية الطالب وفهمه، ولا ننفذ اختبارات أو انتحالًا أو تسليم أعمال نيابة عنه.",
    "No. We provide educational assistance that preserves student responsibility and understanding. We do not take exams, plagiarize or submit work on a student’s behalf.",
  ],
  [
    "هل السعر في الحاسبة نهائي؟",
    "Is the calculator price final?",
    "هو نطاق تقديري فقط. السعر النهائي يعتمد على الملف والتعليمات والصعوبة والموعد، ويثبت بالاتفاق قبل البدء.",
    "It is an estimate only. The final price depends on the files, instructions, difficulty and deadline and is agreed before work begins.",
  ],
  [
    "هل يمكن طلب تسليم عاجل؟",
    "Can I request urgent delivery?",
    "نعم حسب التوفر: خلال 24 ساعة بزيادة 30% أو خلال 12 ساعة بزيادة 50%. لا يصبح الموعد مؤكدًا حتى الاتفاق المباشر.",
    "Subject to availability: within 24 hours for +30% or within 12 hours for +50%. Deadlines are only confirmed through direct agreement.",
  ],
  [
    "هل التعديلات مشمولة؟",
    "Are revisions included?",
    "تشمل الخدمة جولة تعديل واحدة ضمن المتطلبات الأصلية. المتطلبات الجديدة أو تغيير النطاق تحتاج اتفاقًا وسعرًا جديدًا.",
    "One revision within the original requirements is included. New requirements or scope changes need a new agreement and quote.",
  ],
  [
    "كيف أرسل ملفاتي؟",
    "How do I share my files?",
    "ارفع حتى 5 ملفات بحجم 10 ميجابايت لكل ملف عند حفظ الطلب، أو أضف رابطًا آمنًا لملفاتك. تجنب مشاركة كلمات المرور أو البيانات غير اللازمة للخدمة.",
    "Upload up to 5 files of 10 MB each when saving your request, or add a secure file link. Avoid sharing passwords or information that is not needed.",
  ],
  [
    "كيف تتم متابعة الطلب والدفع؟",
    "How are orders and payments tracked?",
    "نتواصل بالطريقة التي تختارها بعد مراجعة الطلب. تحفظ الطلبات والدفعات المؤكدة في لوحة إدارة خاصة؛ لا يتم تحصيل دفع إلكتروني داخل الموقع.",
    "We contact you using your preferred method after review. Orders and confirmed payments are tracked in a private admin dashboard. The site does not process online payments.",
  ],
  [
    "هل تدعمون العربية والإنجليزية؟",
    "Do you support Arabic and English?",
    "نعم. الإنجليزية المتخصصة قد تضيف 10–20% حسب المجال. نؤكد التفاصيل بعد الاطلاع على الطلب.",
    "Yes. Specialized English may add 10–20% depending on the subject, confirmed after reviewing your request.",
  ],
] as const;
export function FAQ() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("أسئلتك، بإجابات واضحة", "Your questions, answered clearly")}
        subtitle={t(
          "كل ما تحتاج معرفته قبل خطوتك الأولى.",
          "Everything you need to know before your first step.",
        )}
      />
      <div className="faq-list">
        {faqs.map(([ar, en, a, b]) => (
          <details key={en}>
            <summary>
              <CircleHelp size={20} />
              {t(ar, en)}
              <span>+</span>
            </summary>
            <p>{t(a, b)}</p>
          </details>
        ))}
      </div>
      <CTA />
    </>
  );
}
const legal = {
  privacy: {
    title: ["سياسة الخصوصية", "Privacy policy"],
    sections: [
      [
        "البيانات التي نجمعها",
        "Information we collect",
        "نجمع الاسم والجوال وبيانات الخدمة ووصف الطلب. البريد الإلكتروني ورابط الملفات والمرفقات اختيارية. لا نطلب معلومات البطاقات أو كلمات مرورك.",
        "We collect your name, mobile number, service details and request description. Email, file links and attachments are optional. We do not request card details or passwords.",
      ],
      [
        "الاستخدام والوصول",
        "Use and access",
        "تستخدم البيانات لمراجعة الطلب والتواصل وتقديم الدعم وتتبع الدفعات. يقتصر الوصول الإداري على الأشخاص المخولين، ولا ننشر طلباتك أو نستخدمها كشهادات دون إذن.",
        "Data is used to review requests, communicate, deliver support and track payments. Administrative access is restricted to authorized people. Requests are not published or used as testimonials without permission.",
      ],
      [
        "الحفظ والخدمات الخارجية",
        "Storage and external services",
        "عند تفعيل الحفظ الإلكتروني، تحفظ الطلبات ومرفقاتها في Supabase بصلاحيات مقيدة، ولا تتاح الملفات للعامة. عند اختيار واتساب أو البريد تنتقل البيانات إلى مزود تلك الخدمة وفق سياسته. قد تعالج البيانات خارج المملكة بحسب موقع الاستضافة.",
        "When online storage is enabled, requests and attachments are stored in Supabase with restricted access. Files are not publicly accessible. Choosing WhatsApp or email passes data to that provider under its policies. Data may be processed outside Saudi Arabia depending on hosting location.",
      ],
      [
        "حقوقك ومدة الاحتفاظ",
        "Your rights and retention",
        "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها عبر قنوات التواصل المنشورة. نحتفظ ببيانات الطلب للمدة اللازمة للخدمة وتسوية الطلب، مع مراعاة متطلبات حفظ السجلات المطبقة. يجب على مشغل المنصة تحديد جدول الاحتفاظ قبل استقبال الطلبات.",
        "You can request access, correction or deletion through the published contact channels. Request data is kept as needed to deliver and settle the service, subject to applicable record retention requirements. The operator must define a retention schedule before accepting requests.",
      ],
      [
        "التفضيلات",
        "Preferences",
        "يحفظ المتصفح اختيار اللغة فقط. لا نستخدم أدوات تتبع إعلانية أو تحليلات طرف ثالث في هذه النسخة.",
        "The browser stores your language preference only. This version uses no advertising trackers or third-party analytics.",
      ],
    ],
  },
  terms: {
    title: ["الشروط والأحكام", "Terms & conditions"],
    sections: [
      [
        "نطاق الخدمة",
        "Service scope",
        "خدمات نيكسورا تعليمية وإرشادية. إرسال الطلب لا يعني قبوله أو تأكيد موعده؛ يبدأ العمل بعد الاتفاق على النطاق والسعر والموعد.",
        "Nexora services are educational and advisory. Sending a request does not imply acceptance or confirm a deadline. Work starts after scope, price and timing are agreed.",
      ],
      [
        "الأسعار والدفع",
        "Pricing and payment",
        "الأسعار تبدأ من المبالغ المعروضة، والحد الأدنى 40 ر.س. تحدد طريقة الدفع والمبلغ وجدوله بالاتفاق المباشر. سجل الدفعات إداري وليس بوابة دفع أو فاتورة ضريبية.",
        "Prices start at the listed amounts with a SAR 40 minimum. Payment method, amount and schedule are agreed directly. The payment ledger is an administrative record, not a payment gateway or tax invoice.",
      ],
      [
        "التعديل والإلغاء",
        "Revisions and cancellation",
        "تتضمن الخدمة جولة تعديل واحدة ضمن النطاق الأصلي. عند طلب الإلغاء، تتم مراجعة العمل المنجز والمبلغ المستحق والاتفاق على الاسترداد إن وجد قبل تسوية الطلب، دون الإخلال بالحقوق النظامية.",
        "One revision within the original scope is included. Cancellation requests are reviewed based on completed work and amounts due; any refund is agreed before settlement without limiting statutory rights.",
      ],
      [
        "مسؤولية الطالب",
        "Student responsibility",
        "يضمن الطالب حقه في مشاركة الملفات ودقة التعليمات والتزامه بأنظمة مؤسسته. لا نضمن درجة أكاديمية أو قبولًا أو نتيجة تقييم محددة.",
        "Students are responsible for permission to share files, accurate instructions and compliance with institutional rules. We do not guarantee grades, admission or assessment outcomes.",
      ],
    ],
  },
  integrity: {
    title: ["سياسة النزاهة الأكاديمية", "Academic integrity policy"],
    sections: [
      ["التزامنا", "Our commitment", integrity.ar, integrity.en],
      [
        "ما نقدمه",
        "What we provide",
        "شرح المفاهيم والخطوات، مراجعة المسودات، تغذية راجعة، تدقيق لغوي، تدريب برمجي وهندسي وإرشاد يساعدك على تحسين مهاراتك.",
        "Concept and process explanations, draft reviews, feedback, proofreading, coding and engineering guidance, and mentoring to improve your skills.",
      ],
      [
        "ما لا نقبله",
        "What we decline",
        "لا نقبل أداء اختبارات نيابة عن الطالب، أو الانتحال، أو اختلاق بيانات ومراجع، أو التحايل على التقييم، أو تسليم عمل لا يفهمه الطالب بوصفه إنتاجه المستقل.",
        "We decline exam impersonation, plagiarism, fabricated data or references, assessment circumvention, and submitting work a student does not understand as their independent output.",
      ],
      [
        "كيف تستفيد بمسؤولية",
        "How to use support responsibly",
        "شارك متطلبات مؤسستك، وراجع الملاحظات واسأل عن أي خطوة غير واضحة. طبّق ما تعلمته بنفسك وأفصح عن المساعدة عندما تقتضي أنظمة المؤسسة ذلك.",
        "Share institutional requirements, review feedback and ask about unclear steps. Apply what you learn yourself and disclose assistance whenever your institution requires it.",
      ],
    ],
  },
} as const;
export function Legal({ kind }: { kind: keyof typeof legal }) {
  const { t } = useLanguage();
  const page = legal[kind];
  return (
    <>
      <PageIntro
        title={t(page.title[0], page.title[1])}
        subtitle={t(
          "آخر تحديث: 11 سبتمبر 2026",
          "Last updated: 11 September 2026",
        )}
      />
      <article className="legal panel">
        {page.sections.map(([ar, en, a, b]) => (
          <section key={en}>
            <h2>{t(ar, en)}</h2>
            <p>{t(a, b)}</p>
          </section>
        ))}
      </article>
    </>
  );
}
export function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="empty-state">
      <strong className="error-code">404</strong>
      <h1>{t("هذه الصفحة غير موجودة", "This page could not be found")}</h1>
      <p>
        {t(
          "قد يكون الرابط تغيّر. لنعد إلى البداية.",
          "The link may have changed. Let’s go back to the start.",
        )}
      </p>
      <LocalizedLink className="button" to="/">
        {t("الصفحة الرئيسية", "Back to home")}
        <ArrowRight size={18} />
      </LocalizedLink>
    </div>
  );
}
