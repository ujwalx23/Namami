import { Outlet, Link, createRootRoute, HeadContent } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LangProvider, useLang } from "@/i18n/LangProvider";
import { AudioProvider } from "@/lib/AudioContext";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { InboxProvider } from "@/lib/InboxContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { Home, Compass, Calendar, Sparkles, PhoneCall } from "lucide-react";

function NotFoundContent() {
  const { lang, t } = useLang();
  const isHi = lang === "hi";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-divine px-4 py-12 text-center relative overflow-hidden">
      {/* Sacred Rotating Mandala Background */}
      <div className="absolute inset-0 mandala-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-card/85 backdrop-blur-md border border-gold/30 rounded-3xl p-8 sm:p-10 shadow-sacred">
        {/* Sacred Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-sacred flex items-center justify-center shadow-gold animate-gold-breath">
          <span className="text-cream font-display text-2xl sm:text-3xl">ॐ</span>
        </div>

        <div className="mt-4 font-devanagari text-xs sm:text-sm text-gold tracking-widest uppercase">
          {isHi ? "॥ जय माँ विन्ध्यवासिनी ॥" : "॥ JAI MAA VINDHYAVASINI ॥"}
        </div>

        <h1 className="mt-2 text-6xl sm:text-7xl font-bold font-display text-maroon tracking-tight">
          404
        </h1>

        <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-foreground">
          {t("notFound.title")}
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {t("notFound.desc")}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-sacred px-6 py-2.5 text-sm font-medium text-cream shadow-gold hover:opacity-95 transition-all duration-300"
          >
            <Home size={16} />
            {t("notFound.goHome")}
          </Link>
          <Link
            to="/sandesh"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-medium text-maroon hover:bg-gold/10 transition-all duration-300"
          >
            <Sparkles size={16} className="text-gold" />
            {t("notFound.darshan")}
          </Link>
        </div>

        {/* Quick Route Links */}
        <div className="mt-8 pt-6 border-t border-gold/20">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            {isHi ? "लोकप्रिय पावन अनुभाग" : "Popular Sacred Destinations"}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-maroon/5 hover:bg-maroon/15 text-foreground transition-colors"
            >
              <Compass size={13} className="text-gold" />
              {isHi ? "त्रिकोण परिक्रमा" : "Trikona Parikrama"}
            </Link>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-maroon/5 hover:bg-maroon/15 text-foreground transition-colors"
            >
              <Calendar size={13} className="text-gold" />
              {isHi ? "पंचांग व कैलेंडर" : "Calendar & Vrats"}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-maroon/5 hover:bg-maroon/15 text-foreground transition-colors"
            >
              <PhoneCall size={13} className="text-gold" />
              {isHi ? "संपर्क" : "Contact Desk"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <LangProvider>
      <NotFoundContent />
    </LangProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <InboxProvider>
          <AudioProvider>
            {/* Accessible Skip to Main Content Link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-maroon focus:text-cream focus:rounded-full focus:shadow-gold focus:border focus:border-gold focus:font-medium focus:text-sm"
            >
              Skip to main content / मुख्य सामग्री पर जाएं
            </a>
            <HeadContent />
            <Outlet />
            <FloatingPlayer />
            <CookieConsent />
            <Toaster richColors position="top-center" />
          </AudioProvider>
        </InboxProvider>
      </LangProvider>
    </ErrorBoundary>
  );
}
