import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("lang") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          build: "Build",
          interview: "Interview Prep",
          news: "News",
          about: "About",
          contact: "Contact",
          profile: "Profile",
          welcome: "Welcome to Resume Builder",
          send: "Send",
          type_message: "Type a message..."
        }
      },
      hi: {
        translation: {
          home: "होम",
          build: "बनाएं",
          interview: "इंटरव्यू तैयारी",
          news: "समाचार",
          about: "के बारे में",
          contact: "संपर्क",
          profile: "प्रोफ़ाइल",
          welcome: "रिज़्यूमे बिल्डर में आपका स्वागत है",
          send: "भेजें",
          type_message: "संदेश लिखें..."
        }
      }
    },
    lng: savedLang, // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;