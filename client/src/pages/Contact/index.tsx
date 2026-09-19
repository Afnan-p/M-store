import React, { useState } from 'react';
import { BRAND_CONFIG } from '../../services/config';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('Thank you! Your message has been sent to M Store support.');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#E50914] uppercase tracking-widest block">Get In Touch</span>
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight">Contact M STORE</h1>
        <p className="text-sm text-zinc-600">
          Have questions about device availability, trade-ins, or store directions? Reach out instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200 p-7 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-zinc-900">Direct WhatsApp Support</h3>
            <p className="text-xs text-zinc-600">
              For fastest response on pricing, stock availability, and live phone photos.
            </p>
            <a href={getGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button size="md" fullWidth variant="whatsapp" icon={<svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/></svg>}>
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          <div className="bg-white border border-zinc-200 p-7 rounded-3xl space-y-4 text-xs shadow-xl">
            <h3 className="text-base font-bold text-zinc-900">Store Contact Details</h3>
            
            <div className="flex items-center gap-3 text-zinc-700">
              <Phone className="w-4 h-4 text-[#E50914] shrink-0" />
              <span>{BRAND_CONFIG.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-700">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{BRAND_CONFIG.email}</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-700">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>10:00 AM - 9:00 PM (Open All Days)</span>
            </div>

            <div className="flex items-start gap-3 text-zinc-700 pt-3 border-t border-zinc-100">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Showrooms: Kootanad, Kecheri, Mattom (Kerala)</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 p-8 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-zinc-900">Send Us a Direct Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul V."
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Message / Device Inquiry *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what iPhone model or accessory you are looking for..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
              Submit Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
