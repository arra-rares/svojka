import { useState } from 'react';
import { Camera, Video, Sparkles, Zap, Phone, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import '../styles/datepicker.css';
import { GalleryPage } from './components/GalleryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery'>('home');
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [showBackdropLightbox, setShowBackdropLightbox] = useState(false);
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const backdrops = [
    'https://images.unsplash.com/photo-1764091319520-7507b5ad253a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1762709117928-b3662d515832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1653821355168-144695e5c0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1653821355692-03666613499f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1758870041148-31d28fdf34d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1761574030105-c5b4dc65a76d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1653821355226-6def361cc7ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1666950948031-18691c4a80af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1772127822525-7eda37383b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPhoneError('');

    // Validate required fields
    let hasErrors = false;

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasErrors = true;
    }

    if (phoneNumber && !validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      hasErrors = true;
    }

    if (!selectedDate) {
      hasErrors = true;
    }

    if (hasErrors) return;

    // Submit form
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);

    // Reset form
    setSelectedDate(undefined);
    setEmail('');
    setPhoneNumber('');
  };

  const handleEventClick = (eventId: number) => {
    setSelectedEvent(eventId);
    setShowPasswordModal(true);
  };

  // Show gallery page if selected
  if (currentPage === 'gallery') {
    return <GalleryPage onBackToHome={() => {
      setCurrentPage('home');
      window.scrollTo(0, 0);
    }} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="text-[22px] font-semibold text-[#111111]">ARRA</div>
          <button className="text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
            SK | EN | DE
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center mt-14 md:mt-16">
        <img
          src="https://images.unsplash.com/photo-1762237826378-a7122dfd72eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Event celebration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="relative z-10 text-center px-4 max-w-[800px]">
          <h1 className="text-[32px] md:text-[48px] font-bold text-white mb-4">
            Premium Experience for Your Event
          </h1>
          <p className="text-[18px] text-white/90 mb-8">
            Instant photos, unlimited captures, and professional service for weddings and corporate events
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#111111] text-white px-8 py-3 md:py-4 rounded-xl text-base font-medium hover:bg-black transition-colors"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="text-[48px] font-bold text-[#111111] mb-2">100+</div>
          <div className="text-[18px] text-[#6B6B6B] mb-12">successfully completed events</div>

          <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-[14px] text-[#6B6B6B] mb-4">
                "Perfect service, guests were thrilled. Photos from the gallery are amazing!"
              </p>
              <p className="text-[12px] font-medium text-[#111111]">— Lucia K., Wedding</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-[14px] text-[#6B6B6B] mb-4">
                "Video 360 was the highlight of the evening. Professional approach from start to finish."
              </p>
              <p className="text-[12px] font-medium text-[#111111]">— Marek T., Corporate Event</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-[14px] text-[#6B6B6B] mb-4">
                "Instant photo printing impressed everyone. Definitely recommend!"
              </p>
              <p className="text-[12px] font-medium text-[#111111]">— Eva S., Prom</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-10">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo Booth */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1730250427302-c7df9b9d9961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Photo Booth"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#111111] text-white px-2 py-1 rounded text-[12px] font-medium">
                  Most Popular
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Camera className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Photo Booth</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-1">
                    Instant printing, unlimited captures, props & web gallery
                  </p>
                  <p className="text-[12px] text-[#9E9E9E] mb-3">Two print formats included</p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'photobox' ? null : 'photobox')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'photobox' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'photobox' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'photobox' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA] space-y-4">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Multiple backdrops available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Custom print design with your branding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Props and accessories included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>On-site staff for full event support</span>
                    </li>
                  </ul>

                  <div>
                    <p className="text-[14px] font-medium text-[#111111] mb-3">Backdrop Examples</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {backdrops.slice(0, 6).map((backdrop, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentBackdropIndex(idx);
                            setShowBackdropLightbox(true);
                          }}
                          className="aspect-square overflow-hidden rounded bg-gray-100 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={backdrop}
                            alt={`Backdrop ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentBackdropIndex(0);
                        setShowBackdropLightbox(true);
                      }}
                      className="text-[14px] text-[#111111] underline hover:text-[#6B6B6B] transition-colors"
                    >
                      View all backdrops
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video 360 */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1641077818099-05d12fc74201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Video 360"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 text-[#111111] px-2 py-1 rounded text-[12px] font-medium">
                  Trending
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Video className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Video 360</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-3">
                    Spinning platform for dynamic videos & web archive
                  </p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'video360' ? null : 'video360')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'video360' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'video360' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'video360' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Professional rotating platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Slow-motion video capture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Instant sharing via QR code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Complete web video archive</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Low Fog */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1775117419764-177be61d070c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Low Fog"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Zap className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Low Fog</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-3">
                    Dance floor fog effect for magical atmosphere
                  </p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'fog' ? null : 'fog')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'fog' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'fog' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'fog' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Heavy fog stays at ground level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Creates dreamy first dance effect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Safe, non-toxic fog solution</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cold Sparks */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1770108007353-ce33f03a11d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Cold Sparks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Cold Sparks</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-3">
                    Indoor pyrotechnics for stunning visual effects
                  </p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'sparks' ? null : 'sparks')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'sparks' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'sparks' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'sparks' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Indoor-safe cold spark fountains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Up to 3 meters high effect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>No smoke or burning smell</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Perfect for entrance or first dance</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Guestbook Phone */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1766918780914-c04a3b83229c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Guestbook Phone"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Guestbook Phone</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-3">
                    Capture audio messages from your guests
                  </p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'phone' ? null : 'phone')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'phone' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'phone' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'phone' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Vintage rotary phone setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Guests leave voice messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Digital audio file delivered after event</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Instax Mini */}
            <div className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1559758942-9fcc1c7dcf1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Instax Mini"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 text-[#111111] px-2 py-1 rounded text-[12px] font-medium">
                  Simple Option
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Camera className="w-5 h-5 text-[#111111] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium text-[#111111] mb-2">Instax Mini</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-3">
                    DIY instant camera rental for budget-friendly events
                  </p>
                  <button
                    onClick={() => setExpandedService(expandedService === 'instax' ? null : 'instax')}
                    className="flex items-center gap-1 text-[14px] text-[#111111] hover:text-[#6B6B6B] transition-colors"
                  >
                    {expandedService === 'instax' ? 'Less details' : '+ More details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedService === 'instax' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedService === 'instax' && (
                <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
                  <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Instant mini-format prints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Camera rental for DIY setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#111111] mt-0.5">•</span>
                      <span>Budget-friendly alternative</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-3">
            Pricing
          </h2>
          <p className="text-[14px] text-[#6B6B6B] text-center mb-10">
            Transparent pricing, no hidden fees
          </p>

          <div className="bg-white rounded-xl p-6 md:p-8 mb-6">
            <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Booth
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-[#EAEAEA] rounded-lg p-4">
                <div className="text-[14px] text-[#6B6B6B] mb-2">2 hours</div>
                <div className="text-[32px] font-bold text-[#111111]">250€</div>
              </div>
              <div className="border-2 border-[#111111] rounded-lg p-4 relative">
                <div className="absolute -top-3 left-4 bg-[#111111] text-white px-3 py-1 rounded text-[12px] font-medium">
                  Most Popular
                </div>
                <div className="text-[14px] text-[#6B6B6B] mb-2">3 hours</div>
                <div className="text-[32px] font-bold text-[#111111]">299€</div>
              </div>
              <div className="border border-[#EAEAEA] rounded-lg p-4">
                <div className="text-[14px] text-[#6B6B6B] mb-2">4 hours</div>
                <div className="text-[32px] font-bold text-[#111111]">350€</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 md:p-8 mb-6">
            <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video 360
            </h3>
            <div className="border border-[#EAEAEA] rounded-lg p-4 inline-block">
              <div className="text-[14px] text-[#6B6B6B] mb-2">3 hours</div>
              <div className="text-[32px] font-bold text-[#111111]">299€</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 md:p-8">
            <h3 className="text-[18px] font-medium text-[#111111] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Additional Services
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#EAEAEA]">
                <div>
                  <div className="text-[16px] text-[#111111] mb-1">Pyrotechnics</div>
                  <div className="text-[12px] text-[#6B6B6B]">60€ with Photo Booth/360</div>
                </div>
                <div className="text-[18px] font-medium text-[#111111]">120€</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#EAEAEA]">
                <div>
                  <div className="text-[16px] text-[#111111] mb-1">Low Fog</div>
                  <div className="text-[12px] text-[#6B6B6B]">60€ with Photo Booth/360</div>
                </div>
                <div className="text-[18px] font-medium text-[#111111]">120€</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[16px] text-[#111111] mb-1">Guestbook Phone</div>
                  <div className="text-[12px] text-[#6B6B6B]">60€ with Photo Booth/360</div>
                </div>
                <div className="text-[18px] font-medium text-[#111111]">120€</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[14px] text-[#6B6B6B]">
            + transportation 0.35€/km (from Bratislava/Vienna)
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center text-[18px] font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-[16px] font-medium text-[#111111] mb-2">Send Request</h3>
              <p className="text-[14px] text-[#6B6B6B]">Fill out the form with event date and type</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center text-[18px] font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-[16px] font-medium text-[#111111] mb-2">We Confirm Availability</h3>
              <p className="text-[14px] text-[#6B6B6B]">We'll get back to you within 24h on business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center text-[18px] font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-[16px] font-medium text-[#111111] mb-2">We Handle Everything</h3>
              <p className="text-[14px] text-[#6B6B6B]">Setup, operation, and technical support during event</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center text-[18px] font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-[16px] font-medium text-[#111111] mb-2">Gallery Ready</h3>
              <p className="text-[14px] text-[#6B6B6B]">All photos and videos in online gallery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 md:py-16 px-4 bg-[#FAFAFA]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-3">
            Recent Events
          </h2>
          <p className="text-[14px] text-[#6B6B6B] text-center mb-10">
            Latest highlights from our portfolio
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onClick={() => handleEventClick(i)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={`https://images.unsplash.com/photo-${
                    [
                      '1768244016517-2ec30e558a78',
                      '1762237826378-a7122dfd72eb',
                      '1764269716109-5ef0066412ef',
                      '1768053922335-d6f69bbc2a81',
                      '1762709117928-b3662d515832',
                      '1761774958264-f14d8f88cff5'
                    ][i - 1]
                  }?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`}
                  alt={`Event ${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[14px] font-medium">
                    View Gallery
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setCurrentPage('gallery');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#111111] text-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors font-medium"
            >
              View All Events
              <span className="text-[18px]">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-[#111111] text-white">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold mb-4">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-[16px] text-white/80 mb-8">
            We'll check availability and send you a personalized quote
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-[#111111] px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-100 transition-colors"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-10">
            Contact
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="tel:+421900000000"
              className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-6 h-6 text-[#111111]" />
              <div>
                <div className="text-[12px] text-[#6B6B6B] mb-1">Phone</div>
                <div className="text-[16px] text-[#111111] font-medium">+421 900 000 000</div>
              </div>
            </a>

            <a
              href="mailto:info@arraprod.sk"
              className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-[#111111]" />
              <div>
                <div className="text-[12px] text-[#6B6B6B] mb-1">Email</div>
                <div className="text-[16px] text-[#111111] font-medium">info@arraprod.sk</div>
              </div>
            </a>

            <a
              href="https://wa.me/421900000000"
              className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-[#111111]" />
              <div>
                <div className="text-[12px] text-[#6B6B6B] mb-1">WhatsApp</div>
                <div className="text-[16px] text-[#111111] font-medium">+421 900 000 000</div>
              </div>
            </a>

            <a
              href="https://instagram.com/arraprod"
              className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-6 h-6 text-[#111111]" />
              <div>
                <div className="text-[12px] text-[#6B6B6B] mb-1">Instagram</div>
                <div className="text-[16px] text-[#111111] font-medium">@arraprod</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] border-t border-[#EAEAEA] py-10 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-[18px] font-semibold text-[#111111] mb-4">ARRA Production</h3>
              <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
                Premium event services for unforgettable experiences. Slovakia & Austria.
              </p>
            </div>

            <div>
              <h4 className="text-[16px] font-medium text-[#111111] mb-4">Services</h4>
              <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                <li>Photo Booth</li>
                <li>Video 360</li>
                <li>Pyrotechnics</li>
                <li>Guestbook Phone</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[16px] font-medium text-[#111111] mb-4">Legal</h4>
              <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Business ID: 12345678</li>
                <li>Tax ID: SK1234567890</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#EAEAEA] text-center text-[14px] text-[#6B6B6B]">
            © 2026 ARRA Production. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/421900000000"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[500px] w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[22px] font-semibold text-[#111111] mb-6">Check Availability</h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Event Date with Date Picker */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Event Date</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] text-left flex items-center justify-between ${
                      !selectedDate ? 'text-[#9E9E9E]' : 'text-[#111111]'
                    } ${!selectedDate && emailError ? 'border-red-500' : 'border-[#EAEAEA]'}`}
                  >
                    <span>{selectedDate ? format(selectedDate, 'PPP') : 'Select date'}</span>
                    <CalendarIcon className="w-5 h-5 text-[#6B6B6B]" />
                  </button>

                  {showDatePicker && (
                    <>
                      <div
                        className="fixed inset-0 z-[9]"
                        onClick={() => setShowDatePicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 bg-white border border-[#EAEAEA] rounded-lg shadow-lg z-10 p-3">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Email (Required) */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] ${
                    emailError ? 'border-red-500' : 'border-[#EAEAEA]'
                  }`}
                />
                {emailError && (
                  <p className="text-[12px] text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Phone number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="+421 900 000 000"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] ${
                    phoneError ? 'border-red-500' : 'border-[#EAEAEA]'
                  }`}
                />
                <p className="text-[12px] text-[#6B6B6B] mt-1">Prefer a call? Add your phone number.</p>
                {phoneError && (
                  <p className="text-[12px] text-red-500 mt-1">{phoneError}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Location</label>
                <input
                  type="text"
                  placeholder="E.g. Bratislava, Hotel XY"
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Event Type (Optional) */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Event Type <span className="text-[#9E9E9E]">(optional)</span></label>
                <select className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]">
                  <option value="">Select type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="prom">Prom</option>
                  <option value="private">Private Party</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Number of Guests (Optional) */}
              <div>
                <label className="block text-[14px] text-[#111111] mb-2">Number of Guests <span className="text-[#9E9E9E]">(optional)</span></label>
                <input
                  type="number"
                  placeholder="E.g. 100"
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Alternative Contact Options */}
              <div className="pt-4 border-t border-[#EAEAEA]">
                <p className="text-[14px] text-[#6B6B6B] mb-3">Prefer instant response?</p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/421900000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 border border-[#25D366] text-[#25D366] rounded-lg hover:bg-[#25D366] hover:text-white transition-colors text-center text-[14px] font-medium"
                  >
                    WhatsApp us
                  </a>
                  <a
                    href="tel:+421900000000"
                    className="flex-1 px-4 py-2 border border-[#111111] text-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors text-center text-[14px] font-medium"
                  >
                    Call now
                  </a>
                </div>
              </div>

              {/* Trust Message */}
              <p className="text-[12px] text-[#6B6B6B] text-center">
                We will respond within 24 hours.
              </p>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEmailError('');
                    setPhoneError('');
                  }}
                  className="flex-1 px-6 py-3 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-6 py-4 rounded-lg shadow-lg max-w-[500px] w-full mx-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div className="text-[14px]">
              <strong>Request received!</strong> We will respond within 24 hours.
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[400px] w-full p-6 md:p-8">
            <h3 className="text-[22px] font-semibold text-[#111111] mb-4">Gallery Access</h3>
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
                  window.open(`https://fotoshare.co/e/event-${selectedEvent}`, '_blank');
                }}
                className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop Lightbox */}
      {showBackdropLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowBackdropLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => setCurrentBackdropIndex((currentBackdropIndex - 1 + backdrops.length) % backdrops.length)}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-[900px] max-h-[80vh] w-full">
            <img
              src={backdrops[currentBackdropIndex]}
              alt={`Backdrop ${currentBackdropIndex + 1}`}
              className="w-full h-full object-contain rounded"
            />
            <div className="text-center mt-4 text-white text-[14px]">
              {currentBackdropIndex + 1} / {backdrops.length}
            </div>
          </div>

          <button
            onClick={() => setCurrentBackdropIndex((currentBackdropIndex + 1) % backdrops.length)}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}