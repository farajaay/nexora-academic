/** `compact` is the homepage preview; full records include verified project
 * facts, delivery limits and `nextProject` from the current filtered selection.
 */
import { ProjectCover } from "./ProjectCover";
import { serviceName } from "./config/agency";
import type { Project } from "./config/projects";
import { LocalizedLink, useLanguage } from "./ui";

export function ProjectCard({
  project,
  compact = false,
  nextProject,
}: {
  project: Project;
  compact?: boolean;
  nextProject?: Project;
}) {
  const { t, lang } = useLanguage();
  const Heading = compact ? "h3" : "h2";
  const title = t(...project.title);
  const date = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    calendar: "gregory",
  }).format(new Date(`${project.updated}T12:00:00Z`));

  return (
    <article
      className={compact ? "project-card" : "project-card project-record"}
      id={project.id}
      aria-labelledby={`${project.id}-title`}
    >
      {compact && <ProjectCover project={project} />}
      <div className="project-body">
        <span className="project-sector">{t(...project.status)}</span>
        <Heading id={`${project.id}-title`}>
          <bdi>{title}</bdi>
        </Heading>
        {compact ? (
          <p>{t(...project.scope)}</p>
        ) : (
          <>
            <dl className="project-facts">
              {[
                [t("النوع", "Type"), t(...project.type)],
                [t("السنة", "Year"), project.year],
                [t("النطاق", "Scope"), t(...project.scope)],
                [t("التحدي", "Challenge"), t(...project.challenge)],
                [t("الإحساس المقصود", "Design intent"), t(...project.emotion)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="project-subheading">
              {t("التنفيذ", "Implementation")}
            </h3>
            <p>{t(...project.work)}</p>
          </>
        )}
        {compact && (
          <LocalizedLink className="text-link" to={`/portfolio#${project.id}`}>
            {t("تفاصيل المشروع", "Project details")}
          </LocalizedLink>
        )}
      </div>
      <div className="project-evidence">
        {!compact && (
          <>
            <ProjectCover project={project} />
            <p>
              <strong>{t("النتيجة الحالية:", "Current outcome:")}</strong>{" "}
              {t(...project.outcome)}
            </p>
          </>
        )}
        <p className="project-stack">
          <strong>{t("التقنيات:", "Stack:")}</strong>{" "}
          <bdi dir="ltr">{project.stack.join(", ")}</bdi>
        </p>
        <ul
          className="project-tags"
          aria-label={t("الخدمات المرتبطة", "Related services")}
        >
          {project.services.map((id) => (
            <li key={id}>
              <LocalizedLink to={`/studio#${id}`}>
                {serviceName(id, lang)}
              </LocalizedLink>
            </li>
          ))}
        </ul>
        <div className="project-links">
          {project.website && (
            <a
              className="text-link"
              href={project.website.url}
              aria-label={`${t(...project.website.label)}: ${title}`}
            >
              {t(...project.website.label)}
            </a>
          )}
          <a
            className="text-link"
            href={project.repository}
            aria-label={`${t("المشروع على GitHub", "Project on GitHub")}: ${title}`}
          >
            {t("المشروع على GitHub", "Project on GitHub")}
          </a>
        </div>
        <p className="project-updated">
          {t("آخر تحديث للشيفرة:", "Last code update:")}{" "}
          <time dateTime={project.updated}>{date}</time>
        </p>
        {nextProject && (
          <a className="text-link next-project" href={`#${nextProject.id}`}>
            {t("المشروع التالي:", "Next project:")}{" "}
            <bdi>{t(...nextProject.title)}</bdi>
          </a>
        )}
      </div>
    </article>
  );
}
