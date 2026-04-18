/**
 * Language Context — Internationalization (i18n) management.
 *
 * Manages language state across the entire application using React Context API.
 * - LanguageProvider: Holds language state, persists to localStorage
 * - useLanguage(): Provides access to the current language from any component
 *
 * Usage:
 *   const { lang, t, toggleLang } = useLanguage();
 *   <p>{t.hero.ctaWork}</p>  // → "See My Work" or "İşlerimi Gör"
 *
 * Supported languages: "tr" (Turkish), "en" (English)
 * Translation dictionaries: lib/i18n/tr.ts and lib/i18n/en.ts
 */
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import tr, { type Dictionary } from "./tr";
import en from "./en";

export type Lang = "tr" | "en";

const dictionaries: Record<Lang, Dictionary> = { tr, en };

type LanguageContextValue = {
    lang: Lang;
    t: Dictionary;
    setLang: (l: Lang) => void;
    toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue>({
    lang: "tr",
    t: tr,
    setLang: () => { },
    toggleLang: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("tr");

    // Read from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("lang") as Lang | null;
        if (saved === "en" || saved === "tr") {
            setLangState(saved);
        }
    }, []);

    const setLang = useCallback((l: Lang) => {
        setLangState(l);
        localStorage.setItem("lang", l);
    }, []);

    const toggleLang = useCallback(() => {
        setLang(lang === "tr" ? "en" : "tr");
    }, [lang, setLang]);

    const t = dictionaries[lang];

    return (
        <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
