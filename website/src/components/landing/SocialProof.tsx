import { useEffect, useState } from 'react';
import { useLocaleContext, useSiteContent } from '@/context/LocaleContext';

type Testimonial = {
  attribution: string;
  quote: string;
};

export function SocialProof() {
  const { locale } = useLocaleContext();
  const { socialProofContent } = useSiteContent();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function loadTestimonials() {
      const response = await fetch(`/data/testimonials.${locale}.json`);
      if (!response.ok) {
        setTestimonials([]);
        return;
      }
      const data = (await response.json()) as { testimonials: Testimonial[] };
      setTestimonials(data.testimonials);
    }

    void loadTestimonials();
  }, [locale]);

  return (
    <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="text-[48px] font-bold text-[#111111] mb-2">{socialProofContent.statValue}</div>
        <div className="text-[18px] text-[#6B6B6B] mb-12">{socialProofContent.statLabel}</div>

        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {testimonials.map((t) => (
              <div key={t.attribution} className="bg-white p-6 rounded-lg text-left">
                <p className="text-[14px] text-[#6B6B6B] mb-4">{t.quote}</p>
                <p className="text-[12px] font-medium text-[#111111]">{t.attribution}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
