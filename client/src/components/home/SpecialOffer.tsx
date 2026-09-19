import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Tag, Headphones } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const SpecialOffer: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-10 sm:py-14 bg-white border-b border-zinc-200/60">
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Banner Card Container - Full Custom Background Image */}
        <div className="relative rounded-[28px] border border-rose-200/70 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] flex items-center p-6 sm:p-10 lg:p-12 apple-reveal-card">
          
          {/* Full Seamless Custom Background Image */}
          <img
            src="/images/special-offer-bg.png"
            alt="Exclusive Apple Offers Background"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center pointer-events-none z-0"
          />

          {/* Soft Mobile Overlay for Text Readability (Invisible on Desktop) */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:from-white/80 sm:to-transparent lg:hidden pointer-events-none z-0" />

          {/* Left Content Area */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl space-y-4 text-left">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-600 tracking-[0.22em] uppercase">
              <span>LIMITED TIME ONLY</span>
              <div className="h-[1px] w-12 bg-zinc-400/80" />
            </div>

            {/* Title with Brand Red Highlight */}
            <h2 className="font-ds-quilter text-3xl sm:text-4xl lg:text-[46px] font-bold text-zinc-950 tracking-tight leading-[1.08]">
              Exclusive Apple <br />
              <span className="text-[#E50914]">Offers & Deals.</span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-700 font-medium max-w-md leading-relaxed">
              Explore special prices on selected iPhones and genuine Apple accessories across our Kerala stores.
            </p>

            {/* Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/offers"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Shop the Offers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/stores"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-800 transition-all"
              >
                <span>Find a Store</span>
                <MapPin className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bottom 3 Badges */}
            <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-zinc-300/60 text-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/90 border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  100%<br />Genuine Products
                </div>
              </div>

              <div className="h-6 w-[1px] bg-zinc-300/80 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/90 border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Tag className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  Special<br />Store Offers
                </div>
              </div>

              <div className="h-6 w-[1px] bg-zinc-300/80 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/90 border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Headphones className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  Support<br />Across Kerala
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
