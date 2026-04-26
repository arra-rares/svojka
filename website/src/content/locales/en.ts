import {
  backdropImageUrls,
  galleryMockThumbnailUrls,
  heroImageUrl,
  recentEventImageUrls,
  serviceImageUrls,
} from '@/content/images';

export const en = {
  floatingContactContent: {
    whatsappAriaLabel: 'WhatsApp',
  },

  bookingFormContent: {
    title: 'Check Availability',
    eventDateLabel: 'Event Date',
    eventDatePlaceholder: 'Select date',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    phoneLabel: 'Phone number',
    phonePlaceholder: '+421 900 000 000',
    phoneHint: 'Prefer a call? Add your phone number.',
    locationLabel: 'Location',
    locationPlaceholder: 'E.g. Bratislava, Hotel XY',
    eventTypeLabel: 'Event Type',
    eventTypeOptional: '(optional)',
    eventTypePlaceholder: 'Select type',
    guestCountLabel: 'Number of Guests',
    guestCountOptional: '(optional)',
    guestCountPlaceholder: 'E.g. 100',
    instantResponseLead: 'Prefer instant response?',
    whatsappButton: 'WhatsApp us',
    callButton: 'Call now',
    trustLine: 'We will respond within 24 hours.',
    cancel: 'Cancel',
    submit: 'Send Request',
    closeCalendarAriaLabel: 'Close calendar',
    eventTypeOptions: [
      { value: '', label: 'Select type' },
      { value: 'wedding', label: 'Wedding' },
      { value: 'corporate', label: 'Corporate Event' },
      { value: 'prom', label: 'Prom' },
      { value: 'private', label: 'Private Party' },
      { value: 'other', label: 'Other' },
    ],
  },

  formValidationMessages: {
    emailInvalid: 'Please enter a valid email',
    phoneInvalid: 'Please enter a valid phone number',
  },

  successToastContent: {
    checkmark: '✓',
    lineBold: 'Request received!',
    lineRest: 'We will respond within 24 hours.',
  },

  galleryPasswordModalContent: {
    title: 'Gallery Access',
    description: 'Access provided by event organizer.',
    passwordPlaceholder: 'Gallery password',
    cancel: 'Cancel',
    enter: 'Enter',
    eventDetailConnector: '—',
  },

  headerContent: {
    brand: 'ARRA',
  },

  heroContent: {
    title: 'Premium Experience for Your Event',
    subtitle:
      'Instant photos, unlimited captures, and professional service for weddings and corporate events',
    cta: 'Check Availability',
    imageSrc: heroImageUrl,
    imageAlt: 'Event celebration',
  },

  socialProofContent: {
    statValue: '100+',
    statLabel: 'successfully completed events',
    testimonials: [
      {
        quote:
          '"Perfect service, guests were thrilled. Photos from the gallery are amazing!"',
        attribution: '— Lucia K., Wedding',
      },
      {
        quote:
          '"Video 360 was the highlight of the evening. Professional approach from start to finish."',
        attribution: '— Marek T., Corporate Event',
      },
      {
        quote: '"Instant photo printing impressed everyone. Definitely recommend!"',
        attribution: '— Eva S., Prom',
      },
    ],
  },

  servicesContent: {
    title: 'Our Services',
    toggleExpand: '+ More details',
    toggleCollapse: 'Less details',
    backdropExamplesTitle: 'Backdrop Examples',
    viewAllBackdrops: 'View all backdrops',
    backdropAltPrefix: 'Backdrop',
    lightboxCounterSeparator: '/',
    listItemMarker: '•',
    services: [
      {
        id: 'photobox',
        badge: { text: 'Most Popular', style: 'dark' as const },
        imageSrc: serviceImageUrls.photobox,
        imageAlt: 'Photo Booth',
        icon: 'camera' as const,
        title: 'Photo Booth',
        description: 'Instant printing, unlimited captures, props & web gallery',
        footnote: 'Two print formats included',
        detailBullets: [
          'Multiple backdrops available',
          'Custom print design with your branding',
          'Props and accessories included',
          'On-site staff for full event support',
        ],
        backdrops: backdropImageUrls,
      },
      {
        id: 'video360',
        badge: { text: 'Trending', style: 'light' as const },
        imageSrc: serviceImageUrls.video360,
        imageAlt: 'Video 360',
        icon: 'video' as const,
        title: 'Video 360',
        description: 'Spinning platform for dynamic videos & web archive',
        detailBullets: [
          'Professional rotating platform',
          'Slow-motion video capture',
          'Instant sharing via QR code',
          'Complete web video archive',
        ],
      },
      {
        id: 'fog',
        imageSrc: serviceImageUrls.lowFog,
        imageAlt: 'Low Fog',
        icon: 'zap' as const,
        title: 'Low Fog',
        description: 'Dance floor fog effect for magical atmosphere',
        detailBullets: [
          'Heavy fog stays at ground level',
          'Creates dreamy first dance effect',
          'Safe, non-toxic fog solution',
        ],
      },
      {
        id: 'sparks',
        imageSrc: serviceImageUrls.coldSparks,
        imageAlt: 'Cold Sparks',
        icon: 'sparkles' as const,
        title: 'Cold Sparks',
        description: 'Indoor pyrotechnics for stunning visual effects',
        detailBullets: [
          'Indoor-safe cold spark fountains',
          'Up to 3 meters high effect',
          'No smoke or burning smell',
          'Perfect for entrance or first dance',
        ],
      },
      {
        id: 'phone',
        imageSrc: serviceImageUrls.guestbookPhone,
        imageAlt: 'Guestbook Phone',
        icon: 'phone' as const,
        title: 'Guestbook Phone',
        description: 'Capture audio messages from your guests',
        detailBullets: [
          'Vintage rotary phone setup',
          'Guests leave voice messages',
          'Digital audio file delivered after event',
        ],
      },
      {
        id: 'instax',
        badge: { text: 'Simple Option', style: 'light' as const },
        imageSrc: serviceImageUrls.instaxMini,
        imageAlt: 'Instax Mini',
        icon: 'camera' as const,
        title: 'Instax Mini',
        description: 'DIY instant camera rental for budget-friendly events',
        detailBullets: [
          'Instant mini-format prints',
          'Camera rental for DIY setup',
          'Budget-friendly alternative',
        ],
      },
    ],
  },

  pricingContent: {
    title: 'Pricing',
    subtitle: 'Transparent pricing, no hidden fees',
    photoBooth: {
      title: 'Photo Booth',
      icon: 'camera' as const,
      tiers: [
        { durationLabel: '2 hours', price: 'from 250€', highlighted: false },
        { durationLabel: '3 hours', price: 'from 299€', highlighted: true, badge: 'Most Popular' },
        { durationLabel: '4 hours', price: 'from 350€', highlighted: false },
      ],
    },
    video360: {
      title: 'Video 360',
      icon: 'video' as const,
      tier: { durationLabel: '3 hours', price: 'from 299€' },
    },
    additional: {
      title: 'Additional Services',
      icon: 'sparkles' as const,
      rows: [
        {
          name: 'Pyrotechnics',
          note: '60€ with Photo Booth/360',
          price: 'from 120€',
        },
        {
          name: 'Low Fog',
          note: '60€ with Photo Booth/360',
          price: 'from 120€',
        },
        {
          name: 'Guestbook Phone',
          note: '60€ with Photo Booth/360',
          price: 'from 120€',
        },
      ],
    },
    transportationNote: '+ transportation 0.35€/km from Bratislava',
    pricingFootnote:
      'Prices apply within Slovakia. Final pricing may vary for events outside Slovakia due to logistics.',
  },

  howItWorksContent: {
    title: 'How It Works',
    steps: [
      {
        number: '1',
        title: 'Send Request',
        description: 'Fill out the form with event date and type',
      },
      {
        number: '2',
        title: 'We Confirm Availability',
        description: "We'll get back to you within 24h on business days",
      },
      {
        number: '3',
        title: 'We Handle Everything',
        description: 'Setup, operation, and technical support during event',
      },
      {
        number: '4',
        title: 'Gallery Ready',
        description: 'All photos and videos in online gallery',
      },
    ],
  },

  gallerySectionContent: {
    title: 'Recent Events',
    subtitle: 'Latest highlights from our portfolio',
    viewGalleryHover: 'View Gallery',
    viewAllButton: 'View All Events',
    viewAllArrow: '→',
    events: [
      { id: 1, imageSrc: recentEventImageUrls[0], imageAlt: 'Event 1' },
      { id: 2, imageSrc: recentEventImageUrls[1], imageAlt: 'Event 2' },
      { id: 3, imageSrc: recentEventImageUrls[2], imageAlt: 'Event 3' },
      { id: 4, imageSrc: recentEventImageUrls[3], imageAlt: 'Event 4' },
      { id: 5, imageSrc: recentEventImageUrls[4], imageAlt: 'Event 5' },
      { id: 6, imageSrc: recentEventImageUrls[5], imageAlt: 'Event 6' },
    ],
  },

  galleryPageContent: {
    backToHome: 'Back to Home',
    pageTitle: 'Find your event',
    pageSubtitle: 'Search by date or location to find your photos',
    searchPlaceholder: 'Search by date or location',
    emptyTitle: 'No events found',
    emptySubtitle: 'Try searching by date or location',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
    showingLineParts: {
      prefix: 'Showing',
      of: 'of',
      suffix: 'events',
    },
    rangeSeparator: '–',
    mock: {
      eventsPerPage: 24,
      eventCount2026: 35,
      eventCount2025: 38,
      thumbnailUrls: [...galleryMockThumbnailUrls],
      locations: [
        'Bratislava',
        'Prague',
        'Budapest',
        'Košice',
        'Trenčín',
        'Piešťany',
        'Trnava',
      ],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    eventCardAltJoiner: ' - ',
    collaboratorAttributionTemplate: 'Event organized in cooperation with [Partner Name]',
    collaboratorPartnerNames: ['Partner Name'],
  },

  footerContent: {
    brandColumn: {
      title: 'ARRA Production',
      description:
        'Premium event services for unforgettable experiences. Slovakia.',
    },
    servicesColumn: {
      title: 'Services',
      items: ['Photo Booth', 'Video 360', 'Fireworks', 'Low Fog', 'Guestbook Phone'],
    },
    legalColumn: {
      title: 'Legal',
      items: [
        'Privacy Policy',
        'Terms of Service',
        'Business ID: 12345678',
        'Tax ID: SK1234567890',
      ],
    },
    copyright: '© 2026 ARRA Production. All rights reserved.',
  },

  ctaContent: {
    title: 'Ready to Create Unforgettable Memories?',
    subtitle: "We'll check availability and send you a personalized quote",
    button: 'Check Availability',
  },
};

export type SiteContent = typeof en;
