/** `project` supplies an actual landing-page capture or a factual type cover.
 * A failed capture falls back to its project overview, never a broken image.
 */
import { useState } from "react";
import type { Project } from "./config/projects";
import { useLanguage } from "./ui";

export function ProjectCover({ project }: { project: Project }) {
  const { t } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <figure className="project-figure">
      {project.screen && !imageFailed ? (
        <img
          className="project-screen"
          src={`${import.meta.env.BASE_URL}projects/${project.screen.file}`}
          alt={t(...project.screen.alt)}
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="project-cover">
          <span className="proof-caption">
            {t("نظرة على المشروع", "Project overview")}
          </span>
          <strong>
            <bdi>{t(...project.title)}</bdi>
          </strong>
          <div className="proof-baseline">
            <span>{t(...project.type)}</span>
            <span>
              <bdi>{project.year}</bdi>
            </span>
          </div>
        </div>
      )}
      <figcaption>{t(...project.functions)}</figcaption>
    </figure>
  );
}
