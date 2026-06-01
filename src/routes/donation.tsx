import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import qrImg from "@/assets/donation-qr.png";
import { Heart, Building2, Utensils, BookOpen, Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";

export const Route = createFileRoute("/donation")({
  head: () => ({
    meta: [
      { title: "Donation — Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Contribute to Maa Vindhyavasini's seva. Support temple upkeep, bhandara, vidya daan and other sacred causes.",
      },
      { property: "og:title", content: "Donate to Namami Vindhyavasini Sansthan" },
      {
        property: "og:description",
        content:
          "Your contribution helps us continue seva, satsang and sacred traditions at Vindhyachal Dham.",
      },
    ],
  }),
  component: DonationPage,
});

const causes: { icon: React.ComponentType<{ size?: number }>; tk: TKey; xk: TKey }[] = [
  { icon: Building2, tk: "don.cause.1.t", xk: "don.cause.1.x" },
  { icon: Utensils, tk: "don.cause.2.t", xk: "don.cause.2.x" },
  { icon: BookOpen, tk: "don.cause.3.t", xk: "don.cause.3.x" },
  { icon: Sparkles, tk: "don.cause.4.t", xk: "don.cause.4.x" },
];

function DonationPage() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  return (
    <PageShell>
      <PageHero sanskrit={t("don.sanskrit")} title={t("don.title")} subtitle={t("don.subtitle")} />

      <section className="w-full py-16 px-4 xs:px-6 flex justify-center">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-start justify-items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-2 sm:-inset-6 bg-gradient-sacred rounded-[2rem] blur-2xl sm:blur-3xl opacity-25" />
            <div className="relative bg-card border-2 border-gold/60 rounded-[2rem] p-5 xs:p-6 sm:p-8 shadow-sacred max-w-md mx-auto text-center flex flex-col items-center">
              <h3 className="font-display text-2xl text-maroon mb-1">Scan to Donate</h3>
              <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider">
                Secure UPI Payment
              </p>

              <div className="relative w-full max-w-[240px] aspect-square sm:w-64 sm:h-64 p-3 bg-white rounded-2xl shadow-md border border-border flex items-center justify-center mb-6">
                {/* Corner brackets/borders for visual scan effect */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-saffron rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-saffron rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-saffron rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-saffron rounded-br-lg" />

                <img
                  src={qrImg}
                  alt="UPI Donation QR Code"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="w-full space-y-3 bg-gradient-divine border border-gold/30 rounded-xl p-3 sm:p-4 text-left">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center text-sm border-b border-gold/20 pb-2 gap-1 xs:gap-0">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Verified UPI Name</span>
                  <span className="font-display text-maroon font-bold text-xs xs:text-sm">
                    Namami Vindhyavasini Sansthan
                  </span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center text-sm gap-1 xs:gap-0">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Verified UPI ID</span>
                  <span className="font-mono text-maroon font-bold text-xs xs:text-sm">9334339505@upi</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 italic">
                Scan with any UPI app (BHIM, Google Pay, PhonePe, Paytm, etc.) to complete your
                offering.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-md">
            <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
              {t("don.kicker")}
            </div>
            <h2 className={`font-display text-3xl sm:text-4xl text-maroon mb-5 ${dev}`}>{t("don.h2")}</h2>
            <p className={`text-foreground/80 leading-relaxed mb-6 max-w-md ${dev}`}>{t("don.text")}</p>

            {/* Trust badges and direct bank transfer section */}
            <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
              <div className="p-4 bg-card border border-border rounded-2xl text-center flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-[10px] font-bold text-maroon uppercase tracking-wider block">
                  Registered Trust
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">Govt Reg. 421/UP</span>
              </div>
              <div className="p-4 bg-card border border-border rounded-2xl text-center flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl mb-1">🤝</span>
                <span className="text-[10px] font-bold text-maroon uppercase tracking-wider block">
                  Direct Seva
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">100% Devotion Use</span>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-divine border border-gold/40 p-5 sm:p-6 shadow-sm w-full max-w-md">
              <h4 className="font-display text-lg text-maroon mb-4 flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xl">🏛️</span> Bank Transfer Details
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex flex-col xs:flex-row justify-between border-b border-gold/15 pb-2 gap-1 xs:gap-0">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium text-foreground text-left xs:text-right">
                    Namami Vindhyavasini Sansthan Trust
                  </span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between border-b border-gold/15 pb-2 gap-1 xs:gap-0">
                  <span className="text-muted-foreground">Bank Name</span>
                  <span className="font-medium text-foreground text-left xs:text-right">State Bank of India (SBI)</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between border-b border-gold/15 pb-2 gap-1 xs:gap-0">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono font-semibold text-foreground text-left xs:text-right">XXXX</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between border-b border-gold/15 pb-2 gap-1 xs:gap-0">
                  <span className="text-muted-foreground">IFSC Code</span>
                  <span className="font-mono font-semibold text-foreground text-left xs:text-right">XXXX</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between gap-1 xs:gap-0">
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium text-foreground text-left xs:text-right">Vindhyachal Branch</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-divine border border-gold/30 text-center shadow-sm w-full max-w-md">
              <div className="text-saffron font-devanagari text-lg font-bold mb-1">
                ॥ सेवा परमो धर्मः ॥
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "Service to others is the ultimate duty. Your support aids the temple's daily rituals,
                devotee feeding, and preservation of eternal values."
              </p>
            </div>

            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm w-full max-w-md text-left">
              <h4 className="font-display text-base text-maroon font-semibold">
                Important Notes for Donors
              </h4>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                <li>
                  Offerings are utilized exclusively for the temple operations, bhandara, and
                  community seva.
                </li>
                <li>
                  To request a transaction receipt or confirmation, email details to{" "}
                  <a
                    href="mailto:info@namamivindhyavasini.org"
                    className="text-maroon underline font-medium"
                  >
                    info@namamivindhyavasini.org
                  </a>
                  .
                </li>
                <li>QR code scans reflect instantly; direct bank transfers may take 24-48 hours.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <h2 className={`font-display text-3xl text-maroon text-center mb-10 ${dev}`}>
          {t("don.where")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {causes.map((c) => (
            <div
              key={c.tk}
              className="p-7 rounded-2xl bg-card border border-border hover:border-gold/60 hover:shadow-gold transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream mb-4">
                <c.icon size={20} />
              </div>
              <h3 className={`font-display text-xl text-maroon mb-2 ${dev}`}>{t(c.tk)}</h3>
              <p className={`text-sm text-muted-foreground leading-relaxed ${dev}`}>{t(c.xk)}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
