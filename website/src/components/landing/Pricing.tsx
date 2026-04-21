import { Camera, Sparkles, Video } from 'lucide-react';
import { useSiteContent } from '@/context/LocaleContext';

function BlockIcon({ icon }: { icon: 'camera' | 'video' | 'sparkles' }) {
  const className = 'w-5 h-5';
  if (icon === 'camera') return <Camera className={className} />;
  if (icon === 'video') return <Video className={className} />;
  return <Sparkles className={className} />;
}

export function Pricing() {
  const { pricingContent } = useSiteContent();

  return (
    <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-3">
          {pricingContent.title}
        </h2>
        <p className="text-[14px] text-[#6B6B6B] text-center mb-10">{pricingContent.subtitle}</p>

        <div className="bg-white rounded-xl p-6 md:p-8 mb-6">
          <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
            <BlockIcon icon={pricingContent.photoBooth.icon} />
            {pricingContent.photoBooth.title}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingContent.photoBooth.tiers.map((tier) => (
              <div
                key={tier.durationLabel}
                className={
                  tier.highlighted
                    ? 'border-2 border-[#111111] rounded-lg p-4 relative'
                    : 'border border-[#EAEAEA] rounded-lg p-4'
                }
              >
                {tier.highlighted && tier.badge ? (
                  <div className="absolute -top-3 left-4 bg-[#111111] text-white px-3 py-1 rounded text-[12px] font-medium">
                    {tier.badge}
                  </div>
                ) : null}
                <div className="text-[14px] text-[#6B6B6B] mb-2">{tier.durationLabel}</div>
                <div className="text-[32px] font-bold text-[#111111]">{tier.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 mb-6">
          <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
            <BlockIcon icon={pricingContent.video360.icon} />
            {pricingContent.video360.title}
          </h3>
          <div className="border border-[#EAEAEA] rounded-lg p-4 inline-block">
            <div className="text-[14px] text-[#6B6B6B] mb-2">
              {pricingContent.video360.tier.durationLabel}
            </div>
            <div className="text-[32px] font-bold text-[#111111]">
              {pricingContent.video360.tier.price}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8">
          <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
            <BlockIcon icon={pricingContent.additional.icon} />
            {pricingContent.additional.title}
          </h3>
          <div className="space-y-4">
            {pricingContent.additional.rows.map((row, index) => (
              <div
                key={row.name}
                className={
                  index < pricingContent.additional.rows.length - 1
                    ? 'flex justify-between items-center pb-4 border-b border-[#EAEAEA]'
                    : 'flex justify-between items-center'
                }
              >
                <div>
                  <div className="text-[16px] text-[#111111] mb-1">{row.name}</div>
                  <div className="text-[12px] text-[#6B6B6B]">{row.note}</div>
                </div>
                <div className="text-[18px] font-medium text-[#111111]">{row.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-[14px] text-[#6B6B6B]">
          {pricingContent.transportationNote}
        </div>
        <div className="mt-2 text-center text-[12px] text-[#6B6B6B]">
          {pricingContent.pricingFootnote}
        </div>
      </div>
    </section>
  );
}
