import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { learnContent } from "@/data/learnContent";
import {
  BookOpen,
  Calendar,
  Compass,
  FileText,
  MapPin,
  Music,
  Heart,
  Sparkles,
  Mountain,
  ArrowRight,
  ChevronRight,
  Clock,
  Compass as TravelIcon,
  BookMarked,
  CheckCircle,
} from "lucide-react";

import kaliKohImg from "@/assets/kali-koh.webp";
import ashtBhujaImg from "@/assets/asht-bhuja.webp";
import maaImg from "@/assets/maa-vindhyavasini.webp";
import maaImgSimhasan from "@/assets/maa-vindhyavasini-simhasan-shringar.webp";
import maaImgGarland from "@/assets/maa-vindhyavasini-garland-shringar.webp";
import maaImgNeel from "@/assets/maa-vindhyavasini-neel-shringar.webp";
import maaImgDevi from "@/assets/maa-vindhyavasini-devi-mirzapur.webp";
import maaImgShakti from "@/assets/maa-vindhyavasini-shakti-peeth.webp";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub" },
      {
        name: "description",
        content:
          "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, aarti, stotrams, and local travel plans.",
      },
      {
        name: "keywords",
        content:
          "Vindhyavasini guide, Vindhyachal hub, temple history cluster, ropeway timings, hotels near temple, aarti lyrics",
      },
      {
        property: "og:title",
        content: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub",
      },
      {
        property: "og:description",
        content:
          "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, and travel.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/learn" },
      {
        property: "og:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ultimate Maa Vindhyavasini Temple Guide" },
      {
        name: "twitter:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/learn" }],
  }),
  component: LearnIndexPage,
});

const categoryIcons: Record<string, any> = {
  History: BookOpen,
  Darshan: Sparkles,
  Travel: Compass,
  Festivals: Calendar,
  Aarti: Music,
  Chalisa: FileText,
  Mantras: Heart,
  Location: MapPin,
  Guide: Mountain,
};

