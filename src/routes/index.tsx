import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import maaImg from "@/assets/maa-vindhyavasini.webp";
import maaImg2 from "@/assets/maa-vindhyavasini-2.webp";
import maaImg3 from "@/assets/maa-vindhyavasini-3.webp";
import maaImgSimhasan from "@/assets/maa-vindhyavasini-simhasan-shringar.webp";
import maaImgGarland from "@/assets/maa-vindhyavasini-garland-shringar.webp";
import maaImgNeel from "@/assets/maa-vindhyavasini-neel-shringar.webp";
import maaImgShakti from "@/assets/maa-vindhyavasini-shakti-peeth.webp";
import vaishnoDeviImg from "@/assets/vaishno-devi-shrine.webp";
import kedarnathImg from "@/assets/kedarnath-temple.webp";
import kashiVishwanathImg from "@/assets/kashi-vishwanath.webp";
import mahakaleshwarImg from "@/assets/mahakaleshwar-temple.webp";
import gallery1 from "@/assets/gallery-1.webp";
import gallery2 from "@/assets/gallery-2.webp";
import gallery3 from "@/assets/gallery-3.webp";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Users,
  Compass,
  Download,
  Smartphone,
  WifiOff,
  X,
  Bell,
  ShieldCheck,
  Quote,
  Clock,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { subscribeToNotifications, isPushConfigured } from "@/lib/push";
import { toast } from "sonner";
import type { TKey } from "@/i18n/translations";
import { ScrollReveal } from "@/components/ScrollReveal";
import { JsonLd } from "@/components/JsonLd";
import { cleanHtmlContent } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maa Vindhyavasini Temple Vindhyachal | Official Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Official website of Namami Vindhyavasini Sansthan. Explore Maa Vindhyavasini Temple History, Vindhyachal Darshan Timings, Trikona Parikrama guides, daily aarti, chalisa, hotels near temple, and devotional resources.",
      },
      {
        name: "keywords",
        content:
          "Maa Vindhyavasini, Vindhyavasini Temple, Vindhyavasini Devi, Vindhyachal Temple, Vindhyachal Darshan, Vindhyavasini Mirzapur, Shakti Peeth Vindhyavasini, Maa Vindhyavasini Temple History, aarti, chalisa, hotels near Vindhyavasini, ropeway timings",
      },
      {
        property: "og:title",
        content: "Maa Vindhyavasini Temple Vindhyachal | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Explore Maa Vindhyavasini Temple History, Vindhyachal Darshan Timings, Trikona Parikrama guide, daily aarti, and spiritual resources.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/" },
      {
        property: "og:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      { property: "og:site_name", content: "Namami Vindhyavasini Sansthan" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maa Vindhyavasini Temple Vindhyachal" },
      {
        name: "twitter:description",
        content:
          "Explore Vindhyachal Dham Darshan timings, temple history, aarti, and parikrama guides by Namami Vindhyavasini Sansthan.",
      },
      {
        name: "twitter:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      { name: "theme-color", content: "#7a1e1e" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=2" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=2" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png?v=2" },
      { rel: "shortcut icon", href: "/favicon.ico?v=2" },
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  component: HomePage,
});

const slides: {
  img: string;
  titleKey: TKey;
  altKey: TKey;
  subKey?: TKey;
  sanskrit: string;
  duration: number;
}[] = [
  {
    img: maaImg,
    titleKey: "home.slide.vindhya.title",
    altKey: "home.slide.vindhya.alt" as TKey,
    subKey: "home.slide.vindhya.sub",
    sanskrit: "श्री विन्ध्यवासिन्यै नमः",
    duration: 6000,
  },
  {
    img: maaImgSimhasan,
    titleKey: "home.slide.temple.title" as TKey,
    altKey: "home.slide.temple.alt" as TKey,
    sanskrit: "जय माँ विन्ध्यवासिनी",
    duration: 5000,
  },
  {
    img: maaImg2,
    titleKey: "home.slide.darshan.title",
    altKey: "home.slide.darshan.alt" as TKey,
    sanskrit: "जय माँ विन्ध्यवासिनी",
    duration: 3500,
  },
  {
    img: maaImg3,
    titleKey: "home.slide.shringar.title",
    altKey: "home.slide.shringar.alt" as TKey,
    sanskrit: "जय माँ विन्ध्यवासिनी",
    duration: 3500,
  },
  {
    img: maaImgGarland,
    titleKey: "home.slide.darshan_new.title" as TKey,
    altKey: "home.slide.darshan_new.alt" as TKey,
    sanskrit: "जय माँ विन्ध्यवासिनी",
    duration: 5000,
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
      <div className="relative aspect-[3/4] max-w-[280px] sm:max-w-xs md:max-w-[340px] lg:max-w-[320px] mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60 transition-premium hover:scale-[1.02] hover:border-gold/90 animate-gold-breath">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={s.img}
              alt={t(s.altKey)}
              fetchPriority={idx === 0 ? "high" : "low"}
              loading={idx === 0 ? "eager" : "lazy"}
              className={`w-full h-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
            />
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
          {lang === "hi"
            ? "ऐप सफलतापूर्वक इंस्टॉल हो गया है!"
            : "Application Installed Successfully!"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === "hi"
            ? "अब आप बिना इंटरनेट के भी माँ विन्ध्यवासिनी की परिक्रमा, संदेश एवं हिंदू कैलेंडर देख सकते हैं।"
            : "You can now access Maa information, devotional content and spiritual guidance."}
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
              ? "हिंदू कैलेंडर, दैनिक संदेश और परिक्रमा की जानकारी को बिना इंटरनेट के भी सीधे अपने फ़ोन पर देखने के लिए इंस्टॉल करें।"
              : "Install directly on your phone to explore Maa Vindhyavasini's information, gallery, temple updates and devotional content."}
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

const categoryTranslations: Record<string, { en: string; hi: string }> = {
  "Temple History": { en: "Temple History", hi: "मंदिर इतिहास" },
  "Guruji Messages": { en: "Guruji Messages", hi: "गुरुजी संदेश" },
  Festivals: { en: "Festivals", hi: "त्योहार और उत्सव" },
  "Spiritual Knowledge": { en: "Spiritual Knowledge", hi: "आध्यात्मिक ज्ञान" },
  "Devotional Articles": { en: "Devotional Articles", hi: "भक्ति लेख" },
  "Events & Announcements": { en: "Events & Announcements", hi: "कार्यक्रम व घोषणाएँ" },
  "Maa Vindhyavasini Stories": { en: "Maa Vindhyavasini Stories", hi: "माँ विंध्यवासिनी कथाएँ" },
};

function formatDate(isoString: string, lang: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

function getExcerpt(content: string, length = 150): string {
  const stripped = content
    .replace(/[#*`_[\]()]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= length) return stripped;
  return stripped.substring(0, length) + "...";
}

