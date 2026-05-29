import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import maaImg from "@/assets/maa-vindhyavasini.png";
import maaImg2 from "@/assets/maa-vindhyavasini-2.jpg";
import maaImg3 from "@/assets/maa-vindhyavasini-3.jpg";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Heart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Users,
  Compass,
  Sunrise,
  Sunset,
  Star,
  Moon,
  Download,
  Smartphone,
  WifiOff,
  X,
  Bell,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { subscribeToNotifications, isPushConfigured } from "@/lib/push";
import { toast } from "sonner";
import type { TKey } from "@/i18n/translations";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namami Vindhyavasini Sansthan — Divine Grace of Maa Vindhyavasini" },
      {
        name: "description",
        content:
          "Devotional trust dedicated to Maa Vindhyavasini Shakti Pitha at Vindhyachal Dham. Daily Sandesh, temple events, satsang, panchang and seva.",
      },
      { property: "og:title", content: "Namami Vindhyavasini Sansthan" },
      {
        property: "og:description",
        content:
          "Embrace divine grace. Daily darshan, sandesh and events from the sacred Shakti Pitha of Maa Vindhyavasini.",
      },
    ],
    links: [{ rel: "icon", href: "/favicon.png" }],
  }),
  component: HomePage,
});

const slides: { img: string; titleKey: TKey; subKey?: TKey; sanskrit: string; duration: number }[] =
  [
    {
      img: maaImg,
      titleKey: "home.slide.vindhya.title",
      subKey: "home.slide.vindhya.sub",
      sanskrit: "श्री विन्ध्यवासिन्यै नमः",
      duration: 6000,
    },
    {
      img: maaImg2,
      titleKey: "home.slide.darshan.title",
      sanskrit: "जय माँ विन्ध्यवासिनी",
      duration: 3500,
    },
    {
      img: maaImg3,
      titleKey: "home.slide.shringar.title",
      sanskrit: "जय माँ विन्ध्यवासिनी",
      duration: 3500,
    },
  ];

