import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./resources/fr.json";
import en from "./resources/en.json";

const DEFAULT_LOCALE =
  import.meta.env.VITE_I18N_DEFAULT_LOCALE || "fr";
const FALLBACK_LOCALE =
  import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: FALLBACK_LOCALE,
    lng: DEFAULT_LOCALE,
    supportedLngs: ["fr", "en"],
    interpolation: { escapeValue: false },
    detection: {
      // ordre de détection
      order: ["localStorage", "navigator", "htmlTag"],
      // clé de stockage
      lookupLocalStorage: "walletwiz-lang",
      // on utilise localStorage
      caches: ["localStorage"]
    }
  });

export default i18n;