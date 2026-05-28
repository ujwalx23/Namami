import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { translations, type Lang, type TKey } from "./translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TKey) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nv_lang") as Lang | null;
      if (saved === "en" || saved === "hi") setLangState(saved);
    } catch (error) {
      console.warn("LangProvider: failed to read nv_lang from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nv_lang", lang);
    } catch (error) {
      console.warn("LangProvider: failed to write nv_lang to localStorage", error);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((p) => (p === "en" ? "hi" : "en")), []);
  const t = useCallback(
    (key: TKey) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] ?? entry.en ?? key;
    },
    [lang],
  );

  return <LangCtx.Provider value={{ lang, setLang, toggle, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
