import { contactInfo } from '@/content/company';
import { contactLinks } from '@/content/contactStatic';
import { Camera, MessageCircle, Phone } from 'lucide-react';

type ContactIconName = 'phone' | 'message' | 'camera';

function ContactIcon({ name }: { name: ContactIconName }) {
  const className = 'w-6 h-6 text-[#111111]';
  if (name === 'phone') return <Phone className={className} />;
  if (name === 'camera') return <Camera className={className} />;
  return <MessageCircle className={className} />;
}

export function Contact() {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#111111] text-center mb-10">
          Contact
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href={contactLinks.phone}
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="phone" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Phone / WhatsApp</div>
              <div className="text-[16px] text-[#111111] font-medium">{contactInfo.phoneDisplay}</div>
            </div>
          </a>

          <a
            href={contactLinks.email}
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="message" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Email</div>
              <div className="text-[16px] text-[#111111] font-medium">{contactInfo.email}</div>
            </div>
          </a>

          <a
            href={contactLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="camera" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Instagram</div>
              <div className="text-[16px] text-[#111111] font-medium">{contactInfo.instagramHandle}</div>
            </div>
          </a>

          <a
            href={contactLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="camera" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Facebook</div>
              <div className="text-[16px] text-[#111111] font-medium">{contactInfo.facebookLabel}</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
