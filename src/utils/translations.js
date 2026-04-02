/**
 * Translations utility for Arabic/English internationalization.
 * Now powered by i18next — kept for backward compatibility with existing `t(locale, key)` calls.
 */
import en from "../locales/en.json";
import ar from "../locales/ar.json";

const translations = {
  en,
  ar,
};

/**
 * Get translation for a given key and locale.
 * Uses i18next under the hood but accepts the same (locale, key) signature
 * so existing code doesn't break.
 * @param {string} locale - 'en' or 'ar'
 * @param {string} key - translation key
 * @returns {string} translated string
 */
export const t = (locale, key) => {
  return translations[locale]?.[key] || key;
};

/**
 * Get the text direction for a given locale.
 * @param {string} locale - 'en' or 'ar'
 * @returns {string} 'ltr' or 'rtl'
 */
export const getDirection = (locale) => {
  return locale === "ar" ? "rtl" : "ltr";
};

export default translations;
