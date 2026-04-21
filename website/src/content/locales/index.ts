import type { Locale } from '@/content/locale';
import { de } from '@/content/locales/de';
import { en, type SiteContent } from '@/content/locales/en';
import { sk } from '@/content/locales/sk';

export type { SiteContent };

export const contentByLocale: Record<Locale, SiteContent> = {
  en,
  sk,
  de,
};
