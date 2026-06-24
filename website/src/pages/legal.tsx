import { legalCompanyInfo } from '@/content/company';

type LegalPageProps = {
  kind: 'privacy' | 'gdpr' | 'terms' | 'cookies';
  onBackHome: () => void;
};

const companyBlock = [
  `Controller name: ${legalCompanyInfo.name}`,
  `Registered address: ${legalCompanyInfo.addressLines.join(', ')}`,
  `Company ID (IČO): ${legalCompanyInfo.ico}`,
  `Tax ID (DIČ): ${legalCompanyInfo.dic}`,
  `VAT ID (IČ DPH): ${legalCompanyInfo.icDph}`,
  `Contact email: ${legalCompanyInfo.email}`,
];

const pageMeta = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: '2026-04-26',
    sections: [
      {
        heading: '1. Data Controller',
        body: companyBlock,
      },
      {
        heading: '2. What Data We Collect',
        body: [
          'Booking data: event date, email, phone (optional), location, event type, guest count.',
          'Gallery data: event access passwords entered by visitors (checked server-side only).',
          'Technical data: [PLACEHOLDER_LOGS_AND_ANALYTICS]',
        ],
      },
      {
        heading: '3. Why We Process Data',
        body: [
          'Lead handling and communication: [PLACEHOLDER_LEGAL_BASIS]',
          'Service delivery and support: [PLACEHOLDER_LEGAL_BASIS]',
          'Security and fraud prevention: [PLACEHOLDER_LEGAL_BASIS]',
        ],
      },
      {
        heading: '4. Retention',
        body: [
          'Lead records retention: [PLACEHOLDER_RETENTION_LEADS]',
          'Gallery records retention: [PLACEHOLDER_RETENTION_GALLERY]',
          'Deletion method: [PLACEHOLDER_DELETION_PROCESS]',
        ],
      },
    ],
  },
  gdpr: {
    title: 'GDPR Notice',
    lastUpdated: '2026-04-26',
    sections: [
      {
        heading: '1. Your Rights',
        body: [
          'Right of access',
          'Right to rectification',
          'Right to erasure',
          'Right to restriction of processing',
          'Right to data portability',
          'Right to object',
        ],
      },
      {
        heading: '2. How to Exercise Rights',
        body: [
          `Email: ${legalCompanyInfo.email}`,
          'Verification process: [PLACEHOLDER_VERIFICATION_PROCESS]',
          'Response time: [PLACEHOLDER_RESPONSE_SLA]',
        ],
      },
      {
        heading: '3. Processors and Transfers',
        body: [
          'Hosting provider: Webhouse',
          'Analytics provider: [PLACEHOLDER_ANALYTICS_PROVIDER]',
          'Media/gallery provider: Fotoshare',
          'International transfers: [PLACEHOLDER_TRANSFER_MECHANISM]',
        ],
      },
      {
        heading: '4. Supervisory Authority',
        body: [
          'Authority: Úrad na ochranu osobných údajov SR (UOOU)',
          'Website: https://dataprotection.gov.sk',
          'Contact: [PLACEHOLDER_AUTHORITY_CONTACT]',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: '2026-04-26',
    sections: [
      {
        heading: '1. Service Provider',
        body: companyBlock,
      },
      {
        heading: '2. Service Scope',
        body: [
          'ARRA provides event services listed on this website.',
          'Final service scope is confirmed after direct communication with the client.',
        ],
      },
      {
        heading: '3. Pricing and Payments',
        body: [
          'Displayed prices are baseline for Slovakia.',
          'Events outside Slovakia may require adjusted final pricing.',
          'Transport: 0.35€/km from Bratislava (Petrzalka).',
          'Venue restrictions and permit costs are not included.',
        ],
      },
      {
        heading: '4. Booking and Cancellations',
        body: [
          'Booking confirmation process: [PLACEHOLDER_BOOKING_PROCESS]',
          'Cancellation policy: [PLACEHOLDER_CANCELLATION_POLICY]',
          'Reschedule policy: [PLACEHOLDER_RESCHEDULE_POLICY]',
        ],
      },
      {
        heading: '5. Liability',
        body: [
          'Liability limitations: [PLACEHOLDER_LIABILITY_LIMITATION]',
          'Client responsibilities: [PLACEHOLDER_CLIENT_RESPONSIBILITIES]',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    lastUpdated: '2026-04-26',
    sections: [
      {
        heading: '1. Data Controller',
        body: companyBlock,
      },
      {
        heading: '2. What Cookies We Use',
        body: [
          'Necessary cookies: [PLACEHOLDER_NECESSARY_COOKIES]',
          'Analytics cookies: [PLACEHOLDER_ANALYTICS_COOKIES]',
          'Marketing cookies: [PLACEHOLDER_MARKETING_COOKIES]',
        ],
      },
      {
        heading: '3. Why We Use Cookies',
        body: [
          'Website functionality',
          'Traffic analytics',
          'Performance improvement',
        ],
      },
      {
        heading: '4. Consent and Control',
        body: [
          'Consent method: [PLACEHOLDER_CONSENT_METHOD]',
          'How to withdraw consent: [PLACEHOLDER_WITHDRAWAL_METHOD]',
          'Browser controls: Users can also manage cookies in browser settings.',
        ],
      },
    ],
  },
} as const;

export function LegalPage({ kind, onBackHome }: LegalPageProps) {
  const meta = pageMeta[kind];

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4">
      <div className="max-w-[900px] mx-auto bg-white border border-[#EAEAEA] rounded-xl p-6 md:p-10">
        <button
          type="button"
          onClick={onBackHome}
          className="mb-6 px-4 py-2 border border-[#EAEAEA] rounded-lg text-[#111111] hover:bg-[#FAFAFA]"
        >
          Back to Home
        </button>

        <h1 className="text-[28px] md:text-[34px] font-semibold text-[#111111] mb-2">{meta.title}</h1>
        <p className="text-[13px] text-[#6B6B6B] mb-8">Last updated: {meta.lastUpdated}</p>

        <div className="space-y-8">
          {meta.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[20px] font-medium text-[#111111] mb-3">{section.heading}</h2>
              <ul className="space-y-2 text-[14px] text-[#444444]">
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
