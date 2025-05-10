import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageProvider';

export const useLanguage = () => {
  return useContext(LanguageContext);
};