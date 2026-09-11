import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  CircleHelp,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { integrity, services, site } from "./config/site";
import { PageIntro, SectionHeading, ServiceCard, useLanguage } from "./ui";
export function Steps() {
  const { t } = useLanguage();
  return (
    <div className="steps-grid">
      {[
        [
          t("أخبرنا بما تحتاج", "Tell us what you need"),
          t(
            "اختر الخدمة وأرسل التعليمات ورابط الملفات.",
            "Choose a service and share your instructions and file link.",
          ),
        ],
        [
          t("نراجع ونوضح السعر", "Review & agree on a price"),
          t(
            "نراجع النطاق والموعد ونثبت السعر قبل البدء.",
            "We review the scope and deadline, then confirm the price before starting.",
          ),
        ],
        [
          t("تعلّم وارتقِ بعملك", "Learn & improve your work"),
          t(
            "تحصل على شرح وملاحظات، وجولة تعديل ضمن النطاق.",
            "Receive guidance, actionable feedback and one in-scope revision.",
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
        <span className="eyebrow">
          {t("خطوة صغيرة. فرق كبير.", "SMALL STEPS. BIG POSSIBILITIES.")}
        </span>
        <h2>
          {t(
            "جاهز لخطوتك الأكاديمية القادمة؟",
            "Ready for your next academic step?",
          )}
        </h2>
        <p>
          {t(
            "شاركنا ما تحتاج، ولنبدأ من حيث أنت.",
            "Tell us what you need. Let’s start where you are.",
          )}
        </p>
      </div>
      <Link className="button white" to="/contact">
        {t("أرسل طلبك الآن", "Send your request")}
        <ArrowLeft size={18} />
      </Link>
    </section>
  );
}
export function Home() {
  const { t } = useLanguage();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span />
            {t("معك في كل خطوة أكاديمية", "WITH YOU AT EVERY ACADEMIC STEP")}
          </span>
          <h1>
            {t("دعم أكاديمي أوضح،", "Clearer academic support.")}
            <br />
            <span>{t("أسرع، وأكثر احترافية", "A brighter way forward.")}</span>
          </h1>
          <p>
            {t(
              "شرح ومراجعة وتطوير للأعمال الأكاديمية بما يساعدك على التعلم وتحسين جودة مخرجاتك.",
              "Explanation, review and development of academic work to help you learn and improve the quality of your outcomes.",
            )}
          </p>
          <div className="hero-actions">
            <Link className="button" to="/contact">
              {t("اطلب الخدمة", "Request a service")}
              <ArrowLeft size={18} />
            </Link>
            <Link className="button secondary" to="/services">
              {t("استعرض الأسعار", "Explore pricing")}
            </Link>
          </div>
          <div className="hero-notes">
            <span>
              <Check size={16} />
              {t("أسعار واضحة", "Transparent pricing")}
            </span>
            <span>
              <Check size={16} />
              {t("خصوصية وأمان", "Privacy first")}
            </span>
            <span>
              <Check size={16} />
              {t("دعم يساعدك تتعلّم", "Support that helps you learn")}
            </span>
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label={t(
            "رحلتك من الفهم إلى التطور",
            "Your journey from understanding to progress",
          )}
        >
          <div className="visual-grid" />
          <span className="visual-caption">LEARN. CONNECT. PROGRESS.</span>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="growth-block block-one">
            <span>01</span>
          </div>
          <div className="growth-block block-two">
            <span>02</span>
          </div>
          <div className="growth-block block-three">
            <span>03</span>
          </div>
          <div className="growth-block block-four">
            <Sparkles size={30} />
          </div>
          <div className="float-card float-top">
            <span className="icon-box">
              <Target size={21} />
            </span>
            <div>
              <strong>{t("فهم أعمق", "Deeper understanding")}</strong>
              <small>
                {t("خطوة أقرب لهدفك", "One step closer to your goal")}
              </small>
            </div>
          </div>
          <div className="float-card float-bottom">
            <span className="icon-box teal">
              <CheckCheck size={22} />
            </span>
            <div>
              <strong>{t("تقدّم بثقة", "Progress with confidence")}</strong>
              <small>
                {t(
                  "معرفة اليوم. فرص الغد.",
                  "Knowledge today. Possibilities tomorrow.",
                )}
              </small>
            </div>
          </div>
          <span className="visual-bottom">N / A — YOUR NEXT CHAPTER</span>
        </div>
      </section>
      <div className="trust-strip">
        {[
          [
            ShieldCheck,
            t("نزاهة أكاديمية", "Academic integrity"),
            t("تعلّم بمسؤولية", "Learn responsibly"),
          ],
          [
            Clock3,
            t("مرونة في المواعيد", "Flexible deadlines"),
            t("بما يناسب احتياجك", "Built around your needs"),
          ],
          [
            MessageCircle,
            t("تواصل مباشر", "Direct communication"),
            t("كل التفاصيل أوضح", "Clarity at every step"),
          ],
          [
            Zap,
            t("دعم متعدد التخصصات", "Across disciplines"),
            t("من الشرح إلى CAD", "From guidance to CAD"),
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
      <section className="section">
        <div className="section-row">
          <SectionHeading
            eyebrow={t("مساحة أكبر لإمكاناتك", "MORE ROOM FOR YOUR POTENTIAL")}
            title={t("دعم يناسب رحلتك", "Support for your journey")}
            text={t(
              "من أول سؤال إلى آخر مراجعة، نساعدك تفهم وتطوّر.",
              "From your first question to your final review, build understanding and better work.",
            )}
          />
          <Link className="text-link" to="/services">
            {t("جميع الخدمات والأسعار", "All services & pricing")}
            <ArrowLeft size={17} />
          </Link>
        </div>
        <div className="services-grid">
          {[
            services[0],
            services[2],
            services[4],
            services[1],
            services[7],
            services[8],
          ].map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>
      <section className="section tinted">
        <SectionHeading
          eyebrow={t(
            "ببساطة، من البداية للنهاية",
            "SIMPLE FROM START TO FINISH",
          )}
          title={t("ثلاث خطوات، ورؤية أوضح", "Three steps. A clearer path.")}
        />
        <Steps />
      </section>
      <section className="section why">
        <div>
          <span className="eyebrow">{t("لماذا نيكسورا؟", "WHY NEXORA?")}</span>
          <h2>
            {t("لأن الفهم هو", "Because understanding is")}
            <br />
            <span className="gradient-text">
              {t("بداية كل تقدّم.", "where progress begins.")}
            </span>
          </h2>
          <p>
            {t(
              "دعم يضع تعلّمك أولًا، ويمنح عملك العناية التي يستحقها.",
              "Support that puts your learning first and gives your work the attention it deserves.",
            )}
          </p>
          <Link className="text-link" to="/integrity">
            {t("تعرّف على التزامنا الأكاديمي", "Our academic commitment")}
            <ArrowLeft size={17} />
          </Link>
        </div>
        <div className="benefits">
          {[
            [
              t("ملاحظات يمكنك العمل بها", "Feedback you can act on"),
              t(
                "شرح واضح يساعدك تفهم أسباب التعديل وتطبّقه بنفسك.",
                "Clear explanations help you understand each improvement and apply it yourself.",
              ),
            ],
            [
              t("اتفاق واضح قبل البدء", "Clarity before we start"),
              t(
                "نطاق وسعر وموعد متفق عليها، بلا مفاجآت.",
                "An agreed scope, price and deadline, without surprises.",
              ),
            ],
            [
              t("عناية بالتفاصيل وبخصوصيتك", "Care for your work and privacy"),
              t(
                "مراجعة منظمة، ومشاركة ملفاتك بالقدر اللازم للخدمة.",
                "Structured review and access to files limited to what the service needs.",
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
          title={t("تجربة نتطلع إلى تقديمها", "The experience we aim to offer")}
          text={t(
            "نماذج توضيحية مؤقتة — ليست شهادات عملاء حقيقيين.",
            "Temporary illustrative examples — not real customer testimonials.",
          )}
        />
        <div className="testimonial-grid">
          {[
            [
              t(
                "«الملاحظات خطوة بخطوة جعلت نقاط التحسين أوضح بالنسبة لي.»",
                "“Step-by-step feedback made it easier to see how to improve.”",
              ),
              t(
                "نموذج تجربة · مراجعة تقرير",
                "Example experience · report review",
              ),
            ],
            [
              t(
                "«فهمت سبب الخطأ البرمجي، وصرت أقدر أصححه بنفسي.»",
                "“I understood the cause of the bug and how to fix it myself.”",
              ),
              t(
                "نموذج تجربة · دعم برمجي",
                "Example experience · coding guidance",
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
        title={t(
          "خدمات مرنة. أسعار واضحة.",
          "Flexible support. Transparent pricing.",
        )}
        subtitle={t(
          "اختر الدعم الذي تحتاجه، واترك مساحة للتقدّم.",
          "Choose the support you need and make room for progress.",
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
        <Link to="/calculator" className="button">
          {t("احسب السعر التقديري", "Estimate your price")}
        </Link>
      </section>
    </>
  );
}
export function How() {
  const { t, lang } = useLanguage();
  return (
    <>
      <PageIntro
        title={t(
          "من احتياجك إلى خطوتك القادمة",
          "From your needs to your next step",
        )}
        subtitle={t(
          "رحلة بسيطة، وتواصل واضح في كل مرحلة.",
          "A simple process with clear communication at every stage.",
        )}
      />
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
    "نقدم الشرح والمراجعة والتدقيق وتطوير التقارير والعروض، ودعم البرمجة وCAD والإرشاد في مشاريع التخرج.",
    "Explanation, review, proofreading, report and presentation improvement, programming and CAD support, and graduation project mentoring.",
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
    "أضف رابطًا آمنًا من خدمة الملفات التي تستخدمها مع صلاحية الوصول المناسبة. تجنب مشاركة كلمات المرور أو البيانات غير اللازمة للخدمة.",
    "Add a secure link from your file provider with appropriate access permissions. Avoid sharing passwords or information that is not needed.",
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
        "نجمع الاسم والجوال وبيانات الخدمة ووصف الطلب. البريد الإلكتروني ورابط الملفات اختياريان. لا نطلب معلومات البطاقات أو كلمات مرورك.",
        "We collect your name, mobile number, service details and request description. Email and file links are optional. We do not request card details or passwords.",
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
        "عند تفعيل الحفظ الإلكتروني، تحفظ الطلبات في Supabase بصلاحيات مقيدة. عند اختيار واتساب أو البريد تنتقل البيانات إلى مزود تلك الخدمة وفق سياسته. قد تعالج البيانات خارج المملكة بحسب موقع الاستضافة.",
        "When online storage is enabled, requests are stored in Supabase with restricted access. Choosing WhatsApp or email passes data to that provider under its policies. Data may be processed outside Saudi Arabia depending on hosting location.",
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
      <Link className="button" to="/">
        {t("الصفحة الرئيسية", "Back to home")}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
