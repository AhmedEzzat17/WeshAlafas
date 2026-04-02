import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getDirection } from "../utils/translations";

/**
 * LanguageContext
 * Provides language state and direction (LTR / RTL) throughout the app.
 * Syncs with i18next so both systems stay in lockstep.
 */
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  // Initialize language from localStorage or default to English
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem("wash_lang") || "en";
    } catch {
      return "en";
    }
  });

  const direction = getDirection(locale);

  // Toggle between Arabic and English
  const toggleLanguage = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "ar" : "en";
      try {
        localStorage.setItem("wash_lang", next);
      } catch {
        // localStorage might be unavailable
      }
      // Sync i18next language
      i18n.changeLanguage(next);
      return next;
    });
  }, [i18n]);

  // Update the document direction and lang attribute when locale changes
  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", locale);
    // Sync i18next if needed (e.g. on first mount)
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, direction, i18n]);

  return (
    <LanguageContext.Provider value={{ locale, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to access language context.
 * @returns {{ locale: string, direction: string, toggleLanguage: () => void }}
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
