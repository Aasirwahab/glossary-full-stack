import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import ta from "./ta.json";
import ar from "./ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Set initial dir/lang on page load
const RTL_LANGS = ["ar"];
const setDocDir = (lng: string) => {
  document.documentElement.dir = RTL_LANGS.includes(lng) ? "rtl" : "ltr";
  document.documentElement.lang = lng;
};
setDocDir(i18n.language);
i18n.on("languageChanged", setDocDir);

export default i18n;
