import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Languages } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { SiteInbox } from "@/components/SiteInbox";
import type { TKey } from "@/i18n/translations";
const links: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/sandesh", key: "nav.sandesh" },
  { to: "/events", key: "nav.events" },
  { to: "/videos", key: "nav.videos" },
  { to: "/panchang", key: "nav.panchang" },
  { to: "/reviews", key: "nav.reviews" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/donation", key: "nav.donation" },
  { to: "/contact", key: "nav.contact" },
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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/10 shadow-lg">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollPercent}%` }} />
      </div>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-sacred flex items-center justify-center shadow-gold">
            <span className="text-cream font-display text-lg">ॐ</span>
          </div>
          <div className="leading-tight">
            <div
              className={`font-display text-lg text-maroon ${lang === "hi" ? "font-devanagari" : ""}`}
            >
              {t("brand.name")}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
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
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-maroon/30 text-maroon text-xs font-medium hover:bg-maroon hover:text-cream transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Switch language"
          >
            <Languages size={14} className="group-hover:rotate-180 transition-transform duration-500" /> {t("lang.toggle")}
          </button>
          <Link
            to="/donation"
            className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-sacred text-cream font-medium text-sm shadow-gold hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            {t("nav.donate_btn")}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <SiteInbox />
          <button
            onClick={toggle}
            className="group inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-maroon/30 text-maroon text-xs font-medium min-h-[44px] hover:bg-maroon/5 active:bg-maroon/10 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Switch language"
          >
            <Languages size={14} className="group-hover:rotate-180 transition-transform duration-500" /> {t("lang.toggle")}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-3 text-maroon hover:bg-maroon/5 active:bg-maroon/10 rounded-full transition-all duration-300 active:scale-90 inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
            aria-label={t("nav.menu")}
          >
            {open ? <X size={22} className="rotate-90 transition-transform duration-300" /> : <Menu size={22} className="rotate-0 transition-transform duration-300" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden border-t border-border/60 bg-background transition-all duration-500 ease-expo overflow-hidden ${open ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}>
        <nav className="container mx-auto px-6 flex flex-col gap-3">
          {links.map((l, idx) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={
                open
                  ? {
                      animationDelay: `${idx * 40}ms`,
                    }
                  : undefined
              }
              className={`py-2.5 text-foreground/80 hover:text-maroon transition-all duration-300 active:scale-95 block text-base ${open ? "opacity-0 animate-slide-in-left" : ""} ${lang === "hi" ? "font-devanagari" : ""}`}
              activeProps={{ className: "text-maroon font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
