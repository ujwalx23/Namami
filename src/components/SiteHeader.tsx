import { Link } from "@tanstack/react-router";
import { useState } from "react";
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
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
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
              className={`text-foreground/80 hover:text-maroon transition-colors relative ${lang === "hi" ? "font-devanagari" : ""}`}
              activeProps={{ className: "text-maroon" }}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-maroon/30 text-maroon text-xs font-medium hover:bg-maroon hover:text-cream transition"
            aria-label="Switch language"
          >
            <Languages size={14} /> {t("lang.toggle")}
          </button>
          <Link
            to="/donation"
            className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-sacred text-cream font-medium text-sm shadow-gold hover:opacity-95 transition"
          >
            {t("nav.donate_btn")}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <SiteInbox />
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-maroon/30 text-maroon text-xs font-medium"
            aria-label="Switch language"
          >
            <Languages size={12} /> {t("lang.toggle")}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-maroon"
            aria-label={t("nav.menu")}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-2 text-foreground/80 hover:text-maroon ${lang === "hi" ? "font-devanagari" : ""}`}
                activeProps={{ className: "text-maroon font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
