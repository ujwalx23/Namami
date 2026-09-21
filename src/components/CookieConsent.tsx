import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LangProvider";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay for smooth entry after initial page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom event to reopen preferences anytime
  useEffect(() => {
    const handleReopen = () => setVisible(true);
    window.addEventListener("reopen-cookie-settings", handleReopen);
    return () => window.removeEventListener("reopen-cookie-settings", handleReopen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent", "all");
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("cookie_consent", "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-maroon/95 text-cream border border-gold/40 rounded-2xl p-5 shadow-sacred backdrop-blur-md relative overflow-hidden">
        {/* Sacred Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-sacred" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-gold font-display text-base">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
            <span>{t("cookie.title")}</span>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-cream/60 hover:text-cream transition-colors p-1 rounded-full cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-2.5 text-xs sm:text-sm text-cream/80 leading-relaxed">
          {t("cookie.desc")}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-2 border-t border-gold/20">
          <button
            onClick={handleAcceptAll}
            className="flex-1 min-w-[120px] px-4 py-2 rounded-full bg-gradient-sacred text-cream font-medium text-xs shadow-gold hover:opacity-95 active:scale-95 transition-all duration-300 text-center cursor-pointer"
          >
            {t("cookie.accept")}
          </button>
          <button
            onClick={handleEssentialOnly}
            className="px-3.5 py-2 rounded-full border border-gold/30 text-cream/90 hover:bg-gold/10 font-medium text-xs active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {t("cookie.necessary")}
          </button>
          <Link
            to="/privacy"
            onClick={() => setVisible(false)}
            className="text-xs text-gold/90 hover:text-gold underline underline-offset-2 ml-auto"
          >
            {t("cookie.policy")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
