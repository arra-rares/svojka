import { useRef, useState, type FormEvent } from 'react';
import { de, enUS, sk } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import '@/styles/datepicker.css';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { RecaptchaField, type RecaptchaFieldHandle } from '@/components/RecaptchaField';
import { HeaderBrand } from '@/components/HeaderBrand';
import { CTA } from '@/components/landing/CTA';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';
import { Gallery } from '@/components/landing/Gallery';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Services } from '@/components/landing/Services';
import { SocialProof } from '@/components/landing/SocialProof';
import { telHref, whatsappHref } from '@/content/contactStatic';
import { submitLead } from '@/lib/leadClient';
import { useLocaleContext, useSiteContent } from '@/context/LocaleContext';

const dateFnsLocaleByLocale = {
  en: enUS,
  sk,
  de,
} as const;

const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '').trim();

type LandingProps = {
  onNavigateToGallery: () => void;
};

export function Landing({ onNavigateToGallery }: LandingProps) {
  const { locale } = useLocaleContext();
  const {
    bookingFormContent,
    floatingContactContent,
    formValidationMessages,
    successToastContent,
  } = useSiteContent();
  const dateLocale = dateFnsLocaleByLocale[locale];

  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateError, setDateError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const recaptchaRef = useRef<RecaptchaFieldHandle>(null);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailError('');
    setPhoneError('');
    setDateError('');
    setSubmitError('');
    setRecaptchaError('');

    let hasErrors = false;

    if (!selectedDate) {
      setDateError(formValidationMessages.dateRequired);
      hasErrors = true;
    }

    if (!email || !validateEmail(email)) {
      setEmailError(formValidationMessages.emailInvalid);
      hasErrors = true;
    }

    if (phoneNumber && !validatePhone(phoneNumber)) {
      setPhoneError(formValidationMessages.phoneInvalid);
      hasErrors = true;
    }

    if (hasErrors || !selectedDate) return;

    if (!recaptchaToken) {
      setRecaptchaError(formValidationMessages.recaptchaRequired);
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        event_date: format(selectedDate, 'yyyy-MM-dd'),
        email: email.trim(),
        phone: phoneNumber.trim() || undefined,
        location: location.trim() || undefined,
        type: eventType || undefined,
        people: guestCount.trim() || undefined,
        recaptcha_token: recaptchaToken,
        company_website: honeypot,
      });

      setShowForm(false);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 5000);
      setSelectedDate(undefined);
      setEmail('');
      setPhoneNumber('');
      setLocation('');
      setEventType('');
      setGuestCount('');
      setHoneypot('');
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : formValidationMessages.submitFailed;
      setSubmitError(message);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  }

  function closeBookingForm() {
    setShowForm(false);
    setEmailError('');
    setPhoneError('');
    setDateError('');
    setSubmitError('');
    setRecaptchaError('');
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <HeaderBrand />
          <LanguageSwitcher />
        </div>
      </header>

      <Hero onOpenBookingForm={() => setShowForm(true)} />
      <SocialProof />
      <Services />
      <Pricing />
      <HowItWorks />
      <Gallery onViewAll={onNavigateToGallery} />
      <CTA onOpenBookingForm={() => setShowForm(true)} />
      <Contact />
      <Footer />

      <a
        href={whatsappHref}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors"
        aria-label={floatingContactContent.whatsappAriaLabel}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-[500px] w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[22px] font-semibold text-[#111111] mb-6">{bookingFormContent.title}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div
                aria-hidden="true"
                className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="booking-company-website">Company website</label>
                <input
                  id="booking-company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(ev) => setHoneypot(ev.target.value)}
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-event-date">
                  {bookingFormContent.eventDateLabel}
                </label>
                <div className="relative">
                  <button
                    id="booking-event-date"
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] text-left flex items-center justify-between ${
                      !selectedDate ? 'text-[#9E9E9E]' : 'text-[#111111]'
                    } ${dateError ? 'border-red-500' : 'border-[#EAEAEA]'}`}
                  >
                    <span>
                      {selectedDate
                        ? format(selectedDate, 'PPP', { locale: dateLocale })
                        : bookingFormContent.eventDatePlaceholder}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-[#6B6B6B]" />
                  </button>
                  {dateError ? <p className="text-[12px] text-red-500 mt-1">{dateError}</p> : null}

                  {showDatePicker ? (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-[9] cursor-default bg-transparent border-0 p-0"
                        aria-label={bookingFormContent.closeCalendarAriaLabel}
                        onClick={() => setShowDatePicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 bg-white border border-[#EAEAEA] rounded-lg shadow-lg z-10 p-3">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setDateError('');
                            setShowDatePicker(false);
                          }}
                          disabled={{ before: new Date() }}
                          locale={dateLocale}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-email">
                  {bookingFormContent.emailLabel}
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    setEmailError('');
                  }}
                  placeholder={bookingFormContent.emailPlaceholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] ${
                    emailError ? 'border-red-500' : 'border-[#EAEAEA]'
                  }`}
                />
                {emailError ? <p className="text-[12px] text-red-500 mt-1">{emailError}</p> : null}
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-phone">
                  {bookingFormContent.phoneLabel}
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(ev) => {
                    setPhoneNumber(ev.target.value);
                    setPhoneError('');
                  }}
                  placeholder={bookingFormContent.phonePlaceholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#111111] ${
                    phoneError ? 'border-red-500' : 'border-[#EAEAEA]'
                  }`}
                />
                <p className="text-[12px] text-[#6B6B6B] mt-1">{bookingFormContent.phoneHint}</p>
                {phoneError ? <p className="text-[12px] text-red-500 mt-1">{phoneError}</p> : null}
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-location">
                  {bookingFormContent.locationLabel}
                </label>
                <input
                  id="booking-location"
                  type="text"
                  value={location}
                  onChange={(ev) => setLocation(ev.target.value)}
                  placeholder={bookingFormContent.locationPlaceholder}
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-event-type">
                  {bookingFormContent.eventTypeLabel}{' '}
                  <span className="text-[#9E9E9E]">{bookingFormContent.eventTypeOptional}</span>
                </label>
                <select
                  id="booking-event-type"
                  value={eventType}
                  onChange={(ev) => setEventType(ev.target.value)}
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
                >
                  {bookingFormContent.eventTypeOptions.map((opt) => (
                    <option key={opt.value || 'empty'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] text-[#111111] mb-2" htmlFor="booking-guests">
                  {bookingFormContent.guestCountLabel}{' '}
                  <span className="text-[#9E9E9E]">{bookingFormContent.guestCountOptional}</span>
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(ev) => setGuestCount(ev.target.value)}
                  placeholder={bookingFormContent.guestCountPlaceholder}
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="pt-4 border-t border-[#EAEAEA]">
                <p className="text-[14px] text-[#6B6B6B] mb-3">{bookingFormContent.instantResponseLead}</p>
                <div className="flex gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 border border-[#25D366] text-[#25D366] rounded-lg hover:bg-[#25D366] hover:text-white transition-colors text-center text-[14px] font-medium"
                  >
                    {bookingFormContent.whatsappButton}
                  </a>
                  <a
                    href={telHref}
                    className="flex-1 px-4 py-2 border border-[#111111] text-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors text-center text-[14px] font-medium"
                  >
                    {bookingFormContent.callButton}
                  </a>
                </div>
              </div>

              <p className="text-[12px] text-[#6B6B6B] text-center">{bookingFormContent.trustLine}</p>

              <div>
                <RecaptchaField
                  ref={recaptchaRef}
                  siteKey={recaptchaSiteKey}
                  onTokenChange={(token) => {
                    setRecaptchaToken(token);
                    if (token) {
                      setRecaptchaError('');
                    }
                  }}
                />
                {recaptchaError ? <p className="text-[12px] text-red-500 mt-2">{recaptchaError}</p> : null}
              </div>

              {submitError ? <p className="text-[12px] text-red-500">{submitError}</p> : null}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBookingForm}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {bookingFormContent.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors disabled:opacity-60"
                >
                  {submitting ? bookingFormContent.submitting : bookingFormContent.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showSuccess ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-6 py-4 rounded-lg shadow-lg max-w-[500px] w-full mx-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {successToastContent.checkmark}
            </div>
            <div className="text-[14px]">
              <strong>{successToastContent.lineBold}</strong> {successToastContent.lineRest}
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
