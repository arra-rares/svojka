/** URLs and non-translatable constants shared across locales */

import { contactInfo } from '@/content/company';

export const galleryBaseUrlPattern = 'https://fotoshare.co/e/event-';

const whatsappText = encodeURIComponent(contactInfo.whatsappPrefill);

export const whatsappHref = `https://wa.me/${contactInfo.whatsappE164}?text=${whatsappText}`;

export const telHref = `tel:${contactInfo.phoneE164}`;

export const contactLinks = {
  phone: telHref,
  email: `mailto:${contactInfo.email}`,
  whatsapp: whatsappHref,
  instagram: contactInfo.instagramUrl,
  facebook: contactInfo.facebookUrl,
} as const;
