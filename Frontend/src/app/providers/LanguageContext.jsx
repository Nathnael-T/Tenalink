import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext(undefined);

const translations = {
  en: {},
  am: {},
  ti: {},
  om: {}
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('tenalink-language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('tenalink-language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const item of keys) {
      value = value?.[item];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
