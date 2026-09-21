import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { Shield, Lock, Eye, FileText, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Read the official Privacy Policy of Namami Vindhyavasini Sansthan. Learn how we safeguard devotee information, handle donations, cookies, and protect your digital privacy.",
      },
      {
        name: "keywords",
        content:
          "Privacy Policy, Namami Vindhyavasini Sansthan, devotee data protection, cookie policy, temple donation security, Mirzapur, गोपनीयता नीति",
      },
      {
        property: "og:title",
        content: "Privacy Policy | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Official Privacy Policy of Namami Vindhyavasini Sansthan. Discover how we protect your personal information and privacy during your spiritual journey.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/privacy" },
      {
        property: "og:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Privacy Policy | Namami Vindhyavasini Sansthan" },
      {
        name: "twitter:description",
        content:
          "Discover how Namami Vindhyavasini Sansthan safeguards devotee privacy, manages online donations, and handles cookies.",
      },
      {
        name: "twitter:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.webp",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useLang();
  const isHi = lang === "hi";

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/privacy#webpage",
    url: "https://www.namamivindhyavasini.in/privacy",
    name: "Privacy Policy | Namami Vindhyavasini Sansthan",
    description: "Official Privacy Policy of Namami Vindhyavasini Sansthan.",
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
        name: isHi ? "गोपनीयता नीति" : "Privacy Policy",
        item: "https://www.namamivindhyavasini.in/privacy",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        badge={isHi ? "न्यास नीतियां" : "Trust Policies"}
        title={isHi ? "गोपनीयता नीति" : "Privacy Policy"}
        subtitle={
          isHi
            ? "नमामि विन्ध्यवासिनी संस्थान में आपकी व्यक्तिगत गोपनीयता एवं श्रद्धा की पवित्रता हमारी सर्वोच्च प्राथमिकता है।"
            : "At Namami Vindhyavasini Sansthan, your spiritual trust and personal data privacy are held with sacred responsibility."
        }
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-foreground/90">
        <div className="bg-card/70 border border-gold/20 rounded-2xl p-6 sm:p-10 shadow-sacred backdrop-blur-sm space-y-8 leading-relaxed">
          {/* Last Updated Notice */}
          <div className="flex flex-wrap items-center justify-between border-b border-gold/15 pb-4 text-xs text-muted-foreground gap-2">
            <span>{isHi ? "अंतिम अद्यतन: सितंबर 2026" : "Last Updated: September 2026"}</span>
            <span className="text-gold font-medium">
              {isHi
                ? "लागू नियम: भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम"
                : "Compliant with Digital Personal Data Protection Act (DPDP)"}
            </span>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Shield className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "1. हमारा परिचय एवं उद्देश्य" : "1. Introduction & Trust Identity"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "नमामि विन्ध्यवासिनी संस्थान (विन्ध्याचल धाम, मिर्जापुर, उत्तर प्रदेश) एक धार्मिक एवं सामाजिक न्यास है। यह वेबसाइट (namamivindhyavasini.in) भक्तों को माँ विन्ध्यवासिनी के दैनिक दर्शन, आरती, पंचांग, धार्मिक साहित्य तथा सेवा कार्य उपलब्ध कराने हेतु संचालित की जाती है।"
                : "Namami Vindhyavasini Sansthan (Vindhyachal Dham, Mirzapur, Uttar Pradesh) is a recognized religious and charitable trust. This official portal (namamivindhyavasini.in) is operated to provide devotees worldwide with authentic daily darshan, aarti updates, Hindu calendar timings, spiritual knowledge, and transparent seva opportunities."}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Eye className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "2. एकत्रित की जाने वाली जानकारी" : "2. Information We Collect"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "हम केवल वही आवश्यक जानकारी एकत्र करते हैं जो आपकी सेवा और भक्तिमय अनुभव हेतु अनिवार्य हो:"
                : "We collect only minimum necessary information essential to serve devotees and fulfill spiritual requests:"}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-foreground/80">
              <li>
                <strong>{isHi ? "स्वैच्छिक दान एवं संकल्प" : "Donations & E-Seva"}</strong>:{" "}
                {isHi
                  ? "भक्त का नाम, फोन नंबर, ईमेल एवं संकल्प गोत्र (यदि प्रदान किया जाए) ताकि रसीद और आशीर्वाद संप्रेषित किया जा सके।"
                  : "Devotee's name, phone number, email, and gotra for issuing receipts and offering prayers."}
              </li>
              <li>
                <strong>{isHi ? "संदेश एवं समीक्षाएं" : "Devotee Reviews & Sandesh"}</strong>:{" "}
                {isHi
                  ? "भक्तों द्वारा स्वेच्छा से प्रस्तुत किए गए अनुभव, समीक्षाएं और प्रार्थना संदेश।"
                  : "Testimonials, spiritual experiences, and prayer requests shared voluntarily by devotees."}
              </li>
              <li>
                <strong>{isHi ? "पुश नोटिफिकेशन" : "Web Push Notifications"}</strong>:{" "}
                {isHi
                  ? "यदि आप दैनिक आरती और पर्व सूचनाओं की अनुमति देते हैं, तो सुरक्षित ब्राउज़र टोकन संग्रहीत किया जाता है।"
                  : "With your consent, an encrypted browser push token is saved to deliver daily darshan and festival alerts."}
              </li>
              <li>
                <strong>{isHi ? "तकनीकी एवं कुकी जानकारी" : "Technical & Analytical Data"}</strong>:{" "}
                {isHi
                  ? "वेबसाइट के सुगम संचालन हेतु आईपी पता, डिवाइस प्रकार, एवं भाषा प्राथमिकता (कुकीज के माध्यम से)।"
                  : "IP address, browser type, preferred language, and anonymous analytics to maintain server stability."}
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <Lock className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "3. भुगतान सुरक्षा एवं दान" : "3. Payment Security & Financial Safety"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "सभी ऑनलाइन दान प्रत्यक्ष बैंक यूपीआई (UPI) अथवा भारतीय रिजर्व बैंक (RBI) द्वारा अधिकृत प्रमाणित पेमेंट गेटवे के माध्यम से संपन्न होते हैं। संस्थान आपके बैंक खाते, डेबिट/क्रेडिट कार्ड नंबर या पासवर्ड को कभी भी अपने सर्वर पर संग्रहीत नहीं करता।"
                : "All voluntary seva contributions and online donations are processed directly through UPI or RBI-authorized payment gateways. Namami Vindhyavasini Sansthan never stores credit/debit card numbers, UPI PINs, or net banking passwords on our servers."}
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <FileText className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "4. कुकीज़ नीति (Cookie Policy)" : "4. Cookie Usage & Preferences"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "हम आपकी भाषा प्राथमिकता (हिंदी/अंग्रेजी), ऑडियो प्लेयर की स्थिति, और ऑडियो वॉल्यूम को याद रखने के लिए स्थानीय भंडारण (localStorage) का उपयोग करते हैं। हम किसी भी तीसरे पक्ष के विज्ञापनदाताओं को आपका डेटा नहीं बेचते।"
                : "We utilize essential cookies and browser localStorage to remember your language preferences, audio player volume, and offline cache. We do not sell or monetize devotee data to third-party ad networks."}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display text-maroon flex items-center gap-2.5">
              <CheckCircle className="text-gold w-6 h-6 shrink-0" />
              {isHi ? "5. आपके अधिकार (Devotee Rights)" : "5. Devotee Privacy Rights"}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80">
              {isHi
                ? "डिजिटल व्यक्तिगत डेटा संरक्षण नियमों के अंतर्गत आपको अपनी व्यक्तिगत जानकारी की समीक्षा करने, सुधार करने अथवा उसे हटाने का अनुरोध करने का पूर्ण अधिकार है।"
                : "In accordance with data protection regulations, you retain full rights to inspect, update, or request the deletion of your contact records or submitted reviews at any time."}
            </p>
          </div>

          {/* Section 6: Grievance Officer */}
          <div className="border-t border-gold/20 pt-6 mt-8 space-y-4">
            <h3 className="text-lg font-display text-maroon">
              {isHi ? "शिकायत निवारण एवं संपर्क अधिकारी" : "Grievance Redressal & Contact Officer"}
            </h3>
            <p className="text-sm text-foreground/80">
              {isHi
                ? "यदि आपके पास इस नीति अथवा डेटा सुरक्षा से संबंधित कोई प्रश्न अथवा अनुरोध है, तो कृपया संपर्क करें:"
                : "If you have any questions or data removal requests regarding this Privacy Policy, please contact our administrative desk:"}
            </p>
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

          {/* Bottom Back Button */}
          <div className="pt-6 border-t border-gold/15 flex justify-between items-center flex-wrap gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-maroon text-cream text-sm font-medium hover:bg-maroon/90 shadow-md transition-all duration-300"
            >
              ← {isHi ? "मुख्य पृष्ठ पर लौटें" : "Return to Home"}
            </Link>
            <Link to="/terms" className="text-sm text-gold hover:underline font-medium">
              {isHi ? "नियम एवं शर्तें देखें →" : "View Terms of Service →"}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
