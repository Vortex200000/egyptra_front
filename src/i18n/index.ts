// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

// // Import your translation files

// const resources = {
//   en: {
//     translation: enTranslations,
//   },
//   it: {
//     translation: itTranslations,
//   },
// };

// i18n
//   .use(LanguageDetector) // Detects user language
//   .use(initReactI18next) // Passes i18n down to react-i18next
//   .init({
//     resources,
//     lng: "en", // Default language
//     fallbackLng: "en", // Fallback language

//     // Allow keys to be phrases having `:`, `.`
//     keySeparator: false,

//     // Allow keys to be phrases having `{{variable}}`
//     interpolation: {
//       escapeValue: false, // React already does escaping
//     },

//     // Language detection options
//     detection: {
//       order: ["localStorage", "navigator", "htmlTag"],
//       lookupLocalStorage: "i18nextLng",
//       caches: ["localStorage"],
//     },
//   });
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation.json";
import itTranslations from "./locales/it/translation.json";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
const resources = {
  en: {
    translation: enTranslations,
  },
  it: {
    translation: itTranslations,
  },
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    resources,
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
