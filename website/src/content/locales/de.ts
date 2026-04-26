import {
  backdropImageUrls,
  galleryMockThumbnailUrls,
  heroImageUrl,
  recentEventImageUrls,
  serviceImageUrls,
} from '@/content/images';
import type { SiteContent } from '@/content/locales/en';

export const de: SiteContent = {
  floatingContactContent: {
    whatsappAriaLabel: 'WhatsApp',
  },

  bookingFormContent: {
    title: 'Verfügbarkeit prüfen',
    eventDateLabel: 'Veranstaltungsdatum',
    eventDatePlaceholder: 'Datum wählen',
    emailLabel: 'E-Mail',
    emailPlaceholder: 'ihre@email.com',
    phoneLabel: 'Telefonnummer',
    phonePlaceholder: '+421 900 000 000',
    phoneHint: 'Lieber Anruf? Telefonnummer angeben.',
    locationLabel: 'Ort',
    locationPlaceholder: 'z. B. Bratislava, Hotel XY',
    eventTypeLabel: 'Art der Veranstaltung',
    eventTypeOptional: '(optional)',
    eventTypePlaceholder: 'Art wählen',
    guestCountLabel: 'Anzahl der Gäste',
    guestCountOptional: '(optional)',
    guestCountPlaceholder: 'z. B. 100',
    instantResponseLead: 'Sofortige Antwort gewünscht?',
    whatsappButton: 'WhatsApp',
    callButton: 'Anrufen',
    trustLine: 'Wir melden uns innerhalb von 24 Stunden.',
    cancel: 'Abbrechen',
    submit: 'Anfrage senden',
    closeCalendarAriaLabel: 'Kalender schließen',
    eventTypeOptions: [
      { value: '', label: 'Art wählen' },
      { value: 'wedding', label: 'Hochzeit' },
      { value: 'corporate', label: 'Firmenveranstaltung' },
      { value: 'prom', label: 'Abschlussball' },
      { value: 'private', label: 'Private Feier' },
      { value: 'other', label: 'Sonstiges' },
    ],
  },

  formValidationMessages: {
    emailInvalid: 'Bitte gültige E-Mail eingeben',
    phoneInvalid: 'Bitte gültige Telefonnummer eingeben',
  },

  successToastContent: {
    checkmark: '✓',
    lineBold: 'Anfrage erhalten!',
    lineRest: 'Wir melden uns innerhalb von 24 Stunden.',
  },

  galleryPasswordModalContent: {
    title: 'Galerie-Zugang',
    description: 'Zugang wird vom Veranstalter bereitgestellt.',
    passwordPlaceholder: 'Galerie-Passwort',
    cancel: 'Abbrechen',
    enter: 'Öffnen',
    eventDetailConnector: '—',
  },

  headerContent: {
    brand: 'ARRA',
  },

  heroContent: {
    title: 'Premium-Erlebnis für Ihre Veranstaltung',
    subtitle:
      'Sofortdruck, unbegrenzte Aufnahmen und professioneller Service für Hochzeiten und Firmenevents',
    cta: 'Verfügbarkeit prüfen',
    imageSrc: heroImageUrl,
    imageAlt: 'Feier und Event',
  },

  socialProofContent: {
    statValue: '100+',
    statLabel: 'erfolgreich durchgeführte Veranstaltungen',
    testimonials: [
      {
        quote:
          '"Perfekter Service, die Gäste waren begeistert. Die Fotos in der Galerie sind großartig!"',
        attribution: '— Lucia K., Hochzeit',
      },
      {
        quote:
          '"Video 360 war das Highlight des Abends. Professionell von Anfang bis Ende."',
        attribution: '— Marek T., Firmenveranstaltung',
      },
      {
        quote: '"Sofortdruck hat alle beeindruckt. Sehr empfehlenswert!"',
        attribution: '— Eva S., Ball',
      },
    ],
  },

  servicesContent: {
    title: 'Unsere Leistungen',
    toggleExpand: '+ Mehr Details',
    toggleCollapse: 'Weniger Details',
    backdropExamplesTitle: 'Hintergrundbeispiele',
    viewAllBackdrops: 'Alle Hintergründe anzeigen',
    backdropAltPrefix: 'Hintergrund',
    lightboxCounterSeparator: '/',
    listItemMarker: '•',
    services: [
      {
        id: 'photobox',
        badge: { text: 'Am beliebtesten', style: 'dark' as const },
        imageSrc: serviceImageUrls.photobox,
        imageAlt: 'Fotobox',
        icon: 'camera' as const,
        title: 'Fotobox',
        description: 'Sofortdruck, unbegrenzte Aufnahmen, Requisiten & Online-Galerie',
        footnote: 'Zwei Druckformate inklusive',
        detailBullets: [
          'Mehrere Hintergründe verfügbar',
          'Individuelles Druckdesign mit Ihrem Branding',
          'Requisiten und Zubehör inklusive',
          'Personal vor Ort für den ganzen Event',
        ],
        backdrops: backdropImageUrls,
      },
      {
        id: 'video360',
        badge: { text: 'Trend', style: 'light' as const },
        imageSrc: serviceImageUrls.video360,
        imageAlt: 'Video 360',
        icon: 'video' as const,
        title: 'Video 360',
        description: 'Drehbühne für dynamische Videos & Web-Archiv',
        detailBullets: [
          'Professionelle Drehplattform',
          'Zeitlupen-Aufnahme',
          'Sofortiges Teilen per QR-Code',
          'Vollständiges Web-Video-Archiv',
        ],
      },
      {
        id: 'fog',
        imageSrc: serviceImageUrls.lowFog,
        imageAlt: 'Bodennebel',
        icon: 'zap' as const,
        title: 'Bodennebel',
        description: 'Tanzflächen-Nebel für magische Atmosphäre',
        detailBullets: [
          'Schwerer Nebel bleibt am Boden',
          'Traumhafter Eröffnungstanz',
          'Unbedenkliche, ungiftige Nebelflüssigkeit',
        ],
      },
      {
        id: 'sparks',
        imageSrc: serviceImageUrls.coldSparks,
        imageAlt: 'Kaltfeuer',
        icon: 'sparkles' as const,
        title: 'Kaltfeuer',
        description: 'Indoor-Pyrotechnik für starke visuelle Effekte',
        detailBullets: [
          'Indoor-sichere Kaltfeuer-Fontänen',
          'Effekt bis zu 3 m hoch',
          'Kein Rauch, kein Brandgeruch',
          'Ideal für Einzug oder Eröffnungstanz',
        ],
      },
      {
        id: 'phone',
        imageSrc: serviceImageUrls.guestbookPhone,
        imageAlt: 'Gästebuch-Telefon',
        icon: 'phone' as const,
        title: 'Gästebuch-Telefon',
        description: 'Sprachnachrichten Ihrer Gäste aufnehmen',
        detailBullets: [
          'Vintage-Drehwahltelefon',
          'Gäste hinterlassen Sprachnachrichten',
          'Digitale Audiodatei nach dem Event',
        ],
      },
      {
        id: 'instax',
        badge: { text: 'Einfache Option', style: 'light' as const },
        imageSrc: serviceImageUrls.instaxMini,
        imageAlt: 'Instax Mini',
        icon: 'camera' as const,
        title: 'Instax Mini',
        description: 'DIY-Sofortbildkamera-Verleih für kleinere Budgets',
        detailBullets: [
          'Sofortige Mini-Abzüge',
          'Kamera-Verleih zum Selbstaufbau',
          'Budgetfreundliche Alternative',
        ],
      },
    ],
  },

  pricingContent: {
    title: 'Preise',
    subtitle: 'Transparente Preise, keine versteckten Gebühren',
    photoBooth: {
      title: 'Fotobox',
      icon: 'camera' as const,
      tiers: [
        { durationLabel: '2 Stunden', price: 'ab 250€', highlighted: false },
        { durationLabel: '3 Stunden', price: 'ab 299€', highlighted: true, badge: 'Am beliebtesten' },
        { durationLabel: '4 Stunden', price: 'ab 350€', highlighted: false },
      ],
    },
    video360: {
      title: 'Video 360',
      icon: 'video' as const,
      tier: { durationLabel: '3 Stunden', price: 'ab 299€' },
    },
    additional: {
      title: 'Zusatzleistungen',
      icon: 'sparkles' as const,
      rows: [
        {
          name: 'Pyrotechnik',
          note: '60€ mit Fotobox/360',
          price: 'ab 120€',
        },
        {
          name: 'Bodennebel',
          note: '60€ mit Fotobox/360',
          price: 'ab 120€',
        },
        {
          name: 'Gästebuch-Telefon',
          note: '60€ mit Fotobox/360',
          price: 'ab 120€',
        },
      ],
    },
    transportationNote: '+ Anfahrt 0,35 €/km ab Bratislava',
    pricingFootnote:
      'Preise gelten innerhalb der Slowakei. Endpreise für Veranstaltungen außerhalb der Slowakei können aufgrund der Logistik variieren.',
  },

  howItWorksContent: {
    title: 'Ablauf',
    steps: [
      {
        number: '1',
        title: 'Anfrage senden',
        description: 'Formular mit Datum und Art der Veranstaltung ausfüllen',
      },
      {
        number: '2',
        title: 'Wir bestätigen die Verfügbarkeit',
        description: 'Wir melden uns werktags innerhalb von 24 Stunden',
      },
      {
        number: '3',
        title: 'Wir kümmern uns um alles',
        description: 'Aufbau, Betrieb und technischer Support während des Events',
      },
      {
        number: '4',
        title: 'Galerie bereit',
        description: 'Alle Fotos und Videos in der Online-Galerie',
      },
    ],
  },

  gallerySectionContent: {
    title: 'Aktuelle Events',
    subtitle: 'Auszüge aus unserem Portfolio',
    viewGalleryHover: 'Galerie ansehen',
    viewAllButton: 'Alle Events',
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
    backToHome: 'Zur Startseite',
    pageTitle: 'Finden Sie Ihr Event',
    pageSubtitle: 'Suche nach Datum oder Ort',
    searchPlaceholder: 'Nach Datum oder Ort suchen',
    emptyTitle: 'Keine Events gefunden',
    emptySubtitle: 'Versuchen Sie andere Suchbegriffe',
    paginationPrevious: 'Zurück',
    paginationNext: 'Weiter',
    showingLineParts: {
      prefix: 'Zeige',
      of: 'von',
      suffix: 'Events',
    },
    rangeSeparator: '–',
    mock: {
      eventsPerPage: 24,
      eventCount2026: 35,
      eventCount2025: 38,
      thumbnailUrls: [...galleryMockThumbnailUrls],
      locations: [
        'Bratislava',
        'Prag',
        'Budapest',
        'Košice',
        'Trenčín',
        'Piešťany',
        'Trnava',
      ],
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
    },
    eventCardAltJoiner: ' – ',
    collaboratorAttributionTemplate: 'Event organized in cooperation with [Partner Name]',
    collaboratorPartnerNames: ['Partner Name'],
  },

  footerContent: {
    brandColumn: {
      title: 'ARRA Production',
      description:
        'Premium-Event-Services für unvergessliche Erlebnisse. Slowakei.',
    },
    servicesColumn: {
      title: 'Leistungen',
      items: ['Fotobox', 'Video 360', 'Pyrotechnik', 'Bodennebel', 'Gästebuch-Telefon'],
    },
    legalColumn: {
      title: 'Rechtliches',
      items: [
        'Datenschutz',
        'AGB',
        'Firmenbuch: 12345678',
        'UID: SK1234567890',
      ],
    },
    copyright: '© 2026 ARRA Production. Alle Rechte vorbehalten.',
  },

  ctaContent: {
    title: 'Bereit für unvergessliche Erinnerungen?',
    subtitle: 'Wir prüfen die Verfügbarkeit und senden Ihnen ein individuelles Angebot',
    button: 'Verfügbarkeit prüfen',
  },
};
