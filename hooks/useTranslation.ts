import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageProvider';

export const useTranslation = () => {
  const { i18n } = useContext(LanguageContext);
  
  return {
    t: (key: string, options?: Record<string, any>) => i18n.t(key, options),
  };
};