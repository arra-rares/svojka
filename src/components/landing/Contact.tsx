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
            href="tel:+421900000000"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="phone" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Phone</div>
              <div className="text-[16px] text-[#111111] font-medium">+421 900 000 000</div>
            </div>
          </a>

          <a
            href="mailto:info@arraprod.sk"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="message" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Email</div>
              <div className="text-[16px] text-[#111111] font-medium">info@arraprod.sk</div>
            </div>
          </a>

          <a
            href="https://wa.me/421900000000"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="message" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">WhatsApp</div>
              <div className="text-[16px] text-[#111111] font-medium">+421 900 000 000</div>
            </div>
          </a>

          <a
            href="https://instagram.com/arraprod"
            className="flex items-center gap-4 p-6 bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ContactIcon name="camera" />
            <div>
              <div className="text-[12px] text-[#6B6B6B] mb-1">Instagram</div>
              <div className="text-[16px] text-[#111111] font-medium">@arraprod</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
