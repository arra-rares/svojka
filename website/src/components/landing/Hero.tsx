import { useSiteContent } from '@/context/LocaleContext';

type HeroProps = {
  onOpenBookingForm: () => void;
};

export function Hero({ onOpenBookingForm }: HeroProps) {
  const { heroContent } = useSiteContent();

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center mt-20 md:mt-24">
      <img
        src={heroContent.imageSrc}
        alt={heroContent.imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      <div className="relative z-10 text-center px-4 max-w-[800px]">
        <h1 className="text-[32px] md:text-[48px] font-bold text-white mb-4">{heroContent.title}</h1>
        <p className="text-[18px] text-white/90 mb-8">{heroContent.subtitle}</p>
        <button
          type="button"
          onClick={onOpenBookingForm}
          className="bg-[#111111] text-white px-8 py-3 md:py-4 rounded-xl text-base font-medium hover:bg-black transition-colors"
        >
          {heroContent.cta}
        </button>
      </div>
    </section>
  );
}
