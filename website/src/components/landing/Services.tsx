import { useState } from 'react';
import { Camera, ChevronDown, ChevronLeft, ChevronRight, Phone, Sparkles, Video, X, Zap } from 'lucide-react';
import { useSiteContent } from '@/context/LocaleContext';

type ServiceIcon = 'camera' | 'video' | 'zap' | 'sparkles' | 'phone';

function ServiceIconGlyph({ name }: { name: ServiceIcon }) {
  const className = 'w-5 h-5 text-[#111111] mt-1 flex-shrink-0';
  if (name === 'camera') return <Camera className={className} />;
  if (name === 'video') return <Video className={className} />;
  if (name === 'zap') return <Zap className={className} />;
  if (name === 'sparkles') return <Sparkles className={className} />;
  return <Phone className={className} />;
}

export function Services() {
  const { servicesContent } = useSiteContent();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [showBackdropLightbox, setShowBackdropLightbox] = useState(false);
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);

  const photobox = servicesContent.services.find((s) => s.id === 'photobox');
  const backdropUrls: readonly string[] =
    photobox && 'backdrops' in photobox ? (photobox.backdrops ?? []) : [];

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-10">
          {servicesContent.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {servicesContent.services.map((service) => {
            const isExpanded = expandedService === service.id;
            const hasBackdrops = 'backdrops' in service && Array.isArray(service.backdrops);

            return (
              <div key={service.id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 relative">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {'badge' in service && service.badge ? (
                    <div
                      className={
                        service.badge.style === 'dark'
                          ? 'absolute top-3 left-3 bg-[#111111] text-white px-2 py-1 rounded text-[12px] font-medium'
                          : 'absolute top-3 left-3 bg-white/90 text-[#111111] px-2 py-1 rounded text-[12px] font-medium'
                      }
                    >
                      {service.badge.text}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <ServiceIconGlyph name={service.icon} />
                  <div className="flex-1">
                    <h3 className="text-[18px] font-medium text-[#111111] mb-2">{service.title}</h3>
                    <p className="text-[14px] text-[#6B6B6B] mb-1">{service.description}</p>
                    {'footnote' in service && service.footnote ? (
                      <p className="text-[12px] text-[#9E9E9E] mb-3">{service.footnote}</p>
                    ) : (
                      <div className="mb-3" />
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedService(isExpanded ? null : service.id)}
                      className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                    >
                      {isExpanded ? servicesContent.toggleCollapse : servicesContent.toggleExpand}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {isExpanded && service.detailBullets.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-[#EAEAEA] space-y-4">
                    <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                      {service.detailBullets.map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <span className="text-[#111111] mt-0.5">{servicesContent.listItemMarker}</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {hasBackdrops && backdropUrls.length > 0 ? (
                      <div>
                        <p className="text-[14px] font-medium text-[#111111] mb-3">
                          {servicesContent.backdropExamplesTitle}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {backdropUrls.slice(0, 6).map((backdrop, idx) => (
                            <button
                              key={backdrop}
                              type="button"
                              onClick={() => {
                                setCurrentBackdropIndex(idx);
                                setShowBackdropLightbox(true);
                              }}
                              className="aspect-square overflow-hidden rounded bg-gray-100 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={backdrop}
                                alt={`${servicesContent.backdropAltPrefix} ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentBackdropIndex(0);
                            setShowBackdropLightbox(true);
                          }}
                          className="text-[14px] text-[#111111] underline hover:text-[#6B6B6B] transition-colors"
                        >
                          {servicesContent.viewAllBackdrops}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {showBackdropLightbox && backdropUrls.length > 0 ? (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setShowBackdropLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentBackdropIndex(
                (currentBackdropIndex - 1 + backdropUrls.length) % backdropUrls.length,
              )
            }
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-[900px] max-h-[80vh] w-full">
            <img
              src={backdropUrls[currentBackdropIndex]}
              alt={`${servicesContent.backdropAltPrefix} ${currentBackdropIndex + 1}`}
              className="w-full h-full object-contain rounded"
            />
            <div className="text-center mt-4 text-white text-[14px]">
              {currentBackdropIndex + 1} {servicesContent.lightboxCounterSeparator}{' '}
              {backdropUrls.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentBackdropIndex((currentBackdropIndex + 1) % backdropUrls.length)
            }
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
