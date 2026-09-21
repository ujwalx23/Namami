import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  Sparkles,
  Calendar,
  Video,
  CalendarDays,
  MessageSquare,
  Image,
  Heart,
  Phone,
  ArrowRight,
  BookOpen,
  Book,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { SiteInbox } from "@/components/SiteInbox";
import type { TKey } from "@/i18n/translations";

const links = [
  { to: "/", key: "nav.home" as TKey, icon: Home },
  { to: "/about", key: "nav.about" as TKey, icon: Info },
  { to: "/sandesh", key: "nav.sandesh" as TKey, icon: Sparkles },
  { to: "/videos", key: "nav.videos" as TKey, icon: Video },
  { to: "/blog", key: "nav.blog" as TKey, icon: BookOpen },
  { to: "/calendar", key: "nav.calendar" as TKey, icon: CalendarDays },
  { to: "/learn", key: "nav.learn" as TKey, icon: Book },
  { to: "/gallery", key: "nav.gallery" as TKey, icon: Image },
  { to: "/reviews", key: "nav.reviews" as TKey, icon: MessageSquare },
  { to: "/events", key: "nav.events" as TKey, icon: Calendar },
  { to: "/contact", key: "nav.contact" as TKey, icon: Phone },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t, toggle, lang } = useLang();
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (docHeight > 0) {
        setScrollPercent((scrolled / docHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/10 shadow-lg">
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" style={{ width: `${scrollPercent}%` }} />
        </div>
        <div className="site-header-container mx-auto">
          <Link to="/" className="flex items-center gap-1.5 xs:gap-2.5 group min-w-0 shrink">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-sacred flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform duration-300 shrink-0">
              <span className="text-cream font-display text-base xs:text-lg">ॐ</span>
            </div>
            <div className="leading-tight min-w-0 shrink">
              <div
                className={`font-display text-sm xs:text-base sm:text-lg text-maroon truncate ${lang === "hi" ? "font-devanagari" : ""}`}
              >
                {t("brand.name")}
              </div>
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-[0.1em] xs:tracking-[0.2em] text-muted-foreground truncate">
                {t("brand.tag")}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-foreground/80 hover:text-maroon transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-maroon after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] after:origin-left ${lang === "hi" ? "font-devanagari" : ""}`}
                activeProps={{ className: "text-maroon after:scale-x-100" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 ml-8 shrink-0">
            <SiteInbox />
            <button
              onClick={toggle}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-maroon/30 text-maroon text-xs font-medium hover:bg-maroon hover:text-cream transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="Switch language"
            >
              <span>अ/A</span>
              <span className="opacity-40">|</span>
              <span className="font-medium">{t("lang.toggle")}</span>
            </button>
            <Link
              to="/donation"
              className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-sacred text-cream font-medium text-sm shadow-gold hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              {t("nav.donate_btn")}
            </Link>
          </div>

          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 lg:hidden shrink-0">
            <SiteInbox />
            <button
              onClick={toggle}
              className="group inline-flex items-center justify-center gap-1 px-2.5 py-1.5 xs:gap-1.5 xs:px-3 py-2 rounded-full border border-maroon/30 text-maroon text-xs font-medium min-h-[38px] xs:min-h-[44px] hover:bg-maroon/5 active:bg-maroon/10 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
              aria-label="Switch language"
            >
              <span>अ/A</span>
              <span className="hidden xs:inline opacity-40">|</span>
              <span className="hidden xs:inline font-medium">{t("lang.toggle")}</span>
            </button>
            <Link
              to="/donation"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-gradient-sacred text-cream font-medium text-xs shadow-gold hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-300 shrink-0"
            >
              {t("nav.donate_btn")}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 xs:p-3 text-maroon hover:bg-maroon/5 active:bg-maroon/10 rounded-full transition-all duration-300 active:scale-90 inline-flex items-center justify-center min-w-[38px] min-h-[38px] xs:min-w-[44px] xs:min-h-[44px] cursor-pointer shrink-0"
              aria-label={t("nav.menu")}
            >
              {open ? (
                <X size={22} className="rotate-90 transition-transform duration-300" />
              ) : (
                <Menu size={22} className="rotate-0 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Right Slide-out Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[240px] bg-card/95 backdrop-blur-2xl border-l border-gold/30 shadow-sacred z-50 transition-all duration-500 ease-spring lg:hidden flex flex-col ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-5 border-b border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-maroon font-display text-lg">
              ॐ {lang === "hi" ? "मेनू" : "Navigation"}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-maroon hover:bg-maroon/5 rounded-full transition-transform active:scale-90"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-scroll py-2 flex flex-col gap-0.5 scrollbar-custom"
          style={{ direction: "rtl" }}
        >
          <div style={{ direction: "ltr" }} className="flex flex-col gap-0.5 px-3">
            {links.map((l, idx) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground/80 hover:text-maroon hover:bg-gold/5 active:scale-[0.98] transition-all duration-300 ${
                    lang === "hi" ? "font-devanagari text-sm" : "text-xs"
                  }`}
                  activeProps={{
                    className: "text-maroon font-semibold bg-gold/10 border-l-4 border-maroon",
                  }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-sacred/10 text-saffron flex items-center justify-center shrink-0">
                    <Icon size={14} />
                  </div>
                  <span>{t(l.key)}</span>
                  <ArrowRight
                    size={11}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gold"
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-5 border-t border-gold/20 flex flex-col gap-3 bg-cream/10">
          <Link
            to="/donation"
            onClick={() => setOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium text-sm shadow-gold hover:opacity-95 active:scale-95 transition-all duration-300"
          >
            <Heart size={14} />
            {t("nav.donate_btn")}
          </Link>
          <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground pt-1">
            <Link to="/privacy" onClick={() => setOpen(false)} className="hover:text-maroon">
              {t("nav.privacy")}
            </Link>
            <span>·</span>
            <Link to="/terms" onClick={() => setOpen(false)} className="hover:text-maroon">
              {t("nav.terms")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
