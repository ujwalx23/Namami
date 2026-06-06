import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";

const quickLinks: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/sandesh", key: "nav.sandesh" },
  { to: "/events", key: "nav.events" },
  { to: "/videos", key: "nav.videos" },
  { to: "/panchang", key: "nav.panchang" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/reviews", key: "nav.reviews" },
  { to: "/donation", key: "nav.donation" },
  { to: "/contact", key: "nav.contact" },
];

export function SiteFooter() {
  const { t, lang } = useLang();

  const socialMedias = [
    {
      name: "Facebook",
      icon: Facebook,
      to: "https://www.facebook.com/profile.php?id=61590841911906",
      isExternal: true,
      className: "social-icon-fb",
      label: "Facebook",
    },
    {
      name: "YouTube",
      icon: Youtube,
      to: "https://www.youtube.com/@astroyogiumesh",
      isExternal: true,
      className: "social-icon-yt",
      label: "YouTube",
    },
    {
      name: "Instagram",
      icon: Instagram,
      to: "https://www.instagram.com/namamivindhyavasini",
      isExternal: true,
      className: "social-icon-ig",
      label: "Instagram",
    },
  ];

  return (
    <footer className="relative mt-24 bg-maroon text-cream/90 border-t border-gold/20 overflow-hidden">
      {/* Sacred Gold/Saffron Top Border Accent */}
      <div className="h-[3px] w-full bg-gradient-sacred" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-sacred flex items-center justify-center shadow-gold shrink-0">
              <span className="text-cream font-display text-xl">ॐ</span>
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl text-gold tracking-wide">
                {t("brand.name")}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream/60">
                {t("brand.tag")}
              </div>
            </div>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed max-w-sm">{t("footer.tagline")}</p>

          {/* Highlighted Social Media Icons */}
          <div className="flex gap-4 pt-2">
            {socialMedias.map((social) => {
              const Icon = social.icon;
              return social.isExternal ? (
                <a
                  key={social.name}
                  href={social.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-transparent transition-all duration-300 ${social.className} cursor-pointer shadow-sm`}
                  title={social.label}
                >
                  <Icon size={18} />
                </a>
              ) : (
                <Link
                  key={social.name}
                  to={social.to}
                  aria-label={social.name}
                  className={`w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-transparent transition-all duration-300 ${social.className} cursor-pointer shadow-sm`}
                  title={social.label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-display text-gold text-lg mb-6 border-b border-gold/20 pb-2 inline-block">
            {t("footer.quick")}
          </h4>
          <ul className="space-y-3.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="relative text-cream/80 hover:text-gold transition-colors duration-300 py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact / Reach Us */}
        <div>
          <h4 className="font-display text-gold text-lg mb-6 border-b border-gold/20 pb-2 inline-block">
            {t("footer.reach")}
          </h4>
          <ul className="space-y-4 text-sm text-cream/80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-gold shrink-0" />
              <span className="leading-relaxed">{t("footer.address")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-gold shrink-0" />
              <a
                href="tel:+919334339505"
                className="hover:text-gold transition-colors duration-300"
              >
                +91 93343 39505
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-gold shrink-0" />
              <a
                href="mailto:contact@namamivindhyavasini.in"
                className="hover:text-gold transition-colors duration-300 break-all"
              >
                contact@namamivindhyavasini.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Footer Bar */}
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>
            © {new Date().getFullYear()} {t("footer.copy")}
          </span>
          <span className="text-[10px] text-cream/35 tracking-wider uppercase">
            {lang === "hi" ? "॥ जय माता दी ॥" : "॥ JAI MATA DI ॥"}
          </span>
        </div>
      </div>
    </footer>
  );
}
