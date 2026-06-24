import { brandAssets } from '@/content/company';

export function HeaderBrand() {
  return (
    <img
      src={brandAssets.logoUrl}
      alt={brandAssets.logoAlt}
      className="h-20 md:h-24 w-auto object-contain"
    />
  );
}
