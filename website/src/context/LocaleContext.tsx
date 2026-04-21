import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '@/content/locale';
import { contentByLocale, type SiteContent } from '@/content/locales';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: SiteContent;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const htmlLang: Record<Locale, string> = {
  en: 'en',
  sk: 'sk',
  de: 'de',
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('sk');
  const content = contentByLocale[locale];

  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      content,
    }),
    [locale, content],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('LocaleProvider is missing');
  }
  return ctx;
}

export function useSiteContent() {
  return useLocaleContext().content;
}
