import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import maaImg from "@/assets/maa-vindhyavasini.png";
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

      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-sacred rounded-[2rem] blur-3xl opacity-25" />
          <div className="relative aspect-[3/4] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60">
            <img
              src={maaImg}
              alt="Maa Vindhyavasini divine darshan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
            <div className="absolute bottom-6 left-6 right-6 text-center text-cream">
              <div className="font-devanagari text-gold text-sm">श्री विन्ध्यवासिन्यै नमः</div>
              <div className={`font-display text-2xl mt-1 ${dev}`}>{t("don.bless")}</div>
            </div>
          </div>
        </div>

        <div>
          <div className={`text-saffron text-xs uppercase tracking-[0.3em] mb-2 ${dev}`}>
            {t("don.kicker")}
          </div>
          <h2 className={`font-display text-4xl text-maroon mb-5 ${dev}`}>{t("don.h2")}</h2>
          <p className={`text-foreground/80 leading-relaxed mb-6 ${dev}`}>{t("don.text")}</p>

          <div className="rounded-2xl bg-gradient-divine border border-gold/40 p-6 mb-6">
            <div className={`text-xs uppercase tracking-[0.25em] text-saffron mb-2 ${dev}`}>
              {t("don.quick")}
            </div>
            <div className={`text-sm text-foreground/80 mb-1 ${dev}`}>{t("don.quick.bank")}</div>
            <div className="font-display text-xl text-maroon">
              <a href="tel:+919334339505">+91 93343 39505</a>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              <a href="mailto:info@namamivindhyavasini.org">info@namamivindhyavasini.org</a>
            </div>
          </div>

          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition ${dev}`}
          >
            <Heart size={16} /> {t("don.contactbtn")}
          </Link>
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
