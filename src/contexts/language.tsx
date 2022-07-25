import { DeepestPath } from "@/@types";
import { translations } from "@/data";
import { StringStorage } from "@/lib/local-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export const LANGUAGES = ["en", "ja"] as const;
export type Lang = typeof LANGUAGES[number];

export const langStorageKey = "yk-lang";

type TranslationKey = DeepestPath<
  typeof translations[keyof typeof translations],
  string
>;

type LanguageValue = {
  lang: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageValue>({
  lang: "en",
  setLanguage: () => {},
  t: () => "",
});

const langStorage = new StringStorage<Lang>(langStorageKey, isValidLang);

function isValidLang(value: any): value is Lang {
  if (!value) {
    return false;
  }
  return ["en", "ja"].includes(value);
}

export const LanguageProvider: React.FC = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (!window.localStorage) {
      return;
    }

    const data = langStorage.get();

    if (!data) {
      const browserLang = navigator?.languages[0] || navigator?.language;

      if (isValidLang(browserLang)) {
        setLang(browserLang);
      }

      return;
    }

    setLang(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: Lang) => {
    setLang(lang);
    langStorage.set(lang);
  };

  const t = (key: TranslationKey) => {
    const keys = key.split(".");

    let obj = translations[lang];

    keys.forEach((key) => {
      //@ts-ignore
      obj = obj?.[key];
    });

    return typeof obj === "string" ? obj : "";
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
