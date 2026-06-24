import { legalCompanyInfo } from '@/content/company';
import { useSiteContent } from '@/context/LocaleContext';

export function Footer() {
  const { footerContent } = useSiteContent();

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
              {footerContent.legalColumn.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[#111111] underline">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>IČO: {legalCompanyInfo.ico}</li>
              <li>DIČ: {legalCompanyInfo.dic}</li>
              <li>IČ DPH: {legalCompanyInfo.icDph}</li>
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
