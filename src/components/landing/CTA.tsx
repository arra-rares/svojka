import { useSiteContent } from '@/context/LocaleContext';

type CTAProps = {
  onOpenBookingForm: () => void;
};

export function CTA({ onOpenBookingForm }: CTAProps) {
  const { ctaContent } = useSiteContent();

  return (
    <section className="py-16 md:py-20 px-4 bg-[#111111] text-white">
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="text-[28px] md:text-[36px] font-bold mb-4">{ctaContent.title}</h2>
        <p className="text-[16px] text-white/80 mb-8">{ctaContent.subtitle}</p>
        <button
          type="button"
          onClick={onOpenBookingForm}
          className="bg-white text-[#111111] px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-100 transition-colors"
        >
          {ctaContent.button}
        </button>
      </div>
    </section>
  );
}
