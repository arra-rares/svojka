import { useSiteContent } from '@/context/LocaleContext';

export function HowItWorks() {
  const { howItWorksContent } = useSiteContent();

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-12">
          {howItWorksContent.title}
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {howItWorksContent.steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center text-[18px] font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-[16px] font-medium text-[#111111] mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#6B6B6B]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