function HeroSlider() {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    const tm = setTimeout(() => setI((p) => (p + 1) % slides.length), slides[i].duration);
    return () => clearTimeout(tm);
  }, [i]);

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-sacred rounded-[2rem] blur-3xl opacity-30 animate-glow" />
      <div className="relative aspect-[3/4] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60 transition-premium hover:scale-[1.02] hover:border-gold/90 animate-gold-breath">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.img} alt={t(s.titleKey)} className={`w-full h-full object-cover ${idx === i ? "animate-kenburns" : ""}`} />
            <div className="absolute inset-0 bg-gradient-overlay" />
            <div className="absolute bottom-6 left-6 right-6 text-center text-cream">
              <div className="font-devanagari text-gold text-sm">{s.sanskrit}</div>
              <div
                className={`font-display text-2xl mt-1 ${lang === "hi" ? "font-devanagari" : ""}`}
              >
                {t(s.titleKey)}
              </div>
              {s.subKey && (
                <div className="text-xs uppercase tracking-[0.25em] text-cream/80 mt-1">
                  {t(s.subKey)}
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 text-maroon flex items-center justify-center hover:bg-cream"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setI((p) => (p + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 text-maroon flex items-center justify-center hover:bg-cream"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : "w-1.5 bg-cream/60"}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Lightweight Panchang for homepage strip =====
const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashti",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima/Amavasya",
];
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
function jd(d: Date) {
  return d.getTime() / 86400000 + 2440587.5;
}
function getAyanamsha(jdVal: number) {
  const yearsSince1900 = (jdVal - 2415020.0) / 365.2422;
  return 22.466 + yearsSince1900 * (50.29 / 3600);
}
function sunLon(d: Date) {
  const n = jd(d) - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360) * Math.PI) / 180;
  return (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g) + 360) % 360;
}
function moonLon(d: Date) {
  const jdVal = jd(d);
  const T = (jdVal - 2451545.0) / 36525;
  const L_prime = (218.3164 + 481267.8812 * T) % 360;
  const D = (297.8502 + 445267.1114 * T) % 360;
  const M = (134.9634 + 477198.8675 * T) % 360;
  const M_prime = (357.5291 + 35999.0503 * T) % 360;
  const F = (93.2721 + 483202.0175 * T) % 360;

  const D_rad = D * Math.PI / 180;
  const M_rad = M * Math.PI / 180;
  const Mp_rad = M_prime * Math.PI / 180;
  const F_rad = F * Math.PI / 180;

  let dL = 0;
  dL += 6.288774 * Math.sin(M_rad);
  dL += 1.274027 * Math.sin(2 * D_rad - M_rad);
  dL += 0.658309 * Math.sin(2 * D_rad);
  dL += 0.213618 * Math.sin(2 * M_rad);
  dL += -0.185116 * Math.sin(Mp_rad);
  dL += -0.114332 * Math.sin(2 * F_rad);
  dL += 0.058793 * Math.sin(2 * D_rad - 2 * M_rad);
  dL += 0.057066 * Math.sin(2 * D_rad - M_rad - Mp_rad);
  dL += 0.053322 * Math.sin(2 * D_rad + M_rad);
  dL += 0.045758 * Math.sin(2 * D_rad - Mp_rad);
  dL += -0.041023 * Math.sin(M_rad - Mp_rad);
  dL += -0.034720 * Math.sin(D_rad);
  dL += -0.030465 * Math.sin(M_rad + Mp_rad);
  dL += 0.015327 * Math.sin(2 * D_rad - 2 * F_rad);
  dL += -0.012528 * Math.sin(2 * D_rad + Mp_rad);
  dL += -0.009756 * Math.sin(2 * D_rad - M_rad + Mp_rad);
  dL += 0.008034 * Math.sin(2 * D_rad - 2 * M_rad - Mp_rad);
  dL += -0.007684 * Math.sin(2 * D_rad - 2 * M_rad + Mp_rad);
  dL += 0.006322 * Math.sin(2 * M_rad - 2 * D_rad);
  dL += -0.005877 * Math.sin(M_rad - 2 * D_rad);

  return (L_prime + dL + 360) % 360;
}
function sunRiseSet(date: Date): [Date, Date] {
  const lat = 25.1467,
    lon = 82.5;
  const j = Math.floor(jd(date) - 0.5) + 0.5;
  const n = Math.round(j - 2451545.0 + 0.0008);
  const Js = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Js) % 360;
  const Mr = (M * Math.PI) / 180;
  const C = 1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr);
  const lam = (((M + C + 180 + 102.9372) % 360) * Math.PI) / 180;
  const Jt = 2451545.0 + Js + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lam);
  const decl = Math.asin(Math.sin(lam) * Math.sin((23.44 * Math.PI) / 180));
  const lr = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(lr) * Math.sin(decl)) /
    (Math.cos(lr) * Math.cos(decl));
  const H = (Math.acos(Math.max(-1, Math.min(1, cosH))) * 180) / Math.PI;
  return [
    new Date((Jt - H / 360 - 2440587.5) * 86400000),
    new Date((Jt + H / 360 - 2440587.5) * 86400000),
  ];
}
function fmtT(d: Date) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function PanchangStrip() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const data = useMemo(() => {
    const today = new Date();
    const noon = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 6, 30, 0),
    );
    const sl = sunLon(noon),
      ml = moonLon(noon);
    const diff = (ml - sl + 360) % 360;
    const tNum = Math.floor(diff / 12);
    const paksha =
      tNum < 15 ? (lang === "hi" ? "शुक्ल" : "Shukla") : lang === "hi" ? "कृष्ण" : "Krishna";
    const tithi = `${paksha} ${TITHIS[tNum % 15]}`;
    const ayan = getAyanamsha(jd(noon));
    const moonSid = (ml - ayan + 360) % 360;
    const nak = NAKSHATRAS[Math.floor(moonSid / (360 / 27)) % 27];
    const [sr, ss] = sunRiseSet(today);
    return { tithi, nak, sr: fmtT(sr), ss: fmtT(ss) };
  }, []);
  const items = [
    { i: Star, k: t("home.panch.tithi"), v: data.tithi },
    { i: Moon, k: t("home.panch.nak"), v: data.nak },
    { i: Sunrise, k: t("home.panch.sunrise"), v: data.sr },
    { i: Sunset, k: t("home.panch.sunset"), v: data.ss },
  ];
  return (
    <section className="container mx-auto px-6 pb-4">
      <div className="rounded-3xl bg-gradient-divine border-2 border-gold/40 shadow-[0_0_35px_rgba(212,175,55,0.22)] shadow-sacred overflow-hidden hover:shadow-[0_0_40px_rgba(212,175,55,0.32)] transition-shadow duration-500">
        <div className="px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gold/20">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className={`text-[11px] uppercase tracking-[0.3em] text-saffron ${dev}`}>
                {t("home.panch.kicker")}
              </div>
            </div>
            <div className={`font-display text-xl text-maroon ${dev}`}>{t("home.panch.title")}</div>
          </div>
          <Link
            to="/panchang"
            className={`text-sm text-maroon font-medium hover:text-saffron inline-flex items-center gap-1 ${dev}`}
          >
            {t("home.panch.full")} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.k}
              className="group px-5 py-4 flex items-center gap-3 border-r last:border-r-0 border-gold/20 odd:bg-cream/30 hover:bg-gold/5 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-sacred flex items-center justify-center text-cream shrink-0 group-hover:scale-110 transition-transform duration-300">
                <it.i size={16} />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-[11px] uppercase tracking-wider text-muted-foreground ${dev}`}
                >
                  {it.k}
                </div>
                <div className={`font-medium text-maroon text-sm truncate ${dev}`}>{it.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PWAInstallCard() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [installable, setInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // If deferredPrompt is already available
    if ((window as any).deferredPrompt) {
      setInstallable(true);
    }

    const handlePrompt = () => {
      setInstallable(true);
    };

    window.addEventListener("pwa-install-available", handlePrompt);
    window.addEventListener("beforeinstallprompt", handlePrompt);

    return () => {
      window.removeEventListener("pwa-install-available", handlePrompt);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) return;

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`[PWA] User choice outcome: ${outcome}`);

    (window as any).deferredPrompt = null;
    setInstallable(false);
  };

  if (isStandalone) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-cream/10 p-6 md:p-8 text-center max-w-2xl mx-auto shadow-inner">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <Smartphone size={24} />
        </div>
        <h3 className={`font-display text-xl text-maroon mb-1 ${dev}`}>
          {lang === "hi" ? "ऐप सफलतापूर्वक इंस्टॉल हो गया है!" : "Application Installed Successfully!"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === "hi"
            ? "अब आप बिना इंटरनेट के भी माँ विन्ध्यवासिनी की परिक्रमा, संदेश एवं पंचांग देख सकते हैं।"
            : "You can now access the virtual Parikrama, daily Sandesh, and Panchang offline."}
        </p>
        {isPushConfigured() && (
          <button
            type="button"
            onClick={async () => {
              const ok = await subscribeToNotifications();
              toast[ok ? "success" : "error"](
                ok
                  ? lang === "hi"
                    ? "फ़ोन पर सूचनाएँ चालू हो गईं।"
                    : "Phone notifications enabled."
                  : lang === "hi"
                    ? "सूचना अनुमति अस्वीकार या उपलब्ध नहीं।"
                    : "Could not enable notifications. Check browser permission.",
              );
            }}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-sacred text-cream text-sm font-medium"
          >
            <Bell size={14} />
            {lang === "hi" ? "सूचनाएँ चालू करें" : "Enable phone notifications"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gold/40 bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto shadow-sacred hover:shadow-gold transition-shadow duration-500">
      <div className="flex items-center gap-4 text-left">
        <div className="w-14 h-14 rounded-2xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0 animate-pulse">
          <Download size={24} />
        </div>
        <div>
          <h3 className={`font-display text-2xl text-maroon mb-1 ${dev}`}>
            {lang === "hi" ? "ऑफ़लाइन ऐप डाउनलोड करें" : "Download Offline Web App"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {lang === "hi"
              ? "पंचांग, दैनिक संदेश और परिक्रमा की जानकारी को बिना इंटरनेट के भी सीधे अपने फ़ोन पर देखने के लिए इंस्टॉल करें।"
              : "Install directly on your phone to check Panchang details, daily messages, and tour directions completely offline."}
          </p>
        </div>
      </div>

      <div className="shrink-0 w-full md:w-auto">
        {installable ? (
          <button
            onClick={handleInstallClick}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:scale-[1.03] transition-transform duration-300"
          >
            <Download size={16} />
            {lang === "hi" ? "अभी इंस्टॉल करें" : "Install Now"}
          </button>
        ) : (
          <div className="text-xs text-muted-foreground border border-gold/20 bg-cream/20 px-4 py-2.5 rounded-xl text-center md:text-left">
            <span className="flex items-center gap-1.5 justify-center md:justify-start">
              <WifiOff size={14} className="text-saffron" />
              {lang === "hi"
                ? "क्रोम / सफारी मेनू खोलें और 'होम स्क्रीन पर जोड़ें' चुनें"
                : "Open browser menu & select 'Add to Home Screen'"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MantraMarquee() {
  const mantras = [
    "॥ जय माँ विन्ध्यवासिनी ॥",
    "॥ श्री विन्ध्यवासिन्यै नमः ॥",
    "॥ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥",
    "॥ या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥",
    "॥ जय जगदम्ब जय जननी ॥",
  ];
  const doubledMantras = [...mantras, ...mantras, ...mantras];
  return (
    <div className="w-full bg-saffron py-2.5 overflow-hidden border-y border-gold/30 relative z-20 shadow-md">
      <div className="animate-marquee flex whitespace-nowrap gap-16 text-cream font-devanagari text-base md:text-lg font-medium tracking-wide">
        {doubledMantras.map((m, idx) => (
          <span key={idx} className="flex items-center gap-3">
            <span className="text-gold text-lg">✦</span>
            <span>{m}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const { t, lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleDownload = async (url: string, title: string) => {
    try {
      const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window.open", err);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const intro = [
    { icon: Heart, tk: "home.card.purpose.title" as TKey, xk: "home.card.purpose.text" as TKey },
    {
      icon: BookOpen,
      tk: "home.card.sansthapana.title" as TKey,
      xk: "home.card.sansthapana.text" as TKey,
    },
    { icon: Sparkles, tk: "home.card.vision.title" as TKey, xk: "home.card.vision.text" as TKey },
  ];

  const stats = [
    { icon: Mountain, n: t("home.shakti.stat1"), s: t("home.shakti.stat1v") },
    { icon: Users, n: t("home.shakti.stat2"), s: t("home.shakti.stat2v") },
    { icon: Compass, n: t("home.shakti.stat3"), s: t("home.shakti.stat3v") },
  ];

  const upcomingEvents = hi
    ? [
        {
          title: "नवरात्रि महोत्सव",
          date: "३ – १२ अक्टूबर",
          location: "मुख्य मंदिर प्रांगण",
          desc: "नौ रात्रि भक्ति, कीर्तन एवं आरती।",
        },
        {
          title: "पूर्णिमा सत्संग",
          date: "५ नवंबर",
          location: "सत्संग भवन",
          desc: "गुरुजी के साथ मासिक पूर्णिमा सत्संग।",
        },
        {
          title: "अन्नकूट भण्डारा",
          date: "१४ नवंबर",
          location: "भोजनालय",
          desc: "सभी भक्तों हेतु प्रसाद सेवा।",
        },
      ]
    : [
        {
          title: "Navratri Mahotsav",
          date: "Oct 03 – Oct 12",
          location: "Main Mandir Prangan",
          desc: "Nine nights of devotion, kirtan and aarti.",
        },
        {
          title: "Purnima Satsang",
          date: "Nov 05",
          location: "Satsang Hall",
          desc: "Monthly purnima satsang with Guru ji.",
        },
        {
          title: "Annakut Bhandara",
          date: "Nov 14",
          location: "Bhojanalaya",
          desc: "Community prasad seva for all devotees.",
        },
      ];

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine" />
        <div className="absolute inset-0 mandala-bg" />
        
        {/* Decorative Rotating Mandala Background Watermark */}
        <svg
          className="absolute -right-24 -top-24 w-80 h-80 md:w-[480px] md:h-[480px] opacity-10 text-gold/30 animate-spin-slow pointer-events-none select-none"
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <circle cx="60" cy="60" r="54" />
          <circle cx="60" cy="60" r="48" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="36" />
          <circle cx="60" cy="60" r="24" />
          <circle cx="60" cy="60" r="12" />
          <path d="M60 6 L60 114 M6 60 L114 60" />
          <path d="M21.8 21.8 L98.2 98.2 M21.8 98.2 L98.2 21.8" />
          <path d="M60 6 L65 24 L60 20 L55 24 Z" />
          <path d="M60 114 L65 96 L60 100 L55 96 Z" />
          <path d="M6 60 L24 65 L20 60 L24 55 Z" />
          <path d="M114 60 L96 65 L100 60 L96 55 Z" />
          <circle cx="60" cy="15" r="3" fill="currentColor" />
          <circle cx="60" cy="105" r="3" fill="currentColor" />
          <circle cx="15" cy="60" r="3" fill="currentColor" />
          <circle cx="105" cy="60" r="3" fill="currentColor" />
        </svg>

        <div className="container mx-auto px-6 pt-16 pb-24 relative grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right" duration={1000}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-gold/40 text-maroon text-xs uppercase tracking-[0.25em] mb-6">
                <Sparkles size={12} className="text-saffron" /> {t("home.badge")}
              </div>
              <div className="font-devanagari text-saffron text-xl mb-3">॥ नमामि विन्ध्यवासिनी ॥</div>
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl text-maroon mb-6 ${
                  hi ? "leading-[1.4] font-devanagari py-2" : "font-display leading-[1.05]"
                }`}
              >
                {t("home.hero.title1")}{" "}
                <span className={`text-gradient-gold ${hi ? "not-italic" : "italic"}`}>{t("home.hero.title2")}</span>
              </h1>
              <p
                className={`text-lg text-foreground/75 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed ${dev}`}
              >
                {t("home.hero.desc")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/sandesh"
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  <span className="btn-shine-overlay" />
                  {t("home.cta.today")} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-7 py-3 rounded-full border-2 border-maroon text-maroon font-medium hover:bg-maroon hover:text-cream hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  {t("home.cta.about")}
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" duration={1000}>
            <HeroSlider />
          </ScrollReveal>
        </div>
      </section>

      {/* SHAKTI PITHA STATS */}
      <section className="container mx-auto px-6 -mt-10 relative z-10">
        <ScrollReveal direction="up" delay={200} duration={900}>
          <div className="rounded-3xl bg-card border-2 border-gold/40 shadow-sacred p-8 md:p-10 grid md:grid-cols-3 gap-6 hover:shadow-gold transition-shadow duration-500">
            {stats.map((s) => (
              <div key={s.n} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <s.icon size={24} />
                </div>
                <div>
                  <div className={`font-display text-2xl text-maroon group-hover:text-saffron transition-colors duration-300 ${dev}`}>{s.n}</div>
                  <div className={`text-sm text-muted-foreground ${dev}`}>{s.s}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* SACRED MANTRA MARQUEE */}
      <MantraMarquee />

      {/* DAILY PANCHANG STRIP */}
      <PanchangStrip />

      {/* INTRO */}
      <section className="container mx-auto px-6 py-16">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
              {t("home.intro.kicker")}
            </div>
            <h2 className={`font-display text-4xl md:text-5xl text-maroon ${dev}`}>
              {t("home.intro.title")}
            </h2>
            <div className="mx-auto mt-4 w-24 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {intro.map((c, idx) => (
            <ScrollReveal key={c.tk} direction="up" delay={idx * 150} duration={800}>
              <div
                className="group tilt-card-hover p-8 rounded-2xl bg-card/75 backdrop-blur-md border border-gold/30 hover:border-gold hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] transition-premium h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <c.icon size={20} />
                </div>
                <h3 className={`font-display text-2xl text-maroon mb-2 group-hover:text-saffron transition-colors duration-300 ${dev}`}>{t(c.tk)}</h3>
                <p className={`text-muted-foreground/90 leading-relaxed text-sm md:text-base ${dev}`}>{t(c.xk)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SHAKTI PITHA STORY */}
      <section className="bg-gradient-divine border-y border-border/60">
        <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <ScrollReveal direction="right" duration={900}>
              <div className="aspect-[4/5] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60 hover:shadow-gold transition-shadow duration-500">
                <img src={maaImg2} alt="Maa Vindhyavasini" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </ScrollReveal>
          </div>
          <div className="order-1 lg:order-2">
            <ScrollReveal direction="left" duration={900}>
              <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                {t("home.shakti.kicker")}
              </div>
              <h2 className={`font-display text-4xl md:text-5xl text-maroon mb-6 ${dev}`}>
                {t("home.shakti.title")}
              </h2>
              <p className={`text-foreground/80 leading-relaxed text-lg ${dev}`}>
                {t("home.shakti.text")}
              </p>
              <Link
                to="/about"
                className={`mt-6 inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
              >
                {hi ? "विस्तार से पढ़ें" : "Read the full story"} <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SANDESH PREVIEW */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3">
          <ScrollReveal direction="right" duration={800}>
            <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
              {t("home.sandesh.kicker")}
            </div>
            <h2 className={`font-display text-4xl md:text-5xl text-maroon mb-6 ${dev}`}>
              {t("home.sandesh.title")}
            </h2>
            <blockquote
              className={`border-l-4 border-gold pl-6 italic text-lg text-foreground/85 leading-relaxed ${dev}`}
            >
              {t("home.sandesh.quote")}
              <footer className={`mt-4 not-italic text-sm text-muted-foreground ${dev}`}>
                {t("home.sandesh.author")}
              </footer>
            </blockquote>
            <Link
              to="/sandesh"
              className={`mt-8 inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
            >
              {t("home.sandesh.read")} <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
        <div className="md:col-span-2 flex justify-center">
          <ScrollReveal direction="left" delay={200} duration={800}>
            <div className="w-56 h-56 rounded-3xl bg-gradient-sacred p-1 shadow-sacred animate-float">
              <div className="w-full h-full rounded-[1.4rem] bg-cream flex items-center justify-center text-center px-4 hover:bg-gold/10 transition-colors duration-500">
                <div>
                  <div className="font-devanagari text-5xl text-maroon leading-none">ॐ</div>
                  <div className={`font-display text-base text-maroon mt-3 ${dev}`}>
                    {t("home.pillars")}
                  </div>
                  <div className={`text-[11px] text-muted-foreground mt-1 ${dev}`}>
                    {t("home.pillars.sub")}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DIVYA DARSHAN GALLERY */}
      <section className="bg-gradient-divine border-y border-border/60">
        <div className="container mx-auto px-6 py-20">
          <ScrollReveal direction="up" duration={800}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                {hi ? "दिव्य दर्शन" : "Divya Darshan"}
              </div>
              <h2 className={`font-display text-4xl md:text-5xl text-maroon ${dev}`}>
                {hi ? "माँ का दिव्य श्रृंगार" : "Sacred Darshan Gallery"}
              </h2>
              <div className="mx-auto mt-4 w-24 h-[2px] bg-gradient-sacred rounded-full" />
              <p className={`mt-5 text-foreground/75 ${dev}`}>
                {hi
                  ? "विभिन्न अवसरों पर माँ विन्ध्यवासिनी का मनमोहक श्रृंगार एवं दर्शन"
                  : "Glimpses of Maa Vindhyavasini's divine shringar across sacred occasions"}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: maaImg, cap: hi ? "मुख्य विग्रह" : "Mool Vigraha" },
              { src: maaImg2, cap: hi ? "प्रातः आरती" : "Mangala Aarti" },
              { src: maaImg3, cap: hi ? "विशेष श्रृंगार" : "Vishesh Shringar" },
              { src: gallery1, cap: hi ? "स्वर्ण श्रृंगार" : "Swarna Shringar" },
              { src: gallery2, cap: hi ? "पुष्प श्रृंगार" : "Pushpa Shringar" },
              { src: gallery3, cap: hi ? "नवरात्रि दर्शन" : "Navaratri Darshan" },
            ].map((p, i) => (
              <ScrollReveal key={i} direction="up" delay={(i % 3) * 120} duration={850}>
                <figure
                  onClick={() => setLightbox(p.src)}
                  className="group golden-sweep-container relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-sacred hover:shadow-gold transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                >
                  <img
                    src={p.src}
                    alt={p.cap}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="golden-sweep-effect" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <figcaption
                    className={`absolute bottom-0 left-0 right-0 p-4 text-cream font-display text-lg translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${dev}`}
                  >
                    {p.cap}
                  </figcaption>

                  {/* Download Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(p.src, p.cap || `darshan_${i + 1}`);
                    }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-cream/90 text-maroon hover:bg-gold hover:text-cream flex items-center justify-center shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                    title="Download image"
                    aria-label="Download image"
                  >
                    <Download size={16} />
                  </button>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="container mx-auto px-6 py-10 pb-20">
        <ScrollReveal direction="up" duration={800}>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                {t("home.events.kicker")}
              </div>
              <h2 className={`font-display text-4xl md:text-5xl text-maroon ${dev}`}>
                {t("home.events.title")}
              </h2>
            </div>
            <Link
              to="/events"
              className={`inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
            >
              {t("home.events.viewall")} <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((e, idx) => (
            <ScrollReveal key={e.title} direction="up" delay={idx * 150} duration={800}>
              <article
                className="rounded-2xl overflow-hidden bg-card border border-gold/30 hover:border-gold/60 hover:shadow-sacred hover:-translate-y-1.5 transition-premium group h-full"
              >
                <div className="h-2 bg-gradient-sacred" />
                <div className="p-7">
                  <h3
                    className={`font-display text-2xl text-maroon mb-3 group-hover:text-saffron transition-colors duration-300 ${dev}`}
                  >
                    {e.title}
                  </h3>
                  <div className={`flex flex-col gap-1.5 text-sm text-muted-foreground mb-4 ${dev}`}>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-gold" /> {e.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold" /> {e.location}
                    </span>
                  </div>
                  <p className={`text-foreground/75 ${dev}`}>{e.desc}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <ScrollReveal direction="up" duration={900}>
          <div className="rounded-3xl bg-gradient-sacred p-10 md:p-16 text-center text-cream shadow-sacred relative overflow-hidden group">
            <div className="absolute inset-0 mandala-bg opacity-30 group-hover:scale-105 transition-transform duration-[10s]" />
            <div className="relative">
              <div className="font-devanagari text-gold text-lg mb-3">{t("home.cta2.sanskrit")}</div>
              <h2 className={`font-display text-4xl md:text-5xl mb-4 ${dev}`}>
                {t("home.cta2.title")}
              </h2>
              <p className={`max-w-xl mx-auto text-cream/85 mb-8 ${dev}`}>{t("home.cta2.text")}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/donation"
                  className="px-7 py-3 rounded-full bg-cream text-maroon font-medium hover:bg-gold hover:scale-[1.03] transition-all duration-300 shadow-lg"
                >
                  {t("home.cta2.donate")}
                </Link>
                <Link
                  to="/contact"
                  className="px-7 py-3 rounded-full border-2 border-cream text-cream font-medium hover:bg-cream hover:text-maroon hover:scale-[1.03] transition-all duration-300"
                >
                  {t("home.cta2.contact")}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PWA OFFLINE APP DOWNLOAD */}
      <section className="container mx-auto px-6 pb-20">
        <ScrollReveal direction="up" duration={800}>
          <PWAInstallCard />
        </ScrollReveal>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 transition-all duration-300 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-cream/10 text-cream hover:bg-cream/20 hover:rotate-90 transition-all duration-300 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-h-[80vh] max-w-full flex flex-col items-center transition-all duration-500 ease-spring animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="Darshan"
              className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain border border-gold/25 hover:scale-[1.01] transition-transform duration-300"
            />
            
            {/* Download Button in Lightbox */}
            <button
              onClick={() => {
                const itemsList = [
                  { src: maaImg, cap: hi ? "मुख्य विग्रह" : "Mool Vigraha" },
                  { src: maaImg2, cap: hi ? "प्रातः आरती" : "Mangala Aarti" },
                  { src: maaImg3, cap: hi ? "विशेष श्रृंगार" : "Vishesh Shringar" },
                  { src: gallery1, cap: hi ? "स्वर्ण श्रृंगार" : "Swarna Shringar" },
                  { src: gallery2, cap: hi ? "पुष्प श्रृंगार" : "Pushpa Shringar" },
                  { src: gallery3, cap: hi ? "नवरात्रि दर्शन" : "Navaratri Darshan" },
                ];
                const item = itemsList.find((it) => it.src === lightbox);
                handleDownload(lightbox, item?.cap || "darshan_vigraha");
              }}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:scale-[1.03] active:scale-95 transition-all duration-300 text-sm cursor-pointer"
            >
              <Download size={14} />
              {hi ? "डाउनलोड करें" : "Download Darshan"}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
