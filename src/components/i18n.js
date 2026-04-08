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
          type_message: "Type a message...",
          heading: "Build Your Future with AI-Powered Tools",
          subheading: "Transform your ideas into professional resumes and get insights instantly. Your career, accelerated by "
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
          type_message: "संदेश लिखें...",
          heading: "AI-संचालित टूल्स के साथ अपना भविष्य बनाएं",
          subheading: "अपने विचारों को दें एक प्रोफेशनल रूप और पाएं इंस्टेंट फीडबैक। आपके करियर को और भी आगे बढ़ाएगा "
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