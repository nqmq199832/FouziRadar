import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { translations } from '@/localization/translations';

// Define translation function and supported languages
export type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  i18n: I18n;
  isRTL: boolean;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  i18n: new I18n(),
  isRTL: false,
});

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize i18n with translations
  const i18n = new I18n(translations);
  i18n.enableFallback = true;
  
  // Default to device language or english
  const deviceLanguage = Localization.locale.split('-')[0];
  const defaultLanguage: Language = (deviceLanguage === 'ar' ? 'ar' : 'en') as Language;
  
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  
  // Load saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@language_preference');
        if (savedLanguage !== null && (savedLanguage === 'en' || savedLanguage === 'ar')) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };
    
    loadLanguage();
  }, []);
  
  // Set language and save preference
  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      i18n.locale = lang;
      await AsyncStorage.setItem('@language_preference', lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };
  
  // Update i18n locale when language changes
  useEffect(() => {
    i18n.locale = language;
  }, [language]);
  
  const isRTL = language === 'ar';
  
  const languageContext: LanguageContextType = {
    language,
    setLanguage,
    i18n,
    isRTL,
  };
  
  return (
    <LanguageContext.Provider value={languageContext}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;