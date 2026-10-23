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
import { useState } from "react";
import { ProjectCover } from "./ProjectCover";
import { agencyServices, conceptProjects, serviceName } from "./config/agency";
import { CTA, Steps } from "./pages";
import { LocalizedLink, PageIntro, SectionHeading, useLanguage } from "./ui";

export function ProjectCard({
  project,
}: {
  project: (typeof conceptProjects)[number];
}) {
  const { t, lang } = useLanguage();
  return (
    <article className="project-card">
      <ProjectCover kind={project.services[0]} />
      <div className="project-body">
        <span className="project-sector">
          {t("مفهوم مقترح", "Concept proposal")} / {t(...project.sector)}
        </span>
        <h3>{t(...project.title)}</h3>
        <p>
          <strong>{t("التحدي:", "Challenge:")}</strong>{" "}
          {t(...project.challenge)}
        </p>
        <p>
          <strong>{t("نهجنا:", "Our approach:")}</strong>{" "}
          {t(...project.approach)}
        </p>
        <ul className="project-tags">
          {project.services.map((id) => (
            <li key={id}>
              <LocalizedLink to={`/studio#${id}`}>
                {serviceName(id, lang)}
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Portfolio() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const shown = conceptProjects.filter(
    (p) => filter === "all" || p.services.includes(filter),
  );
  return (
    <>
      <PageIntro
        eyebrow={t("أعمالنا", "Portfolio")}
        title={t("أفكار تتحوّل إلى أثر.", "Ideas turned into impact.")}
        subtitle={t(
          "مشاريع مفاهيمية توضّح طريقتنا في التفكير والتنفيذ عبر خدماتنا.",
          "Concept projects that show how we think and deliver across our services.",
        )}
      />
      <p className="notice concept-note">
        {t(
          "هذه مشاريع مفاهيمية لتوضيح أسلوبنا، وليست أعمالًا لعملاء حقيقيين. ستُستبدل بدراسات حالة فعلية عند نشرها.",
          "These are concept projects that illustrate our approach — not real client work. They will be replaced by actual case studies as they are published.",
        )}
      </p>
      <div
        className="filter-row"
        aria-label={t("تصفية الأعمال", "Filter projects")}
      >
        {[
          ["all", t("الكل", "All")] as const,
          ...agencyServices.map(
            (s) => [s.id, serviceName(s.id, lang)] as const,
          ),
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
      <div className="project-grid">
        {shown.map((p) => (
          <ProjectCard project={p} key={p.id} />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="empty-state">
          {t(
            "لا توجد مشاريع مفاهيمية لهذه الخدمة بعد.",
            "No concept projects for this service yet.",
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
