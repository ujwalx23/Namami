import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";

const SOCIAL_URL = "https://ujwalsingh.in";

const quickLinks: { to: string; key: TKey }[] = [
  { to: "/about", key: "nav.about" },
  { to: "/sandesh", key: "nav.sandesh" },
  { to: "/events", key: "nav.events" },
  { to: "/videos", key: "nav.videos" },
  { to: "/panchang", key: "nav.panchang" },
  { to: "/donation", key: "nav.donation" },
  { to: "/reviews", key: "nav.reviews" },
];

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="mt-24 bg-maroon text-cream/90">
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-sacred flex items-center justify-center">
              <span className="text-cream font-display text-xl">ॐ</span>
            </div>
            <div>
              <div className="font-display text-xl text-gold">{t("brand.name")}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-cream/60">{t("brand.tag")}</div>
            </div>
          </div>
          <p className="text-sm text-cream/70 max-w-md leading-relaxed">{t("footer.tagline")}</p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Youtube, Instagram].map((Icon, i) => (
              <a
                key={i}
                href={SOCIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Social"
                className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-gold text-lg mb-4">{t("footer.quick")}</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-gold">{t(l.key)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-gold text-lg mb-4">{t("footer.reach")}</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-gold" /><span>{t("footer.address")}</span></li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-gold" /><a href="tel:+919334339505">+91 93343 39505</a></li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-gold" /><a href="mailto:info@namamivindhyavasini.org">info@namamivindhyavasini.org</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {t("footer.copy")}
      </div>
    </footer>
  );
}
