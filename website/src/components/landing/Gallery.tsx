import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSiteContent } from '@/context/LocaleContext';
import type { GalleryEventPublic } from '@/types/gallery';

type GalleryProps = {
  onViewAll: () => void;
};

const placeholderCoverImage = '/images/gallery/placeholder-event.svg';

export function Gallery({ onViewAll }: GalleryProps) {
  const { gallerySectionContent, galleryPasswordModalContent } = useSiteContent();
  const [events, setEvents] = useState<GalleryEventPublic[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEventPublic | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadLatestEvents() {
      setLoadError('');
      const response = await fetch('/api/gallery/events');
      if (!response.ok) {
        setLoadError('Unable to load recent events right now.');
        return;
      }
      const data = (await response.json()) as { events: GalleryEventPublic[] };
      setEvents(data.events.slice(0, 6));
    }

    void loadLatestEvents();
  }, []);

  async function unlockEvent() {
    if (!selectedEvent) return;
    setPasswordError('');
    const response = await fetch('/api/gallery/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedEvent.id,
        password: enteredPassword,
      }),
    });
    if (!response.ok) {
      setPasswordError('Incorrect password.');
      return;
    }
    const data = (await response.json()) as { fotoshareUrl: string };
    window.location.assign(data.fotoshareUrl);
  }

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
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => {
                setSelectedEvent(event);
                setEnteredPassword('');
                setPasswordError('');
              }}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={event.coverImage?.trim() || placeholderCoverImage}
                alt={event.name}
                onError={(e) => {
                  e.currentTarget.src = placeholderCoverImage;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[14px] font-medium">
                  {gallerySectionContent.viewGalleryHover}
                </div>
              </div>
            </button>
          ))}
          {events.length === 0 && !loadError ? (
            <div className="col-span-full text-center text-[14px] text-[#6B6B6B] py-6">
              {gallerySectionContent.subtitle}
            </div>
          ) : null}
          {loadError ? (
            <div className="col-span-full text-center text-[14px] text-[#6B6B6B] py-6">{loadError}</div>
          ) : null}
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

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[400px] w-full p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111111] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-[22px] font-semibold text-[#111111] mb-4">
              {galleryPasswordModalContent.title}
            </h3>
            <p className="text-[14px] text-[#6B6B6B] mb-2">
              {selectedEvent.name} {galleryPasswordModalContent.eventDetailConnector}{' '}
              {selectedEvent.date}
            </p>
            <p className="text-[14px] text-[#6B6B6B] mb-6">{galleryPasswordModalContent.description}</p>

            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder={galleryPasswordModalContent.passwordPlaceholder}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] mb-3"
            />
            {passwordError ? <p className="text-[12px] text-red-500 mb-4">{passwordError}</p> : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-6 py-3 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {galleryPasswordModalContent.cancel}
              </button>
              <button
                type="button"
                onClick={() => void unlockEvent()}
                className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
              >
                {galleryPasswordModalContent.enter}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