function LearnSlider() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const [i, setI] = useState(0);

  const slides = [
    {
      img: maaImgSimhasan,
      title: hi ? "सिंहासन श्रृंगार" : "Maa Vindhyavasini Simhasan Shringar",
      caption: hi
        ? "स्वर्ण सिंहासन पर विराजमान जगत जननी माँ विंध्यवासिनी का दिव्य रूप।"
        : "Maa Vindhyavasini sitting on her golden lion throne (Simhasan) in Vindhyachal Dham.",
      alt: "Maa Vindhyavasini Simhasan Shringar Darshan",
    },
    {
      img: maaImgGarland,
      title: hi ? "पुष्प अलंकार श्रृंगार" : "Maa Vindhyavasini Garland Alankar",
      caption: hi
        ? "अलौकिक पुष्प मालाओं से सुसज्जित माँ विंध्यवासिनी देवी।"
        : "Goddess Vindhyavasini decorated with grand flower garlands during daily aarti.",
      alt: "Maa Vindhyavasini Garland Alankar",
    },
    {
      img: maaImgNeel,
      title: hi ? "नील पुष्प श्रृंगार" : "Maa Vindhyavasini Neel Shringar",
      caption: hi
        ? "नीले और लाल पुष्पों की दिव्य आभा में माँ विंध्यवासिनी।"
        : "Goddess Vindhyavasini adorned in the serene blue and red floral alankar.",
      alt: "Maa Vindhyavasini Neel Shringar",
    },
    {
      img: maaImgDevi,
      title: hi ? "विंध्यवासिनी देवी महाआरती" : "Maa Vindhyavasini Maha Aarti",
      caption: hi
        ? "आरती के पावन समय पर दिव्य दर्शन एवं ब्रह्मांडीय ऊर्जा का केंद्र।"
        : "Maa Vindhyavasini Devi during daily prayers and sacred ritual aarti.",
      alt: "Maa Vindhyavasini Maha Aarti",
    },
    {
      img: maaImgShakti,
      title: hi ? "शारदीय महाशक्तिपीठ" : "Maa Vindhyavasini Shakti Peeth",
      caption: hi
        ? "दुर्गा सप्तशती के अनुसार समस्त भयों का नाश करने वाली माँ।"
        : "Maa Vindhyavasini, the ultimate protector who shields all devotees from fear.",
      alt: "Maa Vindhyavasini Shakti Peeth",
    },
  ];

  useEffect(() => {
    const tm = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(tm);
  }, [slides.length]);

  return (
    <div className="relative aspect-[4/5] max-w-sm w-full mx-auto rounded-[2.5rem] overflow-hidden shadow-sacred border-4 border-gold/60 group">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.img}
            alt={slide.alt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none select-none"
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-center text-cream">
            <div className="font-display text-lg text-gold">{slide.title}</div>
            <div className="text-xs text-cream/90 mt-1 line-clamp-2">{slide.caption}</div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/45 px-3 py-1.5 rounded-full border border-gold/20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === i ? "w-6 bg-gold" : "w-1.5 bg-cream/60"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function LearnIndexPage() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";

  const topics = Object.values(learnContent);

  // Group topics by category
  const categories = Array.from(new Set(topics.map((t) => t.category)));

  const trikona = [
    {
      title_en: "Vindhyavasini Mandir",
      title_hi: "विन्ध्यवासिनी मंदिर",
      badge_en: "Maha Lakshmi Swaroop",
      badge_hi: "महालक्ष्मी स्वरूप",
      text_en: "Main shrine of the Devi as Maha Lakshmi / Yogmaya, situated on the bank of the Ganges.",
      text_hi: "मुख्य मंदिर जहाँ देवी गंगा तट पर महालक्ष्मी / योगमाया के रूप में विराजित हैं।",
      icon: Sparkles,
      img: maaImg,
      alt: "Maa Vindhyavasini Temple Swaroop Vindhyachal Dham",
      slug: "temple-history",
      imgClass: "object-top",
    },
    {
      title_en: "Kali Khoh Mandir",
      title_hi: "काली खोह मंदिर",
      badge_en: "Maha Kali Swaroop",
      badge_hi: "महाकाली स्वरूप",
      text_en: "Ancient cave shrine dedicated to Devi as Maha Kali, the slayer of Raktabeeja.",
      text_hi: "प्राचीन गुफा मंदिर जो रक्तबीज के संहारक रूप में देवी महाकाली को समर्पित है।",
      icon: Mountain,
      img: kaliKohImg,
      alt: "Kali Khoh Temple Swaroop Vindhyachal",
      slug: "kali-khoh-temple",
      imgClass: "object-center",
    },
    {
      title_en: "Ashtabhuja Devi Mandir",
      title_hi: "अष्टभुजा देवी मंदिर",
      badge_en: "Maha Saraswati Swaroop",
      badge_hi: "महासरस्वती स्वरूप",
      text_en: "Hilltop shrine dedicated to Devi as Maha Saraswati in her eight-armed form.",
      text_hi: "पर्वत-शिखर मंदिर जो अष्टभुज रूप में देवी महासरस्वती को समर्पित है।",
      icon: Compass,
      img: ashtBhujaImg,
      alt: "Ashtabhuja Devi Temple Swaroop Vindhyachal",
      slug: "ashtabhuja-devi-temple",
    },
  ];

  const scripturalQuote = hi
    ? {
        sanskrit: "॥ विन्ध्यशैले स्थिता देवि विन्ध्यवासिनि नमोऽस्तु ते ॥",
        translation: "“विन्ध्य पर्वत पर निवास करने वाली हे देवी विन्ध्यवासिनी! आपको बारम्बार नमस्कार है।”",
        source: "— श्री दुर्गा सप्तशती",
      }
    : {
        sanskrit: "॥ विन्ध्यशैले स्थिता देवि विन्ध्यवासिनि नमोऽस्तु ते ॥",
        translation: "“O Goddess who resides in the Vindhya hills, salutations to Thee, Vindhyavasini!”",
        source: "— Sri Durga Saptashati",
      };

  const travelSteps = [
    {
      step: "01",
      title_en: "Choose Travel Route",
      title_hi: "यात्रा मार्ग चुनें",
      desc_en: "Explore options for flight, train, or road travel based on distances.",
      desc_hi: "दूरियों के अनुसार हवाई, रेल या सड़क मार्ग की सुविधाओं का अध्ययन करें।",
      icon: TravelIcon,
      slug: "how-to-reach",
    },
    {
      step: "02",
      title_en: "Review Temple Timings",
      title_hi: "दर्शन का समय देखें",
      desc_en: "Verify the daily Aarti schedules and plan your arrival times.",
      desc_hi: "दैनिक आरतियों और शृंगार के समय की सही जानकारी प्राप्त करें।",
      icon: Clock,
      slug: "temple-timings",
    },
    {
      step: "03",
      title_en: "Chant Beej Mantras",
      title_hi: "मंत्र साधना जानें",
      desc_en: "Learn powerful Beej and Gayatri mantras of Maa Vindhyavasini and their benefits.",
      desc_hi: "माँ विन्ध्यवासिनी के सिद्ध बीज मंत्रों और साधना विधि के बारे में जानें।",
      icon: Heart,
      slug: "maa-vindhyavasini-mantra",
    },
    {
      step: "04",
      title_en: "Explore Surroundings",
      title_hi: "त्रिकोण परिक्रमा करें",
      desc_en: "Explore Trikona Parikrama, hotels, waterfalls, and local crafts.",
      desc_hi: "त्रिकोण परिक्रमा के अन्य दो मंदिरों, होटलों और झरनों की यात्रा करें।",
      icon: BookMarked,
      slug: "tourism-guide",
    },
  ];

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/learn#webpage",
    url: "https://www.namamivindhyavasini.in/learn",
    name: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub",
    description:
      "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, aarti, stotrams, and local travel plans.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      url: "https://www.namamivindhyavasini.in",
    },
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Hub",
        item: "https://www.namamivindhyavasini.in/learn",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        compact
        sanskrit="॥ ज्ञानं परं ध्येयम् ॥"
        title={hi ? "माँ विन्ध्यवासिनी ज्ञान हब" : "Vindhyavasini Knowledge Hub"}
        subtitle={
          hi
            ? "विन्ध्याचल धाम, मंदिर इतिहास, दर्शन नियम, मार्ग, और चालीसा का संपूर्ण प्रामाणिक संग्रह"
            : "The ultimate guide to Maa Vindhyavasini Temple history, timings, routes, mantras, and local travels"
        }
      />

      {/* DETAILED INTRO SECTION WITH SLIDER */}
      <ScrollReveal direction="up" duration={800} delay={100}>
        <section className="bg-gradient-divine border-y border-border/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_100%)] pointer-events-none" />
          <div className="container mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center max-w-6xl">
            <div className="lg:col-span-5 w-full flex justify-center">
              <LearnSlider />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-gradient-to-r from-saffron to-gold rounded-full" />
                <span className={`text-xs uppercase tracking-[0.2em] font-bold text-saffron ${dev}`}>
                  {hi ? "सनातन ज्ञान केंद्र" : "Sanatan Knowledge Center"}
                </span>
              </div>
              <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl text-maroon ${dev}`}>
                {hi ? "विन्ध्याचल धाम तीर्थयात्रा ज्ञानकोश" : "Vindhyachal Dham Pilgrimage Encyclopedia"}
              </h2>
              <p className={`text-foreground/85 leading-relaxed text-sm sm:text-base md:text-lg ${dev}`}>
                {hi
                  ? "नमामि विन्ध्यवासिनी संस्थान के इस पावन ज्ञान केंद्र में आपका स्वागत है। यह ज्ञानकोश माँ विन्ध्यवासिनी के दिव्य महात्म्य, पुराणों में उनके अवतरण, दैनिक चार आरतियों के समय, चालीसा पाठ विधि और त्रिकोण परिक्रमा की संपूर्ण जानकारियों से युक्त है। हमारा उद्देश्य प्रत्येक श्रद्धालु को प्रामाणिक शास्त्रोक्त संदर्भ और सुरक्षित तीर्थयात्रा के लिए हर आवश्यक जानकारी प्रदान करना है।"
                  : "Welcome to the sacred knowledge center of Namami Vindhyavasini Sansthan. This hub is built to provide devotees worldwide with authentic scriptural references and practical insights on Maa Vindhyavasini's history, local rules, daily timing charts, and ritual prayers. Whether you are planning your first trip or looking to read the hymns at home, this encyclopedia serves as your divine guide."}
              </p>
              
              {/* Scriptural Quote Block */}
              <div className="p-4 sm:p-5 rounded-2xl bg-card/60 backdrop-blur border-l-4 border-gold/80 border border-border space-y-2 relative shadow-sm">
                <p className="font-devanagari text-base md:text-lg text-maroon text-center font-semibold leading-relaxed">
                  {scripturalQuote.sanskrit}
                </p>
                <p className={`text-xs sm:text-sm text-muted-foreground text-center italic leading-relaxed ${dev}`}>
                  {scripturalQuote.translation}
                </p>
                <p className="text-right text-[10px] font-semibold text-saffron tracking-wider">
                  {scripturalQuote.source}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SACRED TRIKONA PARIKRAMA */}
      <section className="container mx-auto px-6 py-12 md:py-16 max-w-6xl">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`font-display text-2xl sm:text-3xl text-maroon ${dev}`}>
              {hi ? "पावन त्रिकोण परिक्रमा क्षेत्र" : "The Sacred Trikona Parikrama"}
            </h2>
            <p className={`text-muted-foreground text-sm mt-2 ${dev}`}>
              {hi
                ? "विन्ध्याचल का आध्यात्मिक केंद्र तीन देवियों के स्वरूपों से निर्मित पावन त्रिकोण पर आधारित है, जिनकी परिक्रमा करने से समस्त कामनाएं पूर्ण होती हैं।"
                : "Vindhyachal's geometry is formed by a unique triangle connecting three powerful temples representing the Maha Trishakti."}
            </p>
            <div className="mx-auto mt-4 w-20 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {trikona.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100} duration={700}>
              <Link
                to="/learn/$slug"
                params={{ slug: item.slug }}
                className="group relative rounded-3xl bg-card border border-border/50 hover:border-gold/60 hover:shadow-[0_15px_45px_rgba(212,175,55,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden shadow-sm cursor-pointer hover:no-underline block"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.imgClass || "object-center"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-cream">
                    <div className="w-8 h-8 rounded-lg bg-gradient-sacred flex items-center justify-center">
                      <item.icon size={16} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/45 border border-gold/30 ${dev}`}>
                      {hi ? item.badge_hi : item.badge_en}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className={`font-display text-lg sm:text-xl text-maroon group-hover:text-saffron transition-colors mb-2 ${dev}`}>
                      {hi ? item.title_hi : item.title_en}
                    </h3>
                    <p className={`text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 ${dev}`}>
                      {hi ? item.text_hi : item.text_en}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron group-hover:text-maroon transition-colors">
                    <span>{hi ? "मार्गदर्शिका पढ़ें" : "Read Guide"}</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TRIP PLANNER CHECKLIST */}
      <section className="bg-gradient-divine border-y border-border/60 py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal direction="up" duration={800}>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className={`font-display text-2xl sm:text-3xl text-maroon ${dev}`}>
                {hi ? "तीर्थयात्रा कैसे व्यवस्थित करें?" : "How to Plan Your Pilgrimage"}
              </h2>
              <p className={`text-muted-foreground text-sm mt-2 ${dev}`}>
                {hi
                  ? "इन चार आसान चरणों का पालन कर विन्ध्याचल धाम की अपनी यात्रा को व्यवस्थित और सुरक्षित बनाएं।"
                  : "Follow these four steps to coordinate a comfortable and spiritually aligned journey to the Dham."}
              </p>
              <div className="mx-auto mt-4 w-20 h-[2px] bg-gradient-sacred rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 80} duration={700}>
                  <Link
                    to="/learn/$slug"
                    params={{ slug: step.slug }}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-gold/40 hover:shadow-gold transition-all duration-300 flex flex-col justify-between h-full cursor-pointer hover:no-underline group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-display text-3xl font-extrabold text-gold/30 group-hover:text-gold/60 transition-colors">
                          {step.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-gradient-sacred/10 text-saffron flex items-center justify-center">
                          <StepIcon size={20} />
                        </div>
                      </div>
                      <h4 className={`font-display text-base text-maroon group-hover:text-saffron transition-colors mb-2 ${dev}`}>
                        {hi ? step.title_hi : step.title_en}
                      </h4>
                      <p className={`text-muted-foreground text-xs leading-relaxed ${dev}`}>
                        {hi ? step.desc_hi : step.desc_en}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-saffron mt-4 flex items-center gap-1 group-hover:underline">
                      {hi ? "विवरण देखें" : "View Details"} &rarr;
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPLORE ALL SUBJECT TOPICS */}
      <section className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`font-display text-2xl sm:text-3xl text-maroon ${dev}`}>
              {hi ? "विषय अनुसार संपूर्ण ज्ञानकोश" : "Explore Topics by Category"}
            </h2>
            <p className={`text-muted-foreground text-sm mt-2 ${dev}`}>
              {hi
                ? "माँ विन्ध्यवासिनी के दिव्य इतिहास, आरती, मंत्र, और विन्ध्याचल धाम की तीर्थयात्रा से जुड़े हर सवाल का जवाब प्राप्त करें।"
                : "Find detailed scriptural context, lyrics of aartis, local location guides, and practical travel tips."}
            </p>
            <div className="mx-auto mt-4 w-20 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {categories.map((category) => {
            const catTopics = topics.filter((t) => t.category === category);
            const Icon = categoryIcons[category] || BookOpen;

            return (
              <div key={category} className="space-y-6">
                <ScrollReveal direction="up" duration={700}>
                  <div className="flex items-center gap-3 border-b border-gold/30 pb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-sacred/10 text-saffron flex items-center justify-center shadow-inner">
                      <Icon size={20} />
                    </div>
                    <h3 className={`font-display text-xl sm:text-2xl text-maroon ${dev}`}>
                      {category}
                    </h3>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTopics.map((topic, idx) => (
                    <ScrollReveal key={topic.slug} direction="up" delay={idx * 80} duration={700}>
                      <Link
                        to="/learn/$slug"
                        params={{ slug: topic.slug }}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-card border border-gold/25 hover:border-gold hover:shadow-gold transition-all duration-300 h-full cursor-pointer hover:no-underline"
                        id={`link-${topic.slug}`}
                      >
                        <div>
                          <h4
                            className={`font-display text-base sm:text-lg text-maroon group-hover:text-saffron transition-colors mb-2 ${dev}`}
                          >
                            {hi ? topic.title_hi : topic.title_en}
                          </h4>
                          <p
                            className={`text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed ${dev}`}
                          >
                            {hi ? topic.metaDesc_hi : topic.metaDesc_en}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-border/40 mt-4 flex justify-end items-center text-xs font-semibold text-maroon group-hover:text-saffron transition-colors">
                          <span>{hi ? "पढ़ें" : "Read Article"} &rarr;</span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
