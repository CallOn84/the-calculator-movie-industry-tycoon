// src/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import zhCN from "@/locales/zh-CN.json";
import zhTW from "@/locales/zh-TW.json";
import tr from "@/locales/tr.json";

type Translations = typeof en;

const translationsMap: Record<string, Translations> = {
  en,
  pt,
  fr,
  de,
  es,
  ja,
  ko,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  tr,
};

const supportedLanguages = Object.keys(translationsMap);

const detectUserLanguage = (): string => {
  if (typeof window !== "undefined" && navigator?.language) {
    const browserLang = navigator.language.split("-")[0]; // Ex: "pt" de "pt-BR"
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
    if (supportedLanguages.includes(navigator.language)) {
      return navigator.language;
    }
  }
  return "en";
};

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    const defaultLocale = savedLocale || detectUserLanguage();
    setLocaleState(defaultLocale);
  }, []);

  const translations = translationsMap[locale] || translationsMap["en"];

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};
