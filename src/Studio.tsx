import { Check } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { agencyServices as studio } from "./config/agency";
import { ProjectForm } from "./ProjectForm";
import { PageIntro, useLanguage } from "./ui";

const indexFromHash = () =>
  Math.max(
    0,
    studio.findIndex((x) => `#${x.id}` === window.location.hash),
  );

export function Studio() {
  const { t } = useLanguage();
  // /studio#<service-id> opens that service's tab (used by Home and
  // Portfolio links); picking a tab updates the hash without scrolling.
  const [active, setActive] = useState(indexFromHash);
  const [initialService] = useState(() => studio[indexFromHash()].id);
  useEffect(() => {
    const sync = () => {
      if (studio.some((x) => `#${x.id}` === window.location.hash))
        setActive(indexFromHash());
    };
    window.addEventListener("hashchange", sync);
    // "Start your project" links land on /studio#start; scroll there after
    // the shell's own route-change scroll-to-top has run.
    const timer =
      window.location.hash === "#start"
        ? window.setTimeout(() =>
            document.getElementById("start")?.scrollIntoView(),
          )
        : 0;
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", sync);
    };
  }, []);
  function select(i: number) {
    setActive(i);
    history.replaceState(history.state, "", `#${studio[i].id}`);
  }
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (ar: string, en: string) => t(ar, en);
  function onKey(e: KeyboardEvent) {
    const n = studio.length;
    const rtl = document.documentElement.dir === "rtl";
    const step =
      e.key === "ArrowRight"
        ? rtl
          ? -1
          : 1
        : e.key === "ArrowLeft"
          ? rtl
            ? 1
            : -1
          : 0;
    let next: number;
    if (step) next = (active + step + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }
  const s = studio[active];
  const Icon = s.icon;
  return (
    <>
      <PageIntro
        eyebrow={t("خدماتنا", "OUR SERVICES")}
        title={t(
          "من الفكرة إلى أثر رقمي ملموس.",
          "From idea to measurable digital impact.",
        )}
        subtitle={t(
          "سبع خدمات تحت سقف واحد: نصمّم ونبني ونطوّر — بانضباط هندسي وحسٍّ فني.",
          "Seven services under one roof: we design, build and grow — with engineering discipline and an artist’s eye.",
        )}
      />
      <div
        className="studio-tabs"
        role="tablist"
        aria-label={t("الخدمات", "Services")}
        onKeyDown={onKey}
      >
        {studio.map((x, i) => {
          const TabIcon = x.icon;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`studio-tab-${x.id}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`studio-panel-${x.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
            >
              <TabIcon size={18} aria-hidden="true" />
              {pick(...x.name)}
            </button>
          );
        })}
      </div>
      <section
        className="studio-panel"
        role="tabpanel"
        id={`studio-panel-${s.id}`}
        aria-labelledby={`studio-tab-${s.id}`}
        tabIndex={0}
      >
        <div className="studio-head">
          <span className="studio-icon">
            <Icon size={26} aria-hidden="true" />
          </span>
          <div>
            <h2>{pick(...s.name)}</h2>
            <p className="studio-tagline">{pick(...s.tagline)}</p>
          </div>
        </div>
        <p>{pick(...s.intro)}</p>
        <div className="studio-columns">
          <div>
            <h3>{t("ما نقدمه", "What you get")}</h3>
            <ul className="studio-list">
              {s.deliverables.map((d) => (
                <li key={d[1]}>
                  <Check size={16} aria-hidden="true" />
                  {pick(...d)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("كيف نعمل", "How we work")}</h3>
            <ol className="studio-steps">
              {s.process.map((p) => (
                <li key={p[1]}>{pick(...p)}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="studio-cta">
          <p>
            {t(
              "كل مشروع يُسعّر حسب نطاقه بعد جلسة تعريفية مجانية.",
              "Every project is quoted on its scope after a free discovery call.",
            )}
          </p>
          <a className="button" href="#start">
            {t("ابدأ مشروعك", "Start your project")}
          </a>
        </div>
      </section>
      <section className="section">
        <ProjectForm initial={initialService} />
      </section>
    </>
  );
}
