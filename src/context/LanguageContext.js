// AI-assisted: see docs/AI_LOG.md #31
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";
import { translate, LOCALE } from "../i18n/strings";

const KEY = "language";
const LanguageContext = createContext(null);

// App language (es / en). It is a preference, so it is saved in AsyncStorage
// (never sensitive data) and in the driver profile in Firestore.
export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState("es");

  // 1. Last language used on this phone (also applies to the Login screen)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "es" || v === "en") setLanguageState(v);
    });
  }, []);

  // 2. When the driver signs in, use the language chosen in the profile
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    getDoc(doc(db, "drivers", user.uid))
      .then((snap) => {
        const lang = snap.data()?.personal?.language;
        if (!ignore && (lang === "es" || lang === "en")) {
          setLanguageState(lang);
          AsyncStorage.setItem(KEY, lang).catch(() => {});
        }
      })
      .catch((e) => console.log(e.code));
    return () => {
      ignore = true;
    };
  }, [user]);

  const setLanguage = useCallback(
    (lang) => {
      setLanguageState(lang);
      AsyncStorage.setItem(KEY, lang).catch(() => {});
      if (user)
        updateDoc(doc(db, "drivers", user.uid), {
          "personal.language": lang,
        }).catch((e) => console.log(e.code));
    },
    [user],
  );

  const value = useMemo(() => {
    const locale = LOCALE[language];
    return {
      language,
      locale,
      setLanguage,
      t: (key, params) => translate(language, key, params),
      // Whole Colombian pesos
      money: (n) =>
        `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(locale)}`,
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
