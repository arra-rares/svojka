import {
  backdropImageUrls,
  galleryMockThumbnailUrls,
  heroImageUrl,
  recentEventImageUrls,
  serviceImageUrls,
} from '@/content/images';
import type { SiteContent } from '@/content/locales/en';

export const sk: SiteContent = {
  floatingContactContent: {
    whatsappAriaLabel: 'WhatsApp',
  },

  bookingFormContent: {
    title: 'Overiť dostupnosť',
    eventDateLabel: 'Dátum akcie',
    eventDatePlaceholder: 'Vyberte dátum',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vas@email.sk',
    phoneLabel: 'Telefónne číslo',
    phonePlaceholder: '+421 900 000 000',
    phoneHint: 'Preferujete hovor? Uveďte telefón.',
    locationLabel: 'Miesto',
    locationPlaceholder: 'Napr. Bratislava, Hotel XY',
    eventTypeLabel: 'Typ akcie',
    eventTypeOptional: '(voliteľné)',
    eventTypePlaceholder: 'Vyberte typ',
    guestCountLabel: 'Počet hostí',
    guestCountOptional: '(voliteľné)',
    guestCountPlaceholder: 'Napr. 100',
    instantResponseLead: 'Chcete odpoveď hneď?',
    whatsappButton: 'Napíšte nám na WhatsApp',
    callButton: 'Zavolať',
    trustLine: 'Ozveme sa do 24 hodín.',
    cancel: 'Zrušiť',
    submit: 'Odoslať dopyt',
    closeCalendarAriaLabel: 'Zavrieť kalendár',
    eventTypeOptions: [
      { value: '', label: 'Vyberte typ' },
      { value: 'wedding', label: 'Svadba' },
      { value: 'corporate', label: 'Firemná akcia' },
      { value: 'prom', label: 'Ples / stužková' },
      { value: 'private', label: 'Súkromná oslava' },
      { value: 'other', label: 'Iné' },
    ],
  },

  formValidationMessages: {
    emailInvalid: 'Zadajte platný e-mail',
    phoneInvalid: 'Zadajte platné telefónne číslo',
  },

  successToastContent: {
    checkmark: '✓',
    lineBold: 'Dopyt prijatý!',
    lineRest: 'Ozveme sa do 24 hodín.',
  },

  galleryPasswordModalContent: {
    title: 'Prístup do galérie',
    description: 'Prístup poskytuje organizátor podujatia.',
    passwordPlaceholder: 'Heslo do galérie',
    cancel: 'Zrušiť',
    enter: 'Vstúpiť',
    eventDetailConnector: '—',
  },

  headerContent: {
    brand: 'ARRA',
  },

  heroContent: {
    title: 'Prémiový zážitok na vašu akciu',
    subtitle:
      'Okamžité fotky, neobmedzené zábery a profesionálny servis na svadby a firemné podujatia',
    cta: 'Overiť dostupnosť',
    imageSrc: heroImageUrl,
    imageAlt: 'Oslava a akcia',
  },

  socialProofContent: {
    statValue: '100+',
    statLabel: 'úspešne zrealizovaných akcií',
  },

  servicesContent: {
    title: 'Naše služby',
    toggleExpand: '+ Viac detailov',
    toggleCollapse: 'Menej detailov',
    backdropExamplesTitle: 'Ukážky pozadí',
    viewAllBackdrops: 'Zobraziť všetky pozadia',
    backdropAltPrefix: 'Pozadie',
    lightboxCounterSeparator: '/',
    listItemMarker: '•',
    services: [
      {
        id: 'photobox',
        badge: { text: 'Najobľúbenejšie', style: 'dark' as const },
        imageSrc: serviceImageUrls.photobox,
        imageAlt: 'Fotokútik',
        icon: 'camera' as const,
        title: 'Fotokútik',
        description: 'Okamžitý tlač, neobmedzené zábery, rekvizity a webová galéria',
        footnote: 'V cene dva formáty tlače',
        detailBullets: [
          'Viacero pozadí na výber',
          'Vlastný dizajn tlače s vašou značkou',
          'Rekvizity a doplnky v cene',
          'Personál na mieste počas celej akcie',
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
        description: 'Otočná plošina pre dynamické videá a webový archív',
        detailBullets: [
          'Profesionálna otočná plošina',
          'Záber v spomalenom zábere',
          'Okamžité zdieľanie cez QR kód',
          'Kompletný webový video archív',
        ],
      },
      {
        id: 'fog',
        imageSrc: serviceImageUrls.lowFog,
        imageAlt: 'Nízka hmla',
        icon: 'zap' as const,
        title: 'Nízka hmla',
        description: 'Efekt hmly na parkete pre magickú atmosféru',
        detailBullets: [
          'Hustá hmla drží pri zemi',
          'Romantický efekt prvého tanca',
          'Bezpečné, netoxické zloženie',
        ],
      },
      {
        id: 'sparks',
        imageSrc: serviceImageUrls.coldSparks,
        imageAlt: 'Studené iskry',
        icon: 'sparkles' as const,
        title: 'Studené iskry',
        description: 'Indoor pyrotechnika pre výrazné vizuálne efekty',
        detailBullets: [
          'Bezpečné studené fontány do interiéru',
          'Efekt až do 3 metrov',
          'Bez dymu a zápachu horenia',
          'Ideálne na vstup alebo prvý tanec',
        ],
      },
      {
        id: 'phone',
        imageSrc: serviceImageUrls.guestbookPhone,
        imageAlt: 'Telefón do knihy hostí',
        icon: 'phone' as const,
        title: 'Telefón do knihy hostí',
        description: 'Zachyťte hlasové odkazy od hostí',
        detailBullets: [
          'Retro rotačný telefón',
          'Hostia zanechajú hlasové správy',
          'Digitálny audio súbor po akcii',
        ],
      },
      {
        id: 'instax',
        badge: { text: 'Jednoduchá voľba', style: 'light' as const },
        imageSrc: serviceImageUrls.instaxMini,
        imageAlt: 'Instax Mini',
        icon: 'camera' as const,
        title: 'Instax Mini',
        description: 'Prenájom instantnej kamery na DIY akcie s rozpočtom',
        detailBullets: [
          'Okamžité miniatúrne výtlačky',
          'Prenájom kamery na vlastnú inštaláciu',
          'Ekonomická alternatíva',
        ],
      },
    ],
  },

  pricingContent: {
    title: 'Cenník',
    subtitle: 'Transparentné ceny, bez skrytých poplatkov',
    photoBooth: {
      title: 'Fotokútik',
      icon: 'camera' as const,
      tiers: [
        { durationLabel: '2 hodiny', price: 'od 250€', highlighted: false },
        { durationLabel: '3 hodiny', price: 'od 299€', highlighted: true, badge: 'Najobľúbenejšie' },
        { durationLabel: '4 hodiny', price: 'od 350€', highlighted: false },
      ],
    },
    video360: {
      title: 'Video 360',
      icon: 'video' as const,
      tier: { durationLabel: '3 hodiny', price: 'od 299€' },
    },
    additional: {
      title: 'Doplnkové služby',
      icon: 'sparkles' as const,
      rows: [
        {
          name: 'Pyrotechnika',
          note: '60€ s Fotokútikom / 360',
          price: 'od 120€',
        },
        {
          name: 'Nízka hmla',
          note: '60€ s Fotokútikom / 360',
          price: 'od 120€',
        },
        {
          name: 'Telefón do knihy hostí',
          note: '60€ s Fotokútikom / 360',
          price: 'od 120€',
        },
        {
          name: 'Prenájom Instax Mini',
          note: 'Jednoduchá DIY voľba',
          price: 'od 90€',
        },
      ],
    },
    transportationNote: '+ doprava 0,35 €/km z Bratislavy (Petržalka)',
    pricingFootnote:
      'Ceny platia v rámci Slovenska. Konečná cena pri akciách mimo Slovenska sa môže líšiť kvôli logistike.',
    pricingFootnoteExtra:
      'Obmedzenia miesta konania a prípadné povolenia špecifické pre miesto nie sú zahrnuté v cene.',
  },

  howItWorksContent: {
    title: 'Ako to funguje',
    steps: [
      {
        number: '1',
        title: 'Odoslanie dopytu',
        description: 'Vyplňte formulár s dátumom a typom akcie',
      },
      {
        number: '2',
        title: 'Potvrdíme dostupnosť',
        description: 'Ozveme sa do 24 hodín v pracovných dňoch',
      },
      {
        number: '3',
        title: 'Postaráme sa o všetko',
        description: 'Inštalácia, prevádzka a technická podpora počas akcie',
      },
      {
        number: '4',
        title: 'Galéria je hotová',
        description: 'Všetky fotky a videá v online galérii',
      },
    ],
  },

  gallerySectionContent: {
    title: 'Nedávne akcie',
    subtitle: 'Výber z našej práce',
    viewGalleryHover: 'Otvoriť galériu',
    viewAllButton: 'Všetky akcie',
    viewAllArrow: '→',
    events: [
      { id: 1, imageSrc: recentEventImageUrls[0], imageAlt: 'Akcia 1' },
      { id: 2, imageSrc: recentEventImageUrls[1], imageAlt: 'Akcia 2' },
      { id: 3, imageSrc: recentEventImageUrls[2], imageAlt: 'Akcia 3' },
      { id: 4, imageSrc: recentEventImageUrls[3], imageAlt: 'Akcia 4' },
      { id: 5, imageSrc: recentEventImageUrls[4], imageAlt: 'Akcia 5' },
      { id: 6, imageSrc: recentEventImageUrls[5], imageAlt: 'Akcia 6' },
    ],
  },

  galleryPageContent: {
    backToHome: 'Späť na úvod',
    pageTitle: 'Nájdite svoju akciu',
    pageSubtitle: 'Hľadajte podľa dátumu alebo miesta',
    searchPlaceholder: 'Hľadať podľa dátumu alebo miesta',
    emptyTitle: 'Žiadne akcie',
    emptySubtitle: 'Skúste iný dátum alebo mesto',
    paginationPrevious: 'Späť',
    paginationNext: 'Ďalej',
    showingLineParts: {
      prefix: 'Zobrazené',
      of: 'z',
      suffix: 'akcií',
    },
    rangeSeparator: '–',
    mock: {
      eventsPerPage: 24,
      eventCount2026: 35,
      eventCount2025: 38,
      thumbnailUrls: [...galleryMockThumbnailUrls],
      locations: [
        'Bratislava',
        'Praha',
        'Budapešť',
        'Košice',
        'Trenčín',
        'Piešťany',
        'Trnava',
      ],
      months: [
        'január',
        'február',
        'marec',
        'apríl',
        'máj',
        'jún',
        'júl',
        'august',
        'september',
        'október',
        'november',
        'december',
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
        'Prémiové služby pre nezabudnuteľné zážitky. Slovensko.',
    },
    servicesColumn: {
      title: 'Služby',
      items: ['Fotokútik', 'Video 360', 'Pyrotechnika', 'Nízka hmla', 'Telefón do knihy hostí'],
    },
    legalColumn: {
      title: 'Právne informácie',
      links: [
        { label: 'Zásady ochrany osobných údajov', href: '/privacy' },
        { label: 'Obchodné podmienky', href: '/terms' },
        { label: 'GDPR informácie', href: '/gdpr' },
        { label: 'Zásady cookies', href: '/cookies' },
      ],
    },
    copyright: '© 2026 ARRA Production. Všetky práva vyhradené.',
  },

  ctaContent: {
    title: 'Pripravení na nezabudnuteľné spomienky?',
    subtitle: 'Overíme dostupnosť a pošleme vám ponuku na mieru',
    button: 'Overiť dostupnosť',
  },
};
