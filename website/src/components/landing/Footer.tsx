import { useSiteContent } from '@/context/LocaleContext';

export function Footer() {
  const { footerContent } = useSiteContent();
  const legalPathByLabel: Record<string, string> = {
    'Privacy Policy': '/privacy',
    'Terms of Service': '/terms',
  };

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#EAEAEA] py-10 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-[18px] font-semibold text-[#111111] mb-4">
              {footerContent.brandColumn.title}
            </h3>
            <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
              {footerContent.brandColumn.description}
            </p>
          </div>

          <div>
            <h4 className="text-[16px] font-medium text-[#111111] mb-4">
              {footerContent.servicesColumn.title}
            </h4>
            <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
              {footerContent.servicesColumn.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] font-medium text-[#111111] mb-4">
              {footerContent.legalColumn.title}
            </h4>
            <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
              {footerContent.legalColumn.items.map((item) => (
                <li key={item}>
                  {legalPathByLabel[item] ? (
                    <a href={legalPathByLabel[item]} className="hover:text-[#111111] underline">
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                </li>
              ))}
              <li>
                <a href="/gdpr" className="hover:text-[#111111] underline">
                  GDPR Notice
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-[#111111] underline">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EAEAEA] text-center text-[14px] text-[#6B6B6B]">
          {footerContent.copyright}
        </div>
      </div>
    </footer>
  );
}
