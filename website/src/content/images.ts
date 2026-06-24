/** Served from `public/images` → URLs are `/images/...` */

const b = '/images/backdrops';
const s = '/images/services';

export const heroImageUrl = `${s}/photobooth.webp`;

export const serviceImageUrls = {
  photobox: `${s}/photobooth.webp`,
  video360: `${s}/booth360.webp`,
  lowFog: `${s}/lowfog.webp`,
  coldSparks: `${s}/fireworks.webp`,
  guestbookPhone: `${s}/phonebooth.webp`,
  instaxMini: `${s}/instax.webp`,
} as const;

/** Full backdrop set (photobox detail grid + lightbox), filenames as on disk */
export const backdropImageUrls = [
  `${b}/V0353.jpg`,
  `${b}/V0406.jpg`,
  `${b}/V0580.jpg`,
  `${b}/V0605.jpg`,
  `${b}/V0606.jpg`,
  `${b}/V0724.jpg`,
  `${b}/V0827.jpg`,
  `${b}/V1060.jpg`,
  `${b}/V1104.jpg`,
  `${b}/V1232.jpg`,
  `${b}/V1233.jpg`,
  `${b}/V1295.jpg`,
  `${b}/V1304.jpg`,
  `${b}/V1306.jpg`,
  `${b}/V1314.jpg`,
  `${b}/V1426.jpg`,
  `${b}/V1427.jpg`,
  `${b}/V1440.jpg`,
  `${b}/V1465.jpg`,
  `${b}/V1498.jpg`,
  `${b}/V1499.jpg`,
  `${b}/V1502.jpg`,
  `${b}/V1729.jpg`,
  `${b}/V1736.jpg`,
  `${b}/V1769.jpg`,
  `${b}/V2851.jpg`,
  `${b}/V3074.jpg`,
  `${b}/V3225.jpg`,
  `${b}/v3330.jpg`,
] as const;

export const recentEventImageUrls = [
  `${s}/photobooth.webp`,
  `${s}/booth360.webp`,
  `${b}/V0580.jpg`,
  `${b}/V1232.jpg`,
  `${s}/fireworks.webp`,
  `${s}/phonebooth.webp`,
] as const;

/** Pool for mock events on the full gallery page */
export const galleryMockThumbnailUrls: readonly string[] = [
  ...backdropImageUrls,
  ...Object.values(serviceImageUrls),
];