type BlogPost = Tables<"blog_posts">;

function HomePage() {
  const { t, lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";

  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("publish_date", new Date().toISOString())
      .order("publish_date", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          const cleaned = data.map((post) => ({
            ...post,
            content: cleanHtmlContent(post.content),
          }));
          setLatestBlogs(cleaned as BlogPost[]);
        }
      });
  }, []);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.namamivindhyavasini.in/#organization",
    name: "Namami Vindhyavasini Sansthan",
    url: "https://www.namamivindhyavasini.in",
    logo: "https://www.namamivindhyavasini.in/favicon.png",
    image: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
    description:
      "Official Namami Vindhyavasini Sansthan website dedicated to Maa Vindhyavasini at Vindhyachal Dham. Explore daily spiritual updates, bhandara, and social activities.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@namamivindhyavasini.in",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61590841911906",
      "https://www.instagram.com/namamivindhyavasini",
      "https://www.youtube.com/@astroyogiumesh",
      "https://www.youtube.com/@NamamiVindhyavasini",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.namamivindhyavasini.in/#website",
    name: "Namami Vindhyavasini Sansthan",
    url: "https://www.namamivindhyavasini.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.namamivindhyavasini.in/calendar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61590841911906",
      "https://www.instagram.com/namamivindhyavasini",
      "https://www.youtube.com/@astroyogiumesh",
      "https://www.youtube.com/@NamamiVindhyavasini",
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/#webpage",
    url: "https://www.namamivindhyavasini.in",
    name: "Namami Vindhyavasini | Official Website of Namami Vindhyavasini Sansthan",
    description:
      "Namami Vindhyavasini is the official website of Namami Vindhyavasini Sansthan. Explore Maa Vindhyavasini Darshan at Vindhyachal Dham, galleries, reviews, and devotional activities.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61590841911906",
      "https://www.instagram.com/namamivindhyavasini",
      "https://www.youtube.com/@astroyogiumesh",
      "https://www.youtube.com/@NamamiVindhyavasini",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.namamivindhyavasini.in",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: hi
          ? "माँ विंध्यवासिनी मंदिर कहाँ स्थित है?"
          : "Where is Maa Vindhyavasini Temple located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: hi
            ? "माँ विंध्यवासिनी देवी का प्राचीन मंदिर उत्तर प्रदेश के मिर्जापुर जिले में पवित्र गंगा नदी के तट पर स्थित विंध्याचल धाम में है।"
            : "Maa Vindhyavasini Temple is located in Vindhyachal Dham, Mirzapur district, Uttar Pradesh, India, on the banks of the sacred river Ganges.",
        },
      },
      {
        "@type": "Question",
        name: hi
          ? "त्रिकोण परिक्रमा का क्या महत्व है?"
          : "What is the significance of the Trikona Parikrama?",
        acceptedAnswer: {
          "@type": "Answer",
          text: hi
            ? "त्रिकोण परिक्रमा विंध्याचल का एक अत्यंत पवित्र परिक्रमा पथ है जिसमें आदि शक्ति के तीन रूपों के दर्शन होते हैं: माँ विंध्यवासिनी (महालक्ष्मी), काली खोह में माँ काली (महाकाली) और अष्टभुजा मंदिर में माँ अष्टभुजा (महासरस्वती)।"
            : "Trikona Parikrama is a sacred pilgrimage circuit in Vindhyachal that includes visiting three key temples representing the three main forms of Adi Parashakti: Maa Vindhyavasini (Maha Lakshmi), Maa Kali at Kali Khoh (Maha Kali), and Maa Ashtabhuja (Maha Saraswati).",
        },
      },
      {
        "@type": "Question",
        name: hi ? "नमामि विंध्यवासिनी संस्थान क्या है?" : "What is Namami Vindhyavasini Sansthan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: hi
            ? "नमामि विंध्यवासिनी संस्थान एक धार्मिक एवं आध्यात्मिक ट्रस्ट है जो भक्तों तक माँ विंध्यवासिनी की महिमा पहुँचाने, धार्मिक संसाधन, स्तोत्र और हिंदू कैलेंडर प्रकाशित करने के साथ-साथ मीडिया गैलरी, वीडियो और आध्यात्मिक संदेश प्रदान करने के लिए समर्पित है।"
            : "Namami Vindhyavasini Sansthan is a spiritual trust dedicated to spreading the divine message of Maa Vindhyavasini, publishing devotional resources, stotram, and the Hindu calendar, while also providing a media gallery, videos and spiritual sandesha.",
        },
      },
    ],
  };

  const templePlaceSchema = {
    "@context": "https://schema.org",
    "@type": "HinduTemple",
    "@id": "https://www.namamivindhyavasini.in/#temple",
    name: "Maa Vindhyavasini Temple (Vindhyachal Dham)",
    description:
      "Sacred Hindu temple dedicated to Maa Vindhyavasini Devi, located on the banks of Ganges in Vindhyachal, Mirzapur, Uttar Pradesh. A preeminent Shakti Peeth.",
    url: "https://www.namamivindhyavasini.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vindhyachal Dham",
      addressLocality: "Vindhyachal, Mirzapur",
      addressRegion: "Uttar Pradesh",
      postalCode: "231307",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.161048",
      longitude: "82.502941",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "04:00",
        closes: "22:30",
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61590841911906",
      "https://www.instagram.com/namamivindhyavasini/",
    ],
  };

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
    { icon: ShieldCheck, tk: "home.card.trust.title" as TKey, xk: "home.card.trust.text" as TKey },
    { icon: Users, tk: "home.card.guidance.title" as TKey, xk: "home.card.guidance.text" as TKey },
  ];

  const stats = [
    { icon: Mountain, n: t("home.shakti.stat1"), s: t("home.shakti.stat1v") },
    { icon: Users, n: t("home.shakti.stat2"), s: t("home.shakti.stat2v") },
    { icon: Compass, n: t("home.shakti.stat3"), s: t("home.shakti.stat3v") },
  ];

  const devoteeReviews = hi
    ? [
        {
          name: "प्रिया शर्मा",
          comment:
            "मैं प्रभावित हुई कि सबकुछ कितना व्यवस्थित था। मंदिर की जानकारी, दर्शन विवरण और विचारशील संदेश खंड ने मूल्यवान मार्गदर्शन और प्रेरणा प्रदान की। दर्शन की योजना बनाने वाले भक्तों के लिए अत्यंत अनुशंसित। 🌺🙏",
        },
      ]
    : [
        {
          name: "Priya Sharma",
          comment:
            "I was impressed by how well-organized everything was. The temple information, darshan details and Sandesh section were very helpful. Highly valuable resource for devotees and visitors. 🌺🙏",
        },
      ];

  const imagesSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-grace",
        url: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini.webp",
        name: "Maa Vindhyavasini Divine Grace Darshan",
        caption: "Divine face and alankar of Maa Vindhyavasini at Vindhyachal temple",
        description: hi
          ? "विन्ध्याचल धाम में आदि शक्ति माँ विन्ध्यवासिनी देवी का पावन दर्शन।"
          : "Sovereign grace and divine darshan photo of Maa Vindhyavasini Devi at Vindhyachal.",
        contentUrl: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini.webp",
      },
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-simhasan",
        url: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
        name: "Maa Vindhyavasini Simhasan Shringar",
        caption: "Goddess Vindhyavasini sitting on her golden lion throne (Simhasan)",
        description: hi
          ? "विन्ध्याचल मंदिर से माँ विन्ध्यवासिनी देवी का दिव्य सिंहासन श्रृंगार चित्र।"
          : "Golden throne (Simhasan) alankar of Maa Vindhyavasini in Vindhyachal temple.",
        contentUrl: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-darshan",
        url: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp",
        name: "Maa Vindhyavasini Temple Darshan",
        caption: "Daily alankar shringar of Maa Vindhyavasini in the sanctum sanctorum",
        description: hi
          ? "विन्ध्याचल मंदिर के गर्भगृह से माँ विन्ध्यवासिनी का अलौकिक दर्शन।"
          : "Sacred inner sanctum daily darshan and shringar photo of Goddess Vindhyavasini.",
        contentUrl: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp",
      },
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-shringar",
        url: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.webp",
        name: "Maa Vindhyavasini Alankar Shringar",
        caption: "Beautiful divine shringar of Goddess Vindhyavasini at Vindhyachal Dham",
        description: hi
          ? "विन्ध्याचल धाम में माँ विन्ध्यवासिनी देवी का सुंदर श्रृंगार और दिव्य दर्शन।"
          : "Beautiful divine alankar shringar photo of Maa Vindhyavasini Devi at Vindhyachal Dham.",
        contentUrl: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.webp",
      },
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-garland",
        url: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-garland-shringar.webp",
        name: "Maa Vindhyavasini Garland Alankar",
        caption: "Devotees' offerings of flower garlands (mala alankar) to Maa Vindhyavasini",
        description: hi
          ? "विन्ध्याचल मंदिर में दिव्य पुष्पमाला अलौकिक श्रृंगार में सजी माँ विन्ध्यवासिनी।"
          : "Flower garland decoration of Maa Vindhyavasini inside Vindhyachal temple.",
        contentUrl: "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-garland-shringar.webp",
      },
      {
        "@type": "ImageObject",
        "@id": "https://www.namamivindhyavasini.in/#image-swarna",
        url: "https://www.namamivindhyavasini.in/images/gallery-1.webp",
        name: "Swarna Shringar of Maa Vindhyavasini",
        caption: "Golden alankar shringar decoration of Goddess Vindhyavasini",
        description: hi
          ? "माँ विन्ध्यवासिनी देवी का दिव्य स्वर्ण मुकुट एवं श्रृंगार दर्शन।"
          : "Divine gold crown and ornament shringar of Maa Vindhyavasini Devi at Vindhyachal temple.",
        contentUrl: "https://www.namamivindhyavasini.in/images/gallery-1.webp",
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={templePlaceSchema} />
      <JsonLd data={imagesSchema} />
      <MantraMarquee />
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

        <div className="container mx-auto px-6 pt-8 pb-12 sm:pt-16 sm:pb-24 relative grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          <ScrollReveal direction="right" duration={1000}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-gold/40 text-maroon text-xs uppercase tracking-[0.25em] mb-4 md:mb-6">
                <Sparkles size={12} className="text-saffron" /> {t("home.badge")}
              </div>
              <div className="font-devanagari text-saffron text-base md:text-xl mb-2 md:mb-3">
                ॥ नमामि विन्ध्यवासिनी ॥
              </div>
              <h1
                className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-maroon mb-4 md:mb-6 ${
                  hi ? "leading-[1.3] font-devanagari py-1" : "font-display leading-[1.05]"
                }`}
              >
                {t("home.hero.title1")}{" "}
                <span
                  className={`text-gradient-gold ${hi ? "not-italic" : "italic"}`}
                  style={{
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                    paddingRight: "0.15em",
                  }}
                >
                  {t("home.hero.title2")}
                </span>
              </h1>
              <p
                className={`text-sm sm:text-base md:text-lg text-foreground/75 max-w-xl mx-auto lg:mx-0 mb-5 md:mb-8 leading-relaxed ${dev}`}
              >
                {t("home.hero.desc")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/about"
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-300"
                >
                  <span className="btn-shine-overlay" />
                  {hi ? "माँ के बारे में" : "About Maa"}{" "}
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
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
                  <div
                    className={`font-display text-2xl text-maroon group-hover:text-saffron transition-colors duration-300 ${dev}`}
                  >
                    {s.n}
                  </div>
                  <div className={`text-sm text-muted-foreground ${dev}`}>{s.s}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* INTRO */}
      <section className="container mx-auto px-6 py-10 md:py-16">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
              {t("home.intro.kicker")}
            </div>
            <h2 className={`font-display text-2xl sm:text-3xl md:text-5xl text-maroon ${dev}`}>
              {t("home.intro.title")}
            </h2>
            <div className="mx-auto mt-3 md:mt-4 w-16 md:w-24 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {intro.map((c, idx) => (
            <ScrollReveal key={c.tk} direction="up" delay={idx * 150} duration={800}>
              <div className="group tilt-card-hover p-5 sm:p-6 md:p-8 rounded-2xl bg-card/75 backdrop-blur-md border border-gold/30 hover:border-gold hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] transition-premium h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream mb-3 md:mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <c.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3
                  className={`font-display text-lg sm:text-xl md:text-2xl text-maroon mb-1 md:mb-2 group-hover:text-saffron transition-colors duration-300 ${dev}`}
                >
                  {t(c.tk)}
                </h3>
                <p
                  className={`text-muted-foreground/90 leading-relaxed text-xs sm:text-sm md:text-base ${dev}`}
                >
                  {t(c.xk)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SHAKTI PITHA STORY */}
      <section className="bg-gradient-divine border-y border-border/60">
        <div className="container mx-auto px-6 py-8 md:py-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <ScrollReveal direction="right" duration={900}>
              <div className="aspect-[4/5] max-w-[260px] sm:max-w-xs md:max-w-sm lg:max-w-[280px] mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60 hover:shadow-gold transition-shadow duration-500">
                <img
                  src={maaImg2}
                  alt="Maa Vindhyavasini Devi Temple Vindhyachal Dham"
                  title="Maa Vindhyavasini Temple"
                  width={384}
                  height={480}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                />
              </div>
            </ScrollReveal>
          </div>
          <div className="order-1 lg:order-2">
            <ScrollReveal direction="left" duration={900}>
              <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                {t("home.shakti.kicker")}
              </div>
              <h2
                className={`font-display text-2xl sm:text-3xl md:text-5xl text-maroon mb-4 md:mb-6 ${dev}`}
              >
                {t("home.shakti.title")}
              </h2>
              <p
                className={`text-foreground/80 leading-relaxed text-sm sm:text-base lg:text-lg ${dev}`}
              >
                {t("home.shakti.text")}
              </p>
              <Link
                to="/about"
                hash="history"
                className={`mt-4 md:mt-6 inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
              >
                {hi
                  ? "माँ विन्ध्यवासिनी का विस्तृत पौराणिक इतिहास पढ़ें"
                  : "Read the Detailed History of Maa Vindhyavasini"}{" "}
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SANDESH PREVIEW */}
      <section className="container mx-auto px-6 py-10 grid md:grid-cols-5 gap-10 items-center">
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
        <div className="container mx-auto px-6 py-10">
          <ScrollReveal direction="up" duration={800}>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                  {hi ? "दिव्य दर्शन" : "Divya Darshan"}
                </div>
                <h2 className={`font-display text-4xl md:text-5xl text-maroon ${dev}`}>
                  {hi ? "माँ का दिव्य श्रृंगार" : "Sacred Darshan Gallery"}
                </h2>
                <p className={`mt-3 text-foreground/75 max-w-xl ${dev}`}>
                  {hi
                    ? "विभिन्न अवसरों पर माँ विन्ध्यवासिनी का मनमोहक श्रृंगार एवं दर्शन"
                    : "Glimpses of Maa Vindhyavasini's divine shringar across sacred occasions"}
                </p>
              </div>
              <Link
                to="/gallery"
                className={`inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
              >
                {hi
                  ? "माँ विन्ध्यवासिनी श्रृंगार दर्शन गैलरी देखें"
                  : "Explore Maa Vindhyavasini Divine Gallery"}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { src: gallery1, cap: hi ? "स्वर्ण श्रृंगार" : "Swarna Shringar" },
              { src: maaImg, cap: hi ? "दिव्य स्वरूप (कृपा)" : "Divine Grace" },
              { src: maaImg2, cap: hi ? "दिव्य दर्शन" : "Temple Darshan" },
            ].map((p, i) => (
              <ScrollReveal key={i} direction="up" delay={(i % 3) * 120} duration={850}>
                <figure className="group golden-sweep-container relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-sacred hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                  <img
                    src={p.src}
                    alt={`${p.cap} of Maa Vindhyavasini Devi at Vindhyachal Temple`}
                    title={p.cap}
                    width={350}
                    height={460}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                  />
                  <div className="golden-sweep-effect" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <figcaption
                    className={`absolute bottom-0 left-0 right-0 p-4 text-cream font-display text-lg translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${dev}`}
                  >
                    {p.cap}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOGS SECTION */}
      {latestBlogs.length > 0 && (
        <section className="container mx-auto px-6 py-10 border-t border-gold/15 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3">
            <ScrollReveal direction="right" duration={800}>
              <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
                {hi ? "नवीनतम आध्यात्मिक लेख" : "Latest Spiritual Article"}
              </div>
              <h2 className={`font-display text-4xl md:text-5xl text-maroon mb-4 ${dev}`}>
                {hi ? "नवीनतम लेख" : "Latest Article"}
              </h2>
              <p className={`text-foreground/80 leading-relaxed mb-6 ${dev}`}>
                {hi
                  ? "गुरुकृपा, साधना और सनातन धर्म के गहन ज्ञान को समझने के लिए हमारे आध्यात्मिक ब्लॉग व लेख पढ़ें।"
                  : "Explore our collection of spiritual articles, teachings, and divine wisdom from Pujya Guru Ji."}
              </p>
              <Link
                to="/blog"
                className={`inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
              >
                {t("blog.view_all")} <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>

          <div className="md:col-span-2 w-full max-w-sm mx-auto">
            {latestBlogs.slice(0, 1).map((post) => (
              <ScrollReveal key={post.id} direction="left" duration={800}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col bg-card rounded-2xl border border-gold/30 hover:border-gold hover:shadow-gold transition-all duration-300 overflow-hidden shadow-sm cursor-pointer text-inherit hover:text-inherit"
                >
                  {post.featured_image ? (
                    <div className="relative w-full h-44 overflow-hidden bg-black/5 flex items-center justify-center border-b border-border/40">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 pointer-events-none select-none"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-maroon/90 text-cream text-[9px] uppercase font-bold tracking-widest border border-gold/20">
                          {categoryTranslations[post.category]?.[lang] || post.category}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                        {!post.featured_image && (
                          <span className="px-2.5 py-0.5 rounded-full bg-maroon/10 text-maroon font-bold uppercase tracking-wider text-[9px]">
                            {categoryTranslations[post.category]?.[lang] || post.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-gold" />{" "}
                          {formatDate(post.publish_date, lang)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-gold" />{" "}
                          {calculateReadingTime(post.content)} {t("blog.read_time")}
                        </span>
                      </div>

                      <h3
                        className={`font-display text-lg text-maroon group-hover:text-saffron transition-colors duration-300 leading-snug line-clamp-2 ${dev} group-hover:underline`}
                      >
                        {post.title}
                      </h3>

                      <p
                        className={`text-muted-foreground text-xs leading-relaxed line-clamp-3 ${dev}`}
                      >
                        {getExcerpt(post.content, 120)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-end mt-3 shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs text-maroon font-semibold group-hover:text-saffron transition-colors">
                        {t("blog.read_more")}
                        <ArrowRight
                          size={12}
                          className="transform group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* DEVOTEE REVIEWS */}
      <section className="container mx-auto px-6 py-10 pb-10 grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3">
          <ScrollReveal direction="right" duration={800}>
            <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
              {hi ? "श्रद्धालुओं के अनुभव" : "Devotee Experiences"}
            </div>
            <h2 className={`font-display text-4xl md:text-5xl text-maroon mb-4 ${dev}`}>
              {hi ? "भक्तों की समीक्षाएं" : "Devotee Reviews"}
            </h2>
            <p className={`text-foreground/80 leading-relaxed mb-6 ${dev}`}>
              {hi
                ? "माँ विन्ध्यवासिनी की असीम अनुकंपा, मंदिर की दिव्य व्यवस्था और यहाँ दर्शन करने वाले श्रद्धालुओं के पावन अनुभव।"
                : "Read about the personal experiences, spiritual feedback and divine blessings shared by devotees of Maa Vindhyavasini."}
            </p>
            <Link
              to="/reviews"
              className={`inline-flex items-center gap-2 text-maroon font-medium hover:text-saffron transition-colors duration-300 ${dev}`}
            >
              {hi
                ? "श्रद्धालुओं के अनुभव व समीक्षाएं पढ़ें"
                : "Read Maa Vindhyavasini Devotee Reviews"}{" "}
              <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>

        <div className="md:col-span-2 w-full max-w-sm mx-auto">
          {devoteeReviews.map((r, idx) => (
            <ScrollReveal key={r.name} direction="left" delay={idx * 150} duration={800}>
              <article className="relative rounded-2xl p-6 bg-card border border-gold/30 hover:border-gold/60 hover:shadow-sacred hover:-translate-y-1 transition-premium group">
                <div className="absolute top-4 right-4 text-gold/10 group-hover:text-gold/20 transition-colors">
                  <Quote size={32} strokeWidth={1.5} />
                </div>

                <p
                  className={`relative text-foreground/80 leading-relaxed italic mb-4 text-sm ${dev}`}
                >
                  "{r.comment}"
                </p>

                <div className="flex items-center gap-2.5 border-t border-gold/10 pt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-sacred flex items-center justify-center text-cream font-display text-xs shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className={`font-semibold text-maroon text-xs ${dev}`}>{r.name}</h3>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RICH SEO DEVOTIONAL CONTENT SECTION */}
      <section className="container mx-auto px-6 py-10 border-t border-gold/15 bg-cream/5 rounded-3xl mt-6">
        <ScrollReveal direction="up" duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 block ${dev}`}>
                {hi ? "सनातन धर्म दर्शन" : "Spiritual Teachings & Devotional Resources"}
              </span>
              <h2 className={`font-display text-3xl md:text-4xl text-maroon ${dev}`}>
                {hi
                  ? "माँ विंध्यवासिनी की पौराणिक महिमा एवं साधना"
                  : "Divine Grace of Maa Vindhyavasini Devi Shakti Peeth"}
              </h2>
              <div className="w-20 h-[2px] bg-gradient-sacred rounded-full" />

              <div
                className={`space-y-4 text-foreground/80 leading-relaxed text-sm md:text-base ${dev}`}
              >
                <p>
                  {hi ? (
                    <>
                      <strong>माँ विंध्यवासिनी</strong> आदि शक्ति का परम अवतार हैं, जो विंध्याचल
                      पर्वत श्रृंखला पर सदा विराजमान रहती हैं। श्रीमद्देवी भागवत महापुराण के अनुसार,
                      देवी विंध्यवासिनी ने द्वापर युग में देवकी और वासुदेव के यहाँ जन्म लिया था और
                      कंस के चंगुल से मुक्त होकर अष्टभुजी रूप (Maa Ashtabhuja) धारण कर आकाश मार्ग से
                      विंध्य क्षेत्र को अपना निवास बनाया। यह पावन भूमि 51 शक्ति पीठ (Shakti Peeth)
                      में से अत्यंत जागृत और फलदायी मानी जाती है।
                    </>
                  ) : (
                    <>
                      The divine mother <strong>Maa Vindhyavasini</strong> is the ultimate
                      manifestation of Adi Parashakti, residing eternally at the Vindhyachal hill
                      range. According to sacred scriptures, she descended as Yogmaya during the
                      Dwapara Yug to protect the divine infant Sri Krishna and protect
                      righteousness. The sacred shrine of <strong>Vindhyavasini Temple</strong> is
                      venerated as one of the most powerful Shakti Peethas in India, where millions
                      of devotees seek spiritual liberation.
                    </>
                  )}
                </p>
                <p>
                  {hi ? (
                    <>
                      विंध्याचल धाम में नवरात्रि (Navratri) के पावन समय पर नौ दिनों तक विशेष
                      पूजा-अनुष्ठान आयोजित होते हैं। भक्त यहाँ पवित्र{" "}
                      <strong>विंध्येश्वरी स्तोत्र</strong> (Vindhyeshwari Stotram) और{" "}
                      <strong>विंध्यवासिनी आरती</strong> (Vindhyavasini Aarti) का गान करते हुए माँ
                      की उपासना करते हैं। परिक्रमा पथ (Trikona Parikrama) के अंतर्गत काली खोह तथा
                      अष्टभुजा देवी का दर्शन करने से मोक्ष एवं मानसिक शांति की प्राप्ति होती है।
                    </>
                  ) : (
                    <>
                      During the highly auspicious nine days of <strong>Navratri</strong>,
                      Vindhyachal Dham welcomes pilgrims from all over the world. Devotees
                      participate in reciting the sacred <strong>Vindhyeshwari Stotram</strong> and
                      chanting the divine <strong>Vindhyavasini Aarti</strong> for inner peace and
                      prosperity. The Trikona Parikrama pilgrimage including Kali Khoh and
                      Ashtabhuja shrines delivers spiritual salvation.
                    </>
                  )}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-sacred/10 border border-gold/30 hover:border-gold text-maroon font-semibold text-xs transition"
                  >
                    {hi ? "विंध्येश्वरी स्तोत्र एवं आरती समय" : "Read Stotram & Aarti Timings"}{" "}
                    <ArrowRight size={12} />
                  </Link>
                  <Link
                    to="/calendar"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-sacred/10 border border-gold/30 hover:border-gold text-maroon font-semibold text-xs transition"
                  >
                    {hi ? "कैलेंडर एवं व्रत तिथियाँ" : "Explore Hindu Festival Calendar"}{" "}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-gold/30 space-y-4">
              <h3
                className={`font-display text-xl text-maroon border-b border-gold/20 pb-2 ${dev}`}
              >
                {hi ? "धार्मिक संसाधन" : "Devotional Guides"}
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    to: "/about",
                    label: hi ? "विंध्याचल मंदिर का इतिहास" : "History of Vindhyachal Temple",
                  },
                  {
                    to: "/calendar",
                    label: hi
                      ? "व्रत, एकादशी एवं पूर्णिमा तिथियाँ"
                      : "Fasting, Ekadashi & Purnima Dates",
                  },
                  {
                    to: "/events",
                    label: hi
                      ? "नवीनतम धार्मिक आयोजन व सत्संग"
                      : "Upcoming Spiritual Events & Satsang",
                  },
                  {
                    to: "/gallery",
                    label: hi ? "दिव्य श्रृंगार दर्शन फोटो गैलरी" : "Devi Shringar Photo Gallery",
                  },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.to}
                      className={`text-sm text-foreground/80 hover:text-maroon flex items-center gap-1.5 transition ${dev}`}
                    >
                      <span className="text-gold font-bold">•</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ SECTION */}
      <section className="container mx-auto px-6 py-10 border-t border-gold/15">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 block ${dev}`}>
              {hi ? "सामान्य प्रश्न" : "Frequently Asked Questions"}
            </span>
            <h2 className={`font-display text-4xl md:text-5xl text-maroon ${dev}`}>
              {hi ? "जिज्ञासा और समाधान" : "Temple Q&A & Info"}
            </h2>
            <div className="mx-auto mt-4 w-24 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: hi
                ? "माँ विंध्यवासिनी मंदिर कहाँ स्थित है?"
                : "Where is Maa Vindhyavasini Temple located?",
              a: hi
                ? "माँ विंध्यवासिनी देवी का प्राचीन मंदिर उत्तर प्रदेश के मिर्जापुर जिले में पवित्र गंगा नदी के तट पर स्थित विंध्याचल धाम में है।"
                : "Maa Vindhyavasini Temple is located in Vindhyachal Dham, Mirzapur district, Uttar Pradesh, India, on the banks of the sacred river Ganges.",
            },
            {
              q: hi
                ? "त्रिकोण परिक्रमा का क्या महत्व है?"
                : "What is the significance of the Trikona Parikrama?",
              a: hi
                ? "त्रिकोण परिक्रमा विंध्याचल का एक अत्यंत पवित्र परिक्रमा पथ है जिसमें आदि शक्ति के तीन रूपों के दर्शन होते हैं: माँ विंध्यवासिनी (महालक्ष्मी), काली खोह में माँ काली (महाकाली) और अष्टभुजा मंदिर में माँ अष्टभुजा (महासरस्वती)।"
                : "Trikona Parikrama is a sacred pilgrimage circuit in Vindhyachal that includes visiting three key temples representing the three main forms of Adi Parashakti: Maa Vindhyavasini (Maha Lakshmi), Maa Kali at Kali Khoh (Maha Kali), and Maa Ashtabhuja (Maha Saraswati).",
            },
            {
              q: hi
                ? "नमामि विंध्यवासिनी संस्थान क्या है?"
                : "What is Namami Vindhyavasini Sansthan?",
              a: hi
                ? "नमामि विंध्यवासिनी संस्थान एक धार्मिक एवं आध्यात्मिक ट्रस्ट है जो भक्तों तक माँ विंध्यवासिनी की महिमा पहुँचाने, धार्मिक संसाधन, स्तोत्र और हिंदू कैलेंडर प्रकाशित करने के साथ-साथ मीडिया गैलरी, वीडियो और आध्यात्मिक संदेश प्रदान करने के लिए समर्पित है।"
                : "Namami Vindhyavasini Sansthan is a spiritual trust dedicated to spreading the divine message of Maa Vindhyavasini, publishing devotional resources, stotram, and the Hindu calendar, while also providing a media gallery, videos and spiritual sandesha.",
            },
          ].map((item, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100} duration={800}>
              <div className="p-6 rounded-2xl bg-card border border-gold/30 hover:border-gold/60 hover:shadow-sacred transition-premium">
                <h3
                  className={`font-semibold text-maroon text-base md:text-lg mb-2 flex items-start gap-2 ${dev}`}
                >
                  <span className="text-saffron font-bold">Q.</span>
                  {item.q}
                </h3>
                <p
                  className={`text-muted-foreground leading-relaxed text-sm md:text-base pl-6 ${dev}`}
                >
                  {item.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* POPULAR SACRED GUIDES & SHRINES (LINK JUICE / INTERLINKING SETUP) */}
      <section className="container mx-auto px-6 py-12 md:py-16 max-w-6xl">
        <ScrollReveal direction="up" duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`font-display text-2xl sm:text-3xl text-maroon ${dev}`}>
              {hi ? "लोकप्रिय तीर्थयात्रा मार्गदर्शिकाएँ" : "Popular Spiritual Shrines & Yatra Guides"}
            </h2>
            <p className={`text-muted-foreground text-sm mt-2 ${dev}`}>
              {hi
                ? "भारत के सबसे जागृत और प्रसिद्ध देव स्थानों की संपूर्ण मार्गदर्शिका, आरती, नियम और दूरी विवरण पढ़ें।"
                : "Explore detailed yatra guides, timing schedules, online bookings, and rituals for India's most sacred temples."}
            </p>
            <div className="mx-auto mt-4 w-20 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title_en: "Maa Vaishno Devi Yatra Guide",
              title_hi: "माँ वैष्णो देवी यात्रा मार्गदर्शिका",
              desc_en: "Complete guide on online yatra slip registration, helicopter tickets, and Ardhkuwari trek details.",
              desc_hi: "ऑनलाइन यात्रा पर्ची बुकिंग, हेलीकॉप्टर टिकट और अर्धकुंवारी गुफा मार्ग की पूरी जानकारी।",
              slug: "vaishno-devi-guide",
              img: vaishnoDeviImg,
              category: hi ? "शक्तिपीठ" : "Shakti Peeth",
            },
            {
              title_en: "Kedarnath Temple Trek & Travel",
              title_hi: "केदारनाथ धाम यात्रा गाइड",
              desc_en: "Detailed gaurikund to Kedarnath trek guide, biometric registration portal, and weather updates.",
              desc_hi: "गौरीकुंड से केदारनाथ १६ किमी ट्रेक मार्ग, आवश्यक बायोमेट्रिक रजिस्ट्रेशन और हेलीकॉप्टर बुकिंग।",
              slug: "kedarnath-temple-guide",
              img: kedarnathImg,
              category: hi ? "ज्योतिर्लिंग" : "Jyotirlinga",
            },
            {
              title_en: "Kashi Vishwanath Corridor & Aarti",
              title_hi: "काशी विश्वनाथ मंदिर और कॉरिडोर",
              desc_en: "Varanasi temple timings, Mangala Aarti booking passes, and details of the grand Ganga Corridor.",
              desc_hi: "बाबा विश्वनाथ की दैनिक आरती समय सारणी, मंगला आरती पास बुकिंग और गंगा कॉरिडोर दर्शन नियम।",
              slug: "kashi-vishwanath-guide",
              img: kashiVishwanathImg,
              category: hi ? "ज्योतिर्लिंग" : "Jyotirlinga",
            },
            {
              title_en: "Mahakaleshwar Ujjain Bhasma Aarti",
              title_hi: "महाकालेश्वर उज्जैन भस्म आरती",
              desc_en: "Dakshinmukhi Jyotirlinga daily darshan rules, Bhasma Aarti online booking and corridor guidelines.",
              desc_hi: "दक्षिणमुखी ज्योतिर्लिंग दर्शन नियम, प्रसिद्ध भस्म आरती ऑनलाइन बुकिंग और महाकाल लोक गाइड।",
              slug: "mahakaleshwar-temple-guide",
              img: mahakaleshwarImg,
              category: hi ? "ज्योतिर्लिंग" : "Jyotirlinga",
            },
          ].map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100} duration={800}>
              <Link
                to="/learn/$slug"
                params={{ slug: item.slug }}
                className="group relative rounded-3xl bg-card border border-border/50 hover:border-gold/60 hover:shadow-[0_15px_45px_rgba(212,175,55,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden shadow-sm hover:no-underline"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute bottom-3 left-4 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/45 border border-gold/30 text-cream ${dev}`}>
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className={`font-display text-base sm:text-lg text-maroon group-hover:text-saffron transition-colors mb-2 ${dev} line-clamp-1`}>
                      {hi ? item.title_hi : item.title_en}
                    </h3>
                    <p className={`text-muted-foreground text-xs leading-relaxed line-clamp-2 ${dev}`}>
                      {hi ? item.desc_hi : item.desc_en}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-saffron mt-4 flex items-center gap-1 group-hover:underline">
                    {hi ? "मार्गदर्शिका पढ़ें" : "Read Guide"} &rarr;
                  </span>
                </div>
              </Link>
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
              <div className="font-devanagari text-gold text-lg mb-3">
                {t("home.cta2.sanskrit")}
              </div>
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
                  className="px-7 py-3 rounded-full border-2 border-cream text-cream font-medium hover:bg-cream hover:text-maroon hover:scale-[1.03] transition-all duration-300 text-center"
                >
                  {hi ? "संपर्क करें" : "Contact Us"}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PWA OFFLINE APP DOWNLOAD */}
      <section className="container mx-auto px-6 pb-10">
        <ScrollReveal direction="up" duration={800}>
          <PWAInstallCard />
        </ScrollReveal>
      </section>
    </PageShell>
  );
}
