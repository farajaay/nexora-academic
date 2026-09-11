import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ArrowUp, Globe2, Menu, MessageCircle, X } from "lucide-react";
import { contactReady, site, type Lang } from "./config/site";
import { LanguageContext, Logo, useLanguage } from "./ui";
import { FAQ, Home, How, Legal, NotFound, Services } from "./pages";
import { Calculator, Contact, Success } from "./forms";
import "./index.css";
const Admin = lazy(() => import("./Admin"));
const nav = [
  ["/", "الرئيسية", "Home"],
  ["/services", "الخدمات والأسعار", "Services & pricing"],
  ["/how-it-works", "آلية الطلب", "How it works"],
  ["/calculator", "حاسبة السعر", "Price calculator"],
  ["/faq", "الأسئلة الشائعة", "FAQ"],
] as const;
const meta: Record<string, [string, string, string, string]> = {
  "/": [
    "دعم أكاديمي أوضح، أسرع، وأكثر احترافية",
    "Clearer academic support",
    "شرح ومراجعة وتطوير للأعمال الأكاديمية للثانوية والجامعة والدراسات العليا.",
    "Explanation, review and academic development for school, university and postgraduate students.",
  ],
  "/services": [
    "الخدمات والأسعار",
    "Services & pricing",
    "أسعار تبدأ من 40 ر.س للشرح والمراجعة والتدقيق والبرمجة وCAD.",
    "Academic support pricing from SAR 40: explanation, review, proofreading, coding and CAD.",
  ],
  "/how-it-works": [
    "آلية الطلب",
    "How it works",
    "تعرف على خطوات إرسال الطلب ومراجعة النطاق وتأكيد السعر.",
    "Learn how to submit a request, review scope and confirm the price.",
  ],
  "/calculator": [
    "حاسبة السعر",
    "Price calculator",
    "احسب النطاق السعري التقديري حسب الخدمة والموعد وحجم العمل.",
    "Estimate your price based on service, deadline and work quantity.",
  ],
  "/contact": [
    "تواصل معنا واطلب الخدمة",
    "Contact & request a service",
    "أرسل تفاصيل طلب الدعم الأكاديمي بأمان أو جهّز رسالة واتساب وبريد.",
    "Submit your academic support request or prepare a WhatsApp or email message.",
  ],
  "/faq": [
    "الأسئلة الشائعة",
    "Frequently asked questions",
    "إجابات حول الأسعار والتعديلات والمواعيد والنزاهة الأكاديمية.",
    "Answers about pricing, revisions, delivery and academic integrity.",
  ],
  "/privacy": [
    "سياسة الخصوصية",
    "Privacy policy",
    "كيف نتعامل مع بياناتك وطلباتك وتفضيلاتك.",
    "How we handle your information, requests and preferences.",
  ],
  "/terms": [
    "الشروط والأحكام",
    "Terms & conditions",
    "شروط الخدمة والسعر والتعديلات ومسؤولية الطالب.",
    "Service terms, pricing, revisions and student responsibilities.",
  ],
  "/integrity": [
    "سياسة النزاهة الأكاديمية",
    "Academic integrity policy",
    "التزامنا بالشرح والمراجعة والإرشاد والتعلم المسؤول.",
    "Our commitment to explanation, review, mentoring and responsible learning.",
  ],
  "/success": [
    "حالة الطلب",
    "Request status",
    "تابع حالة إرسال طلبك.",
    "View your request submission status.",
  ],
  "/admin": [
    "لوحة الإدارة",
    "Administration",
    "إدارة خاصة للطلبات والدفعات.",
    "Private order and payment administration.",
  ],
};
function Shell() {
  const { lang, t, toggle } = useLanguage();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    const m = meta[path] || [
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
    const url = site.url + (path === "/" ? "" : path.slice(1) + "/");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    set('meta[property="og:url"]', url);
    set(
      'meta[name="robots"]',
      ["/admin", "/success"].includes(path) || !meta[path]
        ? "noindex, nofollow"
        : "index, follow",
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
    <>
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
              <NavLink key={to} to={to} end={to === "/"}>
                {t(ar, en)}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="language-button"
              onClick={toggle}
              aria-label={t("Switch to English", "التبديل إلى العربية")}
            >
              <Globe2 size={17} />
              <span>{t("EN", "عربي")}</span>
            </button>
            <Link className="button nav-cta" to="/contact">
              {t("اطلب الخدمة", "Get started")}
            </Link>
            <button
              className="menu-button"
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
            {[...nav, ["/contact", "تواصل معنا", "Contact"]].map(
              ([to, ar, en]) => (
                <NavLink key={to} to={to} onClick={() => setMenu(false)}>
                  {t(ar, en)}
                </NavLink>
              ),
            )}
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1} className="container">
        <Suspense
          fallback={
            <p className="empty-state">{t("جارٍ التحميل…", "Loading…")}</p>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<How />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="/integrity" element={<Legal kind="integrity" />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <h2 className="visually-hidden">{t("روابط الموقع", "Site links")}</h2>
        <div className="container footer-grid">
          <div>
            <Logo />
            <p>
              {t(
                "معرفة اليوم. إمكانات أكبر للغد.",
                "Knowledge today. Greater possibilities tomorrow.",
              )}
            </p>
            <span className="footer-tag">
              {t(
                "دعم أكاديمي سعودي، برؤية أوضح.",
                "Saudi academic support. A clearer perspective.",
              )}
            </span>
          </div>
          <div>
            <h3>{t("اكتشف نيكسورا", "Explore Nexora")}</h3>
            <Link to="/services">
              {t("الخدمات والأسعار", "Services & pricing")}
            </Link>
            <Link to="/calculator">{t("حاسبة السعر", "Price calculator")}</Link>
            <Link to="/how-it-works">{t("آلية الطلب", "How it works")}</Link>
          </div>
          <div>
            <h3>{t("نحن هنا للمساعدة", "Here to help")}</h3>
            <Link to="/contact">{t("تواصل معنا", "Contact us")}</Link>
            <Link to="/faq">{t("الأسئلة الشائعة", "FAQ")}</Link>
            <Link to="/integrity">
              {t("النزاهة الأكاديمية", "Academic integrity")}
            </Link>
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
            <Link to="/privacy">{t("سياسة الخصوصية", "Privacy policy")}</Link>
            <Link to="/terms">
              {t("الشروط والأحكام", "Terms & conditions")}
            </Link>
            <Link to="/admin">{t("دخول الإدارة", "Admin sign in")}</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Nexora Academic.{" "}
            {t("جميع الحقوق محفوظة.", "All rights reserved.")}
          </span>
          <span>LEARN · CONNECT · PROGRESS</span>
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
        <ArrowUp size={20} />
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
            <MessageCircle size={20} />
            {t("تواصل معنا عبر واتساب", "Chat on WhatsApp")}
          </a>
        ) : (
          <Link to="/contact">
            <MessageCircle size={20} />
            {t("جهّز طلبك وتواصل معنا", "Prepare your support request")}
          </Link>
        )}
      </aside>
    </>
  );
}
export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("nexora-language") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  });
  function toggle() {
    setLang((previous) => {
      const next = previous === "ar" ? "en" : "ar";
      try {
        localStorage.setItem("nexora-language", next);
      } catch {
        /* Switching still works without storage. */
      }
      return next;
    });
  }
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Shell />
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}
