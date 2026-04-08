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
          subheading: "Transform your ideas into professional resumes and get insights instantly. Your career, accelerated by ",
          get_in_touch: "Get in Touch",
          contact_subtext: "Have questions about ResumeBuild? Our team is here to help you accelerate your career journey.",
          your_name: "Your Name",
          email_address: "Email Address",
          message_label: "Message",
          send_message: "Send Message",
          message_sent: "MESSAGE SENT!",
          name_placeholder: "John Doe",
          email_placeholder: "john@example.com",
          message_placeholder: "How can we help you today?",
          privacy_text: "Privacy Guaranteed — No Data Sharing"
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
          subheading: "अपने विचारों को दें एक प्रोफेशनल रूप और पाएं इंस्टेंट फीडबैक। आपके करियर को और भी आगे बढ़ाएगा ",
          get_in_touch: "संपर्क करें",
          contact_subtext: "रिज़्यूमे बिल्डर के बारे में प्रश्न हैं? हमारी टीम आपके करियर की यात्रा को तेज करने में आपकी मदद करने के लिए यहाँ है।",
          your_name: "आपका नाम",
          email_address: "ईमेल पता",
          message_label: "संदेश",
          send_message: "संदेश भेजें",
          message_sent: "संदेश भेजा गया!",
          name_placeholder: "आपका नाम यहाँ लिखें",
          email_placeholder: "email@example.com",
          message_placeholder: "हम आज आपकी कैसे मदद कर सकते हैं?",
          privacy_text: "गोपनीयता की गारंटी — कोई डेटा साझा नहीं"
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