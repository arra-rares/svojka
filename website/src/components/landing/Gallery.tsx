import { useSiteContent } from '@/context/LocaleContext';

type GalleryProps = {
  onEventClick: (eventId: number) => void;
  onViewAll: () => void;
};

export function Gallery({ onEventClick, onViewAll }: GalleryProps) {
  const { gallerySectionContent } = useSiteContent();

  return (
    <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-3">
          {gallerySectionContent.title}
        </h2>
        <p className="text-[14px] text-[#6B6B6B] text-center mb-10">
          {gallerySectionContent.subtitle}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {gallerySectionContent.events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventClick(event.id)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={event.imageSrc}
                alt={event.imageAlt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[14px] font-medium">
                  {gallerySectionContent.viewGalleryHover}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#111111] text-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors font-medium"
          >
            {gallerySectionContent.viewAllButton}
            <span className="text-[18px]">{gallerySectionContent.viewAllArrow}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
