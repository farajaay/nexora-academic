import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ArrowUp, Globe2, Menu, MessageCircle, X } from "lucide-react";
import { contactReady, site, type Lang } from "./config/site";
import { allRoutes, publicRoutes, urlFor } from "./config/routes";
import { isEnglishPath, localize } from "./lib/i18n";
import { initializeThemes } from "./lib/theme";
import { ThemePicker } from "./ThemePicker";
import { LanguageContext, LocalizedLink, LocalizedNavLink } from "./ui";
import { Logo } from "./Logo";
import { FAQ, How, Legal, NotFound, Services } from "./pages";
import { Calculator, Contact, Success } from "./forms";
import { Studio } from "./Studio";
import { About, Portfolio } from "./Agency";
import { Home } from "./Home";
import "./index.css";
const Admin = lazy(() => import("./Admin"));
const nav = [
  ["/", "الرئيسية", "Home"],
  ["/studio", "الخدمات", "Services"],
  ["/portfolio", "أعمالنا", "Portfolio"],
  ["/about", "من نحن", "About"],
  ["/services", "الأكاديمي", "Academic"],
  ["/contact", "تواصل", "Contact"],
] as const;
// One shared source of truth for route metadata (src/config/routes.ts) drives
// both this router and scripts/seo.mjs's static document generation, so the
// two can no longer describe the same route two different ways.
const metaByPath = new Map(
  allRoutes.map((r) => [r.path === "" ? "/" : `/${r.path}`, r] as const),
);
const publicPaths = new Set(
  publicRoutes.map((r) => (r.path === "" ? "/" : `/${r.path}`)),
);
const elementByPath: Record<string, ReactNode> = {
  "": <Home />,
  services: <Services />,
  studio: <Studio />,
  portfolio: <Portfolio />,
  about: <About />,
  "how-it-works": <How />,
  calculator: <Calculator />,
  contact: <Contact />,
  faq: <FAQ />,
  privacy: <Legal kind="privacy" />,
  terms: <Legal kind="terms" />,
  integrity: <Legal kind="integrity" />,
  success: <Success />,
  admin: <Admin />,
};
// A leading optional `:lang` param — rather than two separately-mirrored
// route trees — matches both "/services" and "/en/services" as the SAME
// route: React Router then keeps the matched page component mounted across
// a language toggle (it only remounts when the matched route itself
// changes), so in-progress form state survives switching language mid-form.
// LangGuard rejects any value other than "en" so an arbitrary first segment
// doesn't masquerade as a language and shadow a real 404.
function LangGuard({ children }: { children: ReactNode }) {
  const { lang } = useParams<{ lang?: string }>();
  if (lang !== undefined && lang !== "en") return <NotFound />;
  return children;
}
function routeElements() {
  return allRoutes.map((r) => (
    <Route
      key={r.path || "index"}
      path={r.path ? `:lang?/${r.path}` : ":lang?"}
      element={<LangGuard>{elementByPath[r.path]}</LangGuard>}
    />
  ));
}
function Shell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lang: Lang = isEnglishPath(pathname) ? "en" : "ar";
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    try {
      localStorage.setItem("nexora-language", lang);
    } catch {
      /* Remembering the last language is a nicety, not a requirement. */
    }
  }, [lang]);
  // The static document already carries the default theme (no flash for the
  // common case); this only ever changes anything when an admin picked a
  // different one, in which case it upgrades once, here, on mount.
  useEffect(initializeThemes, []);
  function toggle() {
    setMenu(false);
    const target: Lang = lang === "ar" ? "en" : "ar";
    navigate(localize(pathname, target) + window.location.search);
  }
  useEffect(() => {
    const bare = isEnglishPath(pathname)
      ? pathname === "/en"
        ? "/"
        : pathname.slice(3)
      : pathname;
    const path = bare.replace(/\/$/, "") || "/";
    const route = metaByPath.get(path);
    const m = route
      ? [
          route.title.ar,
          route.title.en,
          route.description.ar,
          route.description.en,
        ]
      : [
          "صفحة غير موجودة",
          "Page not found",
          "الرابط المطلوب غير موجود.",
          "The requested page does not exist.",
        ];
    document.title = `${m[lang === "ar" ? 0 : 1]} | ${site.name[lang]}`;
    const set = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);
    set('meta[name="description"]', m[lang === "ar" ? 2 : 3]);
    set('meta[property="og:title"]', document.title);
    set('meta[property="og:description"]', m[lang === "ar" ? 2 : 3]);
    set('meta[property="og:locale"]', lang === "ar" ? "ar_SA" : "en_US");
    set(
      'meta[property="og:locale:alternate"]',
      lang === "ar" ? "en_US" : "ar_SA",
    );
    const url = urlFor(path === "/" ? "" : path.slice(1), lang);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    set('meta[property="og:url"]', url);
    set(
      'meta[name="robots"]',
      route && publicPaths.has(path) ? "index, follow" : "noindex, nofollow",
    );
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [pathname, lang]);
  // Move focus to <main> and reset scroll on client-side route changes only —
  // never on the initial page load (that would steal focus from the normal
  // tab order, before the user has interacted at all) and never on a language
  // toggle alone (that would throw focus away from the toggle button).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      <a className="skip-link" href="#main">
        {t("انتقل للمحتوى", "Skip to content")}
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <Logo />
          <nav
            className="desktop-nav"
            aria-label={t("التنقل الرئيسي", "Main navigation")}
          >
            {nav.map(([to, ar, en]) => (
              <LocalizedNavLink key={to} to={to} end={to === "/"}>
                {t(ar, en)}
              </LocalizedNavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <ThemePicker />
            <button
              className="language-button"
              onClick={toggle}
              aria-label={t("Switch to English", "التبديل إلى العربية")}
            >
              <Globe2 />
              <span>{t("EN", "عربي")}</span>
            </button>
            <LocalizedLink className="button nav-cta" to="/studio#start">
              {t("ابدأ مشروعك", "Start a project")}
            </LocalizedLink>
            <button
              className="menu-button"
              ref={menuButton}
              aria-label={t("القائمة", "Menu")}
              aria-expanded={menu}
              aria-controls="mobile-nav"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label={t("قائمة الهاتف", "Mobile navigation")}
          >
            {nav.map(([to, ar, en]) => (
              <LocalizedNavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenu(false)}
              >
                {t(ar, en)}
              </LocalizedNavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1} className="container">
        <Suspense
          fallback={
            <p className="loading-state" role="status">
              {t("جارٍ التحميل…", "Loading…")}
            </p>
          }
        >
          <Routes>
            {routeElements()}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <h2 className="visually-hidden">{t("روابط الموقع", "Site links")}</h2>
        <div className="container footer-grid">
          <div>
            <Logo variant="full" />
            <p>
              {t(
                "نبني الهويات والمواقع والأنظمة التي تخدم عملك.",
                "We build identities, websites and systems around your work.",
              )}
            </p>
            <span className="footer-tag">
              {t(
                "من السعودية، بلغتين، وبمعيار واحد.",
                "From Saudi Arabia. Bilingual. One standard.",
              )}
            </span>
          </div>
          <div>
            <h3>{t("اكتشف نيكسورا", "Explore Nexora")}</h3>
            <LocalizedLink to="/studio">
              {t("خدماتنا", "Our services")}
            </LocalizedLink>
            <LocalizedLink to="/portfolio">
              {t("أعمالنا", "Portfolio")}
            </LocalizedLink>
            <LocalizedLink to="/about">{t("من نحن", "About us")}</LocalizedLink>
            <LocalizedLink to="/services">
              {t("الخدمات الأكاديمية", "Academic services")}
            </LocalizedLink>
            <LocalizedLink to="/calculator">
              {t("حاسبة السعر", "Price calculator")}
            </LocalizedLink>
            <LocalizedLink to="/how-it-works">
              {t("كيف نعمل", "How we work")}
            </LocalizedLink>
          </div>
          <div>
            <h3>{t("نحن هنا للمساعدة", "Here to help")}</h3>
            <LocalizedLink to="/contact">
              {t("تواصل معنا", "Contact us")}
            </LocalizedLink>
            <LocalizedLink to="/faq">
              {t("الأسئلة الشائعة", "FAQ")}
            </LocalizedLink>
            <LocalizedLink to="/integrity">
              {t("النزاهة الأكاديمية", "Academic integrity")}
            </LocalizedLink>
            {Object.entries(site.social)
              .filter(([, url]) => url)
              .map(([name, url]) => (
                <a
                  href={url}
                  key={name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {name}
                </a>
              ))}
          </div>
          <div>
            <h3>{t("الثقة والشفافية", "Trust & transparency")}</h3>
            <LocalizedLink to="/privacy">
              {t("سياسة الخصوصية", "Privacy policy")}
            </LocalizedLink>
            <LocalizedLink to="/terms">
              {t("الشروط والأحكام", "Terms & conditions")}
            </LocalizedLink>
            <LocalizedLink to="/admin">
              {t("دخول الإدارة", "Admin sign in")}
            </LocalizedLink>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} NEXORA Digital Solutions.{" "}
            {t("جميع الحقوق محفوظة.", "All rights reserved.")}
          </span>
          <span>Design, development and industrial thinking</span>
        </div>
      </footer>
      <button
        className="back-top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          })
        }
        aria-label={t("العودة إلى الأعلى", "Back to top")}
      >
        <ArrowUp />
      </button>
      <aside
        className="mobile-contact"
        aria-label={t("تواصل سريع", "Quick contact")}
      >
        {contactReady.whatsapp ? (
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
            {t("تواصل معنا عبر واتساب", "Chat on WhatsApp")}
          </a>
        ) : (
          <LocalizedLink to="/contact">
            <MessageCircle />
            {t("جهّز طلبك وتواصل معنا", "Prepare your support request")}
          </LocalizedLink>
        )}
      </aside>
    </LanguageContext.Provider>
  );
}
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  );
}
