import React from 'react';
import { Zap, Camera, Store, ArrowRight } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';

export const WhatsAppCTASection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 py-10 sm:py-14 lg:py-16 flex items-center justify-center">
      {/* Background Image Container - Full image visible without white overlay shade or zoom cropping */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <img
          src="/images/whatsapp-banner-bg.png"
          alt="WhatsApp CTA Banner"
          className="w-full h-full object-cover md:object-fill object-center"
        />
      </div>

      {/* Main Overlaid Centered Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-5 py-2">
        
        {/* Top Brand Label */}
        <div className="text-[10px] sm:text-xs font-semibold text-[#E50914] tracking-[0.25em] uppercase">
          DIRECT SUPPORT
        </div>

        {/* Main Heading */}
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight leading-none">
          Found Your <span className="text-[#E50914]">iPhone?</span>
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed max-w-lg mx-auto">
          Have a question about availability, price or device condition? <br className="hidden sm:inline" />
          Talk to our store team directly on WhatsApp.
        </p>

        {/* 3 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-lg mx-auto">
          
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-0.5 shadow-xs">
              <Zap className="w-4 h-4 fill-[#E50914]" />
            </div>
            <span className="font-display text-[11px] font-semibold text-zinc-900 block">Instant Pricing</span>
            <span className="text-[10px] text-zinc-500 font-normal">Get real-time quotes</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-0.5 shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-display text-[11px] font-semibold text-zinc-900 block">Live Device Photos</span>
            <span className="text-[10px] text-zinc-500 font-normal">See actual product images</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-0.5 shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-display text-[11px] font-semibold text-zinc-900 block">Store Pickup & Delivery</span>
            <span className="text-[10px] text-zinc-500 font-normal">Your choice, made easy</span>
          </div>

        </div>

        {/* Brand Red WhatsApp CTA Button */}
        <div className="pt-2">
          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#E50914] text-white font-semibold text-xs sm:text-sm hover:bg-[#c90812] hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-[#E50914]/30"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/></svg>
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom Micro Text */}
        <div className="text-[9.5px] sm:text-[10px] font-semibold text-zinc-500 tracking-[0.25em] uppercase pt-1">
          FAST &bull; FRIENDLY &bull; ALWAYS HERE
        </div>

      </div>
    </section>
  );
};


