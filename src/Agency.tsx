import {
  Compass,
  Cpu,
  Gauge,
  HeartHandshake,
  Languages,
  LineChart,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import { projects } from "./config/projects";
import { agencyServices, serviceName } from "./config/agency";
import { CTA, Steps } from "./pages";
import { PageIntro, SectionHeading, useLanguage } from "./ui";

export function Portfolio() {
  const { t, lang } = useLanguage();
  const { hash } = useLocation();
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    if (!projects.some((project) => `#${project.id}` === hash)) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  const shown = projects.filter(
    (p) => filter === "all" || p.services.includes(filter),
  );
  return (
    <>
      <PageIntro
        eyebrow={t("أعمالنا", "Portfolio")}
        title={t("مشاريع حقيقية. نطاق واضح.", "Real projects. Clear scope.")}
        subtitle={t(
          "أعمال مختارة من مشاريعنا العامة على GitHub: مواقع، منتجات وأدوات تشغيل، مع حالة كل مشروع وروابطه.",
          "Selected work from our public GitHub projects: websites, products and operational tools, with each project’s status and source.",
        )}
      />
      <p className="notice">
        {t(
          "قائمة مختارة روجعت في 23 أكتوبر 2026. تضم مواقع منشورة وأدوات للاستضافة الذاتية ومشروعًا قيد التطوير، مع الوظائف المنفّذة والحدود الحالية لكل منها.",
          "Selection checked on 23 October 2026. It includes published websites, self-hosted tools and a project in development, with implemented scope and current limits stated for each.",
        )}
      </p>
      <div
        className="filter-row"
        aria-label={t("تصفية الأعمال", "Filter projects")}
      >
        {[
          ["all", t("الكل", "All")] as const,
          ...agencyServices
            .filter((service) =>
              projects.some((project) => project.services.includes(service.id)),
            )
            .map((s) => [s.id, serviceName(s.id, lang)] as const),
        ].map(([id, label]) => (
          <button
            key={id}
            className={filter === id ? "selected" : ""}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <h2 className="visually-hidden">{t("قائمة المشاريع", "Project list")}</h2>
      <p className="project-count" role="status">
        {t(
          `عرض ${shown.length} من ${projects.length} مشاريع`,
          `Showing ${shown.length} of ${projects.length} projects`,
        )}
      </p>
      <div className="project-grid portfolio-projects">
        {shown.map((p, index) => (
          <ProjectCard
            project={p}
            key={p.id}
            nextProject={
              shown.length > 1 ? shown[(index + 1) % shown.length] : undefined
            }
          />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="empty-state">
          {t(
            "لا توجد مشاريع لهذه الخدمة في القائمة الحالية. اختر الكل لعرض الأعمال.",
            "No projects match this service. Choose All to browse the work.",
          )}
        </p>
      )}
      <CTA />
    </>
  );
}

export function About() {
  const { t } = useLanguage();
  const strengths = [
    [
      Cpu,
      t("الأتمتة وأنظمة التحكم", "Automation and control"),
      t(
        "خبرة هندسية في أتمتة العمليات والأنظمة الصناعية.",
        "Engineering experience automating processes and industrial systems.",
      ),
    ],
    [
      Gauge,
      t("إدارة العمليات", "Operations management"),
      t(
        "فهم عملي لكيف تُدار الفرق والموارد والجداول.",
        "A practical grasp of how teams, resources and schedules are run.",
      ),
    ],
    [
      LineChart,
      t("التخطيط المالي", "Financial planning"),
      t(
        "قرارات مبنية على الأرقام والميزانيات والعائد.",
        "Decisions grounded in numbers, budgets and return.",
      ),
    ],
    [
      Palette,
      t("الحسّ الفني", "An artist’s eye"),
      t(
        "شغف بالفن والتفاصيل يجعل العمل جميلًا لا وظيفيًا فقط.",
        "A love of art and detail that makes work beautiful, not just functional.",
      ),
    ],
  ] as const;
  const values = [
    [
      Compass,
      t("الوضوح", "Clarity"),
      t(
        "نطاق وسعر وموعد مكتوبة قبل البدء.",
        "Scope, price and timeline in writing before we start.",
      ),
    ],
    [
      ShieldCheck,
      t("الأمانة", "Integrity"),
      t(
        "لا وعود مبالغ فيها، ولا أعمال ننسبها لغير أصحابها.",
        "No inflated promises, and no work we don’t own.",
      ),
    ],
    [
      Languages,
      t("بلغتين", "Bilingual"),
      t(
        "عربي وإنجليزي بالجودة نفسها.",
        "Arabic and English at the same quality.",
      ),
    ],
    [
      HeartHandshake,
      t("الشراكة", "Partnership"),
      t(
        "نتابع بعد التسليم حتى يحقق العمل هدفه.",
        "We follow up after delivery until the work does its job.",
      ),
    ],
  ] as const;
  return (
    <>
      <PageIntro
        eyebrow={t("من نحن", "About us")}
        title={t(
          "انضباط المهندس، وحسّ الفنان.",
          "An engineer’s discipline, an artist’s eye.",
        )}
        subtitle={t(
          "نيكسورا للحلول الرقمية تجمع خلفية هندسية وتشغيلية ومالية مع شغف بالتصميم، لتبني لك حلولًا واضحة وقابلة للقياس.",
          "NEXORA Digital Solutions pairs an engineering, operations and finance background with a passion for design, to build you clear, measurable solutions.",
        )}
      />
      <section className="about-story panel">
        <h2>{t("قصتنا", "Our story")}</h2>
        <p>
          {t(
            "بدأت نيكسورا من سؤال بسيط: لماذا تبدو كثير من الحلول الرقمية جميلة لكنها لا تخدم العمل، أو تخدم العمل لكنها لا تُستخدم؟ جوابنا أن نجمع العقلية الهندسية التي تقيس وتؤتمت وتخطط، مع الحسّ الفني الذي يجعل الناس يحبون ما يستخدمونه.",
            "NEXORA started from a simple question: why do so many digital solutions look good but don’t serve the business — or serve the business but go unused? Our answer is to combine an engineering mindset that measures, automates and plans with an artistic sense that makes people love what they use.",
          )}
        </p>
        <p>
          {t(
            "ولأن التعلّم أساس كل تقدّم، نقدّم أيضًا دعمًا أكاديميًا للطلاب والباحثين بالمعايير نفسها.",
            "And because learning underpins all progress, we also offer academic support to students and researchers, held to the same standards.",
          )}
        </p>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow={t("ما نحمله لك", "What we bring")}
          title={t(
            "خبرات تلتقي في كل مشروع",
            "Expertise that meets in every project",
          )}
        />
        <div className="feature-grid">
          {strengths.map(([Icon, title, text]) => (
            <article key={title}>
              <span className="icon-box">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow={t("قيمنا", "OUR VALUES")}
          title={t("ما نلتزم به", "What we stand by")}
        />
        <div className="feature-grid">
          {values.map(([Icon, title, text]) => (
            <article key={title}>
              <span className="icon-box">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
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
      <CTA />
    </>
  );
}
