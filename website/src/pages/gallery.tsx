import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HeaderBrand } from '@/components/HeaderBrand';
import { useSiteContent } from '@/context/LocaleContext';
import { fetchGalleryEvents, verifyGalleryAccess } from '@/lib/galleryClient';
import type { GalleryEventPublic } from '@/types/gallery';

type Event = GalleryEventPublic;

type GalleryPageProps = {
  onBackToHome: () => void;
};

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  const { galleryPageContent, galleryPasswordModalContent } = useSiteContent();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [eventsLoadError, setEventsLoadError] = useState('');
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = galleryPageContent.mock.eventsPerPage;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEnteredPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  useEffect(() => {
    async function loadEvents() {
      setEventsLoadError('');
      try {
        const loadedEvents = await fetchGalleryEvents();
        setAllEvents(loadedEvents);
      } catch {
        setEventsLoadError('Unable to load gallery events right now.');
      }
    }

    void loadEvents();
  }, []);

  async function unlockEvent() {
    if (!selectedEvent) return;
    setPasswordError('');
    const fotoshareUrl = await verifyGalleryAccess(selectedEvent.id, enteredPassword);
    if (!fotoshareUrl) {
      setPasswordError('Incorrect password.');
      return;
    }
    window.location.assign(fotoshareUrl);
  }

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return allEvents;
    const query = searchQuery.toLowerCase();
    return allEvents.filter((event) =>
      [event.name, event.type, event.date].some((field) => field.toLowerCase().includes(query)),
    );
  }, [allEvents, searchQuery]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;

  const paginatedEventsByYear = useMemo(() => {
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
    const grouped: Record<string, Event[]> = {};
    paginatedEvents.forEach((event) => {
      const year = event.date.slice(0, 4);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(event);
    });
    return grouped;
  }, [filteredEvents, startIndex, endIndex]);

  const paginatedYears = Object.keys(paginatedEventsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-[#111111] hover:text-[#6B6B6B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium">{galleryPageContent.backToHome}</span>
          </button>
          <div className="flex items-center gap-4">
            <HeaderBrand />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="pt-24 md:pt-28 pb-16 px-4">
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

          {eventsLoadError ? (
            <div className="text-center py-16">
              <p className="text-[18px] text-[#111111] mb-2">{eventsLoadError}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
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
                            src={event.coverImage}
                            alt={`${event.name}${galleryPageContent.eventCardAltJoiner}${event.date}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-[14px] text-[#111111] font-medium mb-1">{event.name}</div>
                        <div className="text-[12px] text-[#6B6B6B]">{event.date}</div>
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
              {selectedEvent.name} {galleryPasswordModalContent.eventDetailConnector}{' '}
              {selectedEvent.date}
            </p>
            <p className="text-[14px] text-[#6B6B6B] mb-6">{galleryPasswordModalContent.description}</p>

            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder={galleryPasswordModalContent.passwordPlaceholder}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] mb-6"
            />
            {passwordError ? <p className="text-[12px] text-red-500 mb-4">{passwordError}</p> : null}

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
                onClick={() => void unlockEvent()}
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
