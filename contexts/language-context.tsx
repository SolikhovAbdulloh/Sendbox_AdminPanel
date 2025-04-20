"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Import all translation files
import enTranslations from "@/translations/en.json";
import ruTranslations from "@/translations/ru.json";
import uzTranslations from "@/translations/uz.json";

type Language = "en" | "ru" | "uz";

type Translations = {
  [key: string]: any;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Translations> = {
  en: enTranslations,
  ru: ruTranslations,
  uz: uzTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default language is Russian
  const [language, setLanguage] = useState<Language>("ru");

  // Load saved language preference from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "ru", "uz"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Also set the html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    // Split the key by dots to navigate through the nested objects
    const keys = key.split(".");
    let value = translations[language];

    // Navigate through the nested objects
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // If key not found, return the key itself
        return key;
      }
    }

    return value as any;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
