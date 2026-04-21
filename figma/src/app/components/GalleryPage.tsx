import { useState, useMemo } from 'react';
import { ArrowLeft, X, Search } from 'lucide-react';

interface Event {
  id: number;
  date: string;
  location: string;
  year: number;
  imageId: string;
}

interface GalleryPageProps {
  onBackToHome: () => void;
}

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 24;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowPasswordModal(true);
  };

  // Mock event data (60-80 events)
  const allEvents: Event[] = useMemo(() => {
    const eventImages = [
      '1768244016517-2ec30e558a78',
      '1762237826378-a7122dfd72eb',
      '1764269716109-5ef0066412ef',
      '1768053922335-d6f69bbc2a81',
      '1762709117928-b3662d515832',
      '1761774958264-f14d8f88cff5',
      '1758523981570-e7dd70fa1f9b',
      '1775879984368-f01d0602f63c',
    ];

    const locations = [
      'Bratislava',
      'Vienna',
      'Prague',
      'Budapest',
      'Košice',
      'Trenčín',
      'Piešťany',
      'Trnava',
    ];

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const events: Event[] = [];
    let id = 1;

    // Generate events for 2026
    for (let i = 0; i < 35; i++) {
      const month = months[Math.floor(Math.random() * months.length)];
      events.push({
        id: id++,
        date: `${month} 2026`,
        location: locations[i % locations.length],
        year: 2026,
        imageId: eventImages[i % eventImages.length],
      });
    }

    // Generate events for 2025
    for (let i = 0; i < 38; i++) {
      const month = months[Math.floor(Math.random() * months.length)];
      events.push({
        id: id++,
        date: `${month} 2025`,
        location: locations[i % locations.length],
        year: 2025,
        imageId: eventImages[i % eventImages.length],
      });
    }

    return events.sort((a, b) => b.year - a.year);
  }, []);

  // Filter events by search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return allEvents;

    const query = searchQuery.toLowerCase();
    return allEvents.filter(
      (event) =>
        event.date.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
  }, [allEvents, searchQuery]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    const grouped: Record<number, Event[]> = {};
    filteredEvents.forEach((event) => {
      if (!grouped[event.year]) {
        grouped[event.year] = [];
      }
      grouped[event.year].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Paginate events
  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => b - a);
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-[#111111] hover:text-[#6B6B6B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium">Back to Home</span>
          </button>
          <div className="text-[22px] font-semibold text-[#111111]">ARRA</div>
        </div>
      </header>

      {/* Gallery Content */}
      <main className="pt-20 md:pt-24 pb-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-[28px] md:text-[36px] font-semibold text-[#111111] mb-2">
              Find your event
            </h1>
            <p className="text-[14px] text-[#6B6B6B]">
              Search by date or location to find your photos
            </p>
          </div>

          {/* Search */}
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
                placeholder="Search by date or location"
                className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] text-[16px]"
              />
            </div>
          </div>

          {/* Events by Year */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[18px] text-[#111111] mb-2">No events found</p>
              <p className="text-[14px] text-[#6B6B6B]">Try searching by date or location</p>
            </div>
          ) : (
            <>
              {paginatedYears.map((year) => (
                <div key={year} className="mb-12">
                  {/* Year Label */}
                  <h2 className="text-[22px] font-semibold text-[#111111] mb-6">{year}</h2>

                  {/* Event Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedEventsByYear[year].map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="group text-left"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                          <img
                            src={`https://images.unsplash.com/photo-${event.imageId}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`}
                            alt={`${event.location} - ${event.date}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-[14px] text-[#111111] font-medium mb-1">
                          {event.date}
                        </div>
                        <div className="text-[12px] text-[#6B6B6B]">
                          {event.location}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="text-center mt-6 text-[14px] text-[#6B6B6B]">
                Showing {startIndex + 1}–{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
              </div>
            </>
          )}
        </div>
      </main>

      {/* Password Modal */}
      {showPasswordModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[400px] w-full p-6 md:p-8 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111111] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-[22px] font-semibold text-[#111111] mb-4">Gallery Access</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-2">
              {selectedEvent.location} — {selectedEvent.date}
            </p>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Enter the password you received after the event
            </p>

            <input
              type="password"
              placeholder="Gallery password"
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-6 py-3 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  window.open(`https://fotoshare.co/e/event-${selectedEvent.id}`, '_blank');
                }}
                className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
