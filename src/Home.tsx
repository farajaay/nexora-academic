/** Homepage. No props; language comes from the shared route context. */
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { agencyServices, conceptProjects } from "./config/agency";
import { ProjectCard } from "./Agency";
import { CTA, Steps } from "./pages";
import { LocalizedLink, useLanguage } from "./ui";

export function Home() {
  const { t } = useLanguage();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-context">
          <span>{t("تصميم وهندسة رقمية", "Design meets engineering")}</span>
          <span>
            {t(
              "من السعودية، بالعربية والإنجليزية",
              "Saudi Arabia. Arabic and English.",
            )}
          </span>
        </div>
        <h1 id="hero-title">
          {t("رؤيتك.", "Your vision.")}
          <br />
          {t("خبرتنا الرقمية.", "Our digital expertise.")}
        </h1>
        <div className="hero-bottom">
          <a className="hero-index-link" href="#services-index">
            <ArrowDown aria-hidden="true" />
            {t("اكتشف ما نبنيه", "Explore what we build")}
          </a>
          <div className="hero-description">
            <p>
              {t(
                "نبني المواقع والهويات والأنظمة التي تخدم عملك. نبدأ بفهم التفاصيل، ونتفق على النطاق قبل أن نرسم أو نكتب سطرًا واحدًا.",
                "Websites, identities and systems built around your work. We start with the details and agree on the scope before drawing a line or writing any code.",
              )}
            </p>
            <LocalizedLink className="button" to="/studio#start">
              {t("ابدأ مشروعك", "Start your project")}
              <ArrowUpRight className="directional" aria-hidden="true" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      <section
        className="section service-index"
        id="services-index"
        aria-labelledby="services-title"
      >
        <div className="section-aside">
          <h2 id="services-title">
            {t("من الفكرة، إلى ما يفيد.", "From an idea to something useful.")}
          </h2>
          <p>
            {t(
              "سبع خدمات. نطاق يُكتب حول احتياجك، لا حول باقة جاهزة.",
              "Seven services. A scope written for your needs, rather than a preset package.",
            )}
          </p>
          <LocalizedLink className="text-link" to="/studio">
            {t("تفاصيل الخدمات", "Service details")}
          </LocalizedLink>
        </div>
        <div className="service-index-rows">
          {agencyServices.map((service) => (
            <LocalizedLink
              key={service.id}
              className="service-index-row"
              to={`/studio#${service.id}`}
            >
              <h3>{t(...service.name)}</h3>
              <span>{t(...service.deliverables[0])}</span>
              <span className="row-open">{t("عرض", "View")}</span>
            </LocalizedLink>
          ))}
        </div>
      </section>

      <section
        className="section concept-section"
        aria-labelledby="concepts-title"
      >
        <div className="section-row">
          <div>
            <h2 id="concepts-title">
              {t("كيف نفكّر في العمل", "A look at our thinking")}
            </h2>
            <p className="section-caption">
              {t(
                "دراسات مفاهيمية، وليست مشاريع لعملاء. لا توجد نتائج تجارية منشورة بعد.",
                "Concept studies, not client projects. No commercial results have been published yet.",
              )}
            </p>
          </div>
          <LocalizedLink className="text-link" to="/portfolio">
            {t("تصفّح المفاهيم", "Browse the concepts")}
          </LocalizedLink>
        </div>
        <div className="project-grid home-projects">
          {[conceptProjects[0], conceptProjects[2]].map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section
        className="section process-section"
        aria-labelledby="process-title"
      >
        <div className="section-row">
          <h2 id="process-title">
            {t("نتفق أولًا. ثم نبني.", "Agree first. Then build.")}
          </h2>
          <p className="section-caption">
            {t(
              "النطاق والسعر والموعد، مكتوبة قبل البدء.",
              "Scope, price and timing, in writing before we start.",
            )}
          </p>
        </div>
        <Steps />
      </section>

      <section className="section expectations" aria-labelledby="limits-title">
        <h2 id="limits-title">
          {t("ما الذي لا نقدّمه؟", "What you’re not getting")}
        </h2>
        <div>
          <p>
            {t(
              "لا سعر ثابت لمشروع لم نراجع تفاصيله، ولا وعد بنتيجة تجارية مضمونة. نحدّد المخرجات والمواعيد والدعم في عرض مكتوب.",
              "No fixed project price before we review the brief, and no guaranteed commercial outcome. Deliverables, timelines and support are defined in a written proposal.",
            )}
          </p>
          <p>
            {t(
              "المفاهيم المعروضة ليست أعمال عملاء. نموذج المشروع يفتح واتساب برسالة جاهزة؛ عليك إكمال إرسالها هناك.",
              "The concepts shown are not client work. The project form prepares a WhatsApp message; you complete sending it there.",
            )}
          </p>
        </div>
      </section>

      <section
        className="section academic-band"
        aria-labelledby="academic-title"
      >
        <div>
          <p className="page-context">
            {t("نيكسورا أكاديمي", "Nexora Academic")}
          </p>
          <h2 id="academic-title">
            {t("مساحة للفهم، والمراجعة.", "Room to learn and revise.")}
          </h2>
          <p>
            {t(
              "شرح وتدقيق وإرشاد للطلاب والباحثين. أسعار معلنة تبدأ من 40 ر.س، مع بقاء مسؤولية العمل وفهمه للطالب.",
              "Explanation, proofreading and mentoring for students and researchers. Published prices from SAR 40, with students responsible for their work and understanding.",
            )}
          </p>
        </div>
        <div className="academic-links">
          <LocalizedLink className="button secondary" to="/services">
            {t("الخدمات الأكاديمية", "Academic services")}
          </LocalizedLink>
          <LocalizedLink className="text-link" to="/calculator">
            {t("احسب السعر التقديري", "Estimate your price")}
          </LocalizedLink>
        </div>
      </section>
      <CTA />
    </>
  );
}
