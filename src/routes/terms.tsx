import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import {
  Scale,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Copyright,
  Gavel,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Read the official Terms of Service of Namami Vindhyavasini Sansthan. Guidelines for sacred seva offerings, devotional media usage, and website services.",
      },
      {
        name: "keywords",
        content:
          "Terms of Service, Namami Vindhyavasini Sansthan, temple donation terms, seva rules, media copyright, Vindhyachal Dham, नियम एवं शर्तें",
      },
      {
        property: "og:title",
        content: "Terms of Service | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Official Terms and Conditions for visiting and utilizing services on Namami Vindhyavasini Sansthan portal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/terms" },
      {
        property: "og:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Terms of Service | Namami Vindhyavasini Sansthan" },
      {
        name: "twitter:description",
        content:
          "Official terms of use for devotional services, e-seva, and sacred content of Namami Vindhyavasini Sansthan.",
      },
      {
        name: "twitter:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { lang } = useLang();
  const isHi = lang === "hi";

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/terms#webpage",
    url: "https://www.namamivindhyavasini.in/terms",
    name: "Terms of Service | Namami Vindhyavasini Sansthan",
    description: "Official Terms of Service and guidelines for Namami Vindhyavasini Sansthan.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      name: "Namami Vindhyavasini Sansthan",
      url: "https://www.namamivindhyavasini.in/",
    },
    inLanguage: isHi ? "hi-IN" : "en-US",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isHi ? "होम" : "Home",
        item: "https://www.namamivindhyavasini.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isHi ? "नियम एवं शर्तें" : "Terms of Service",
        item: "https://www.namamivindhyavasini.in/terms",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        badge={isHi ? "न्यास दिशानिर्देश" : "Sansthan Guidelines"}
        title={isHi ? "नियम एवं शर्तें" : "Terms of Service"}
        subtitle={
          isHi
            ? "नमामि विन्ध्यवासिनी संस्थान की सेवाओं एवं पावन सामग्री के उपयोग हेतु नियम व शर्तें।"
            : "Terms governing the respectful use of devotional services, digital media, and offerings of Namami Vindhyavasini Sansthan."
        }
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-foreground/90">
        <div className="bg-card/70 border border-gold/20 rounded-2xl p-6 sm:p-10 shadow-sacred backdrop-blur-sm space-y-8 leading-relaxed">
          {/* Last Updated */}
          <div className="flex flex-wrap items-center justify-between border-b border-gold/15 pb-4 text-xs text-muted-foreground gap-2">
            <span>{isHi ? "प्रभावी तिथि: सितंबर 2026" : "Effective Date: September 2026"}</span>
            <span className="text-gold font-medium">
              {isHi
                ? "अधिकार क्षेत्र: मिर्जापुर, उत्तर प्रदेश (भारत)"
                : "Jurisdiction: Mirzapur, Uttar Pradesh (India)"}
            </span>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Scale className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "1. नियमों की स्वीकृति" : "1. Acceptance of Sacred Terms"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "इस वेबसाइट (namamivindhyavasini.in) का उपयोग करके आप नमामि विन्ध्यवासिनी संस्थान द्वारा निर्धारित इन नियमों व शर्तों से पूर्णतः सहमत होते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया पोर्टल का उपयोग न करें।"
                : "By accessing and using this portal (namamivindhyavasini.in), you acknowledge and agree to comply with these Terms of Service. These terms are established to maintain the sanctity, legal compliance, and devotional purpose of Namami Vindhyavasini Sansthan."}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Copyright className="text-gold w-6 h-6 shrink-0" />
              {isHi
                ? "2. पावन सामग्री एवं सर्वाधिकार"
                : "2. Sacred Content & Intellectual Property"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "वेबसाइट पर प्रकाशित माँ विन्ध्यवासिनी के दिव्य श्रृंगार दर्शन, छायाचित्र, ऑडियो रिकॉर्डिंग, लेख एवं आरती स्तुतियां भक्तों की व्यक्तिगत पूजा एवं साधना हेतु उपलब्ध हैं। किसी भी व्यावसायिक उद्देश्य, अनधिकृत पुनर्विक्रय अथवा अनुचित प्रयोग हेतु सामग्री का उपयोग पूर्णतः वर्जित है।"
                : "All visual darshan photographs, sacred chants, audio recordings, articles, and devotional content hosted on this site are protected by copyright. They are made freely accessible for personal devotion and spiritual worship. Commercial exploitation, unauthorized resale, or inappropriate reproduction is strictly prohibited."}
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <HeartHandshake className="text-gold w-6 h-6 shrink-0" />
              {isHi
                ? "3. स्वैच्छिक दान एवं धार्मिक सेवा संकल्प"
                : "3. Voluntary Seva Offerings & Donations"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "संस्थान को अर्पित किया जाने वाला समस्त दान स्वैच्छिक एवं धार्मिक संकल्प स्वरूप है। यह राशि मंदिर व्यवस्था, नित्य भंडारा, गौ सेवा, संस्कृत पाठशाला एवं धर्मार्थ कार्यों में व्यय की जाती है। धार्मिक नियमों के अनुरूप अर्पित दान की वापसी (refund) स्वीकार्य नहीं है।"
                : "All contributions, dakshina, and e-puja seva offerings made to Namami Vindhyavasini Sansthan are voluntary religious contributions dedicated to temple seva, daily prasad bhandara, Gau Seva, and dharmic community welfare. In accordance with standard religious practices, offerings once confirmed cannot be cancelled or refunded."}
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Sparkles className="text-gold w-6 h-6 shrink-0" />
              {isHi
                ? "4. पंचांग एवं धार्मिक समय सारिणी"
                : "4. Hindu Panchang & Astrological Schedules"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "पोर्टल पर प्रदर्शित पंचांग, एकादशी, पूर्णिमा एवं आरती का समय मानक वैदिक गणनाओं तथा विन्ध्याचल धाम की स्थानीय मंदिर परंपरा पर आधारित है। भौगोलिक अक्षांश एवं स्थानीय मान्यताओं के अनुसार कुछ मिनटों का अंतर संभव है।"
                : "Festival dates, tithis, vrat schedules, and aarti timings presented on our Hindu Calendar are computed according to orthodox astronomical algorithms and local tradition at Vindhyachal Dham. Minor regional variations of a few minutes may exist depending on geographical coordinates and local sampradaya."}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <ShieldAlert className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "5. आचरण एवं समीक्षा दिशानिर्देश" : "5. Devotee Reviews & Community Conduct"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "भक्त समीक्षाएं अथवा संदेश प्रस्तुत करते समय विनम्र, मर्यादित एवं भक्तिपूर्ण भाषा का प्रयोग करें। किसी भी प्रकार की अभद्र टिप्पणी, भ्रामक प्रचार अथवा अवांछित लिंक को संस्थान द्वारा तत्काल हटाने का अधिकार सुरक्षित है।"
                : "Devotees participating in reviews, feedback, or prayer messages must maintain courteous, respectful, and devotional language. Namami Vindhyavasini Sansthan reserves full discretion to moderate or remove inappropriate, offensive, or promotional submissions."}
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Gavel className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "6. विधिक अधिकार क्षेत्र" : "6. Governing Law & Jurisdiction"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "ये नियम व शर्तें भारतीय विधियों के अनुसार शासित हैं। किसी भी विवाद की स्थिति में केवल मिर्जापुर, उत्तर प्रदेश (भारत) के न्यायालयों का ही अनन्य क्षेत्राधिकार होगा।"
                : "These terms are governed by and construed in accordance with the laws of India. Any legal dispute or interpretation arising from the website or activities shall fall under the exclusive jurisdiction of the competent courts in Mirzapur, Uttar Pradesh, India."}
            </p>
          </div>

          {/* Contact Details */}
          <div className="border-t border-gold/20 pt-6 mt-8 space-y-4">
            <h3 className="text-lg font-display text-maroon">
              {isHi ? "संस्थान कार्यालय एवं संपर्क" : "Sansthan Office & Assistance"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2 text-foreground/80">
                <MapPin className="text-gold w-4 h-4 shrink-0" />
                <span>Vindhyachal Dham, Mirzapur, UP - 231307</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <Phone className="text-gold w-4 h-4 shrink-0" />
                <a href="tel:+919334339505" className="hover:text-gold transition-colors">
                  +91 93343 39505
                </a>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <Mail className="text-gold w-4 h-4 shrink-0" />
                <a
                  href="mailto:contact@namamivindhyavasini.in"
                  className="hover:text-gold transition-colors"
                >
                  contact@namamivindhyavasini.in
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-6 border-t border-gold/15 flex justify-between items-center flex-wrap gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-maroon text-cream text-sm font-medium hover:bg-maroon/90 shadow-md transition-all duration-300"
            >
              ← {isHi ? "मुख्य पृष्ठ पर लौटें" : "Return to Home"}
            </Link>
            <Link to="/privacy" className="text-sm text-gold hover:underline font-medium">
              {isHi ? "गोपनीयता नीति देखें →" : "View Privacy Policy →"}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
