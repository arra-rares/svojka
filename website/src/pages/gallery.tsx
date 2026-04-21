import { useMemo, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { galleryBaseUrlPattern } from '@/content/contactStatic';
import { useSiteContent } from '@/context/LocaleContext';

type Event = {
  id: number;
  date: string;
  location: string;
  year: number;
  imageSrc: string;
  collaboratorAttribution?: string;
};

type GalleryPageProps = {
  onBackToHome: () => void;
};

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  const { galleryPageContent, headerContent, galleryPasswordModalContent } = useSiteContent();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = galleryPageContent.mock.eventsPerPage;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowPasswordModal(true);
  };

  const allEvents: Event[] = useMemo(() => {
    const { thumbnailUrls, locations, months, eventCount2026, eventCount2025 } =
      galleryPageContent.mock;
    const events: Event[] = [];
    let id = 1;

    for (let i = 0; i < eventCount2026; i++) {
      const month = months[Math.floor(Math.random() * months.length)];
      const partnerName = galleryPageContent.mock.collaboratorPartnerNames[i % galleryPageContent.mock.collaboratorPartnerNames.length];
      const hasCollaborator = i % 9 === 0;
      events.push({
        id: id++,
        date: `${month} 2026`,
        location: locations[i % locations.length],
        year: 2026,
        imageSrc: thumbnailUrls[i % thumbnailUrls.length],
        collaboratorAttribution: hasCollaborator
          ? galleryPageContent.collaboratorAttributionTemplate.replace('[Partner Name]', partnerName)
          : undefined,
      });
    }

    for (let i = 0; i < eventCount2025; i++) {
      const month = months[Math.floor(Math.random() * months.length)];
      const partnerName = galleryPageContent.mock.collaboratorPartnerNames[i % galleryPageContent.mock.collaboratorPartnerNames.length];
      const hasCollaborator = i % 11 === 0;
      events.push({
        id: id++,
        date: `${month} 2025`,
        location: locations[i % locations.length],
        year: 2025,
        imageSrc: thumbnailUrls[i % thumbnailUrls.length],
        collaboratorAttribution: hasCollaborator
          ? galleryPageContent.collaboratorAttributionTemplate.replace('[Partner Name]', partnerName)
          : undefined,
      });
    }

    return events.sort((a, b) => b.year - a.year);
  }, [galleryPageContent.mock]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return allEvents;
    const query = searchQuery.toLowerCase();
    return allEvents.filter(
      (event) =>
        event.date.toLowerCase().includes(query) || event.location.toLowerCase().includes(query),
    );
  }, [allEvents, searchQuery]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;

  const paginatedEventsByYear = useMemo(() => {
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
    const grouped: Record<number, Event[]> = {};
    paginatedEvents.forEach((event) => {
      if (!grouped[event.year]) {
        grouped[event.year] = [];
      }
      grouped[event.year].push(event);
    });
    return grouped;
  }, [filteredEvents, startIndex, endIndex]);

  const paginatedYears = Object.keys(paginatedEventsByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-[#111111] hover:text-[#6B6B6B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium">{galleryPageContent.backToHome}</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="text-[22px] font-semibold text-[#111111]">{headerContent.brand}</div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="pt-20 md:pt-24 pb-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <h1 className="text-[28px] md:text-[36px] font-semibold text-[#111111] mb-2">
              {galleryPageContent.pageTitle}
            </h1>
            <p className="text-[14px] text-[#6B6B6B]">{galleryPageContent.pageSubtitle}</p>
          </div>

          <div className="mb-10">
            <div className="relative max-w-[600px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={galleryPageContent.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] text-[16px]"
              />
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[18px] text-[#111111] mb-2">{galleryPageContent.emptyTitle}</p>
              <p className="text-[14px] text-[#6B6B6B]">{galleryPageContent.emptySubtitle}</p>
            </div>
          ) : (
            <>
              {paginatedYears.map((year) => (
                <div key={year} className="mb-12">
                  <h2 className="text-[22px] font-semibold text-[#111111] mb-6">{year}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedEventsByYear[year].map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleEventClick(event)}
                        className="group text-left"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                          <img
                            src={event.imageSrc}
                            alt={`${event.location}${galleryPageContent.eventCardAltJoiner}${event.date}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-[14px] text-[#111111] font-medium mb-1">{event.date}</div>
                        <div className="text-[12px] text-[#6B6B6B]">{event.location}</div>
                        {event.collaboratorAttribution ? (
                          <div className="text-[11px] text-[#9E9E9E] mt-1">
                            {event.collaboratorAttribution}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {totalPages > 1 ? (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {galleryPageContent.paginationPrevious}
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#111111] text-white'
                              : 'border border-[#EAEAEA] text-[#111111] hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {galleryPageContent.paginationNext}
                  </button>
                </div>
              ) : null}

              <div className="text-center mt-6 text-[14px] text-[#6B6B6B]">
                {galleryPageContent.showingLineParts.prefix} {startIndex + 1}
                {galleryPageContent.rangeSeparator}
                {Math.min(endIndex, filteredEvents.length)} {galleryPageContent.showingLineParts.of}{' '}
                {filteredEvents.length} {galleryPageContent.showingLineParts.suffix}
              </div>
            </>
          )}
        </div>
      </main>

      {showPasswordModal && selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[400px] w-full p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111111] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-[22px] font-semibold text-[#111111] mb-4">
              {galleryPasswordModalContent.title}
            </h3>
            <p className="text-[14px] text-[#6B6B6B] mb-2">
              {selectedEvent.location} {galleryPasswordModalContent.eventDetailConnector}{' '}
              {selectedEvent.date}
            </p>
            {selectedEvent.collaboratorAttribution ? (
              <p className="text-[12px] text-[#9E9E9E] mb-2">{selectedEvent.collaboratorAttribution}</p>
            ) : null}
            <p className="text-[14px] text-[#6B6B6B] mb-6">{galleryPasswordModalContent.description}</p>

            <input
              type="password"
              placeholder={galleryPasswordModalContent.passwordPlaceholder}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] mb-6"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-6 py-3 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {galleryPasswordModalContent.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  window.open(`${galleryBaseUrlPattern}${selectedEvent.id}`, '_blank');
                }}
                className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
              >
                {galleryPasswordModalContent.enter}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
