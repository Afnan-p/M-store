import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Tag, Headphones } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const SpecialOffer: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-10 sm:py-14 bg-white border-b border-zinc-200/60">
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Banner Card Container - Seamless Smooth Blended Background */}
        <div className="relative rounded-[24px] bg-gradient-to-r from-[#FAFAF7] via-[#F4ECE0] to-[#EBE0D0] border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center p-6 sm:p-10 lg:p-12 apple-reveal-card">
          
          {/* 100% Seamless Soft Ambient Glow (NO HARD CIRCLE EDGE) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(238,226,208,0.5)_0%,rgba(250,250,247,0)_70%)] pointer-events-none z-0" />

          {/* Top Right Apple Tagline */}
          <div className="hidden sm:flex absolute top-6 right-8 z-10 items-center gap-2 text-zinc-800">
            <svg className="w-5 h-5 fill-current text-zinc-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.84.13-9.64-1.92-14.42-6.15-3.37-2.94-7.29-7.66-11.77-14.16-6.64-9.68-11.83-20.15-15.58-31.41-3.75-11.26-5.63-22.18-5.63-32.76 0-14.2 3.65-26.04 10.95-35.52 7.3-9.48 16.48-14.28 27.53-14.4 5.37 0 10.85 1.25 16.45 3.75 5.6 2.5 9.48 3.75 11.64 3.75 1.96 0 5.88-1.25 11.76-3.75 5.88-2.5 11.04-3.69 15.48-3.57 12.18.65 22.11 5.23 29.8 13.73-10.88 6.53-16.21 15.77-15.99 27.72.22 9.47 3.92 17.38 11.1 23.72 7.18 6.34 15.58 9.77 25.2 10.29-2.4 7.08-5.77 14.48-10.11 22.2zM119.22 31.84c0-6.86 2.45-13.43 7.35-19.71 4.9-6.28 11.14-10.02 18.72-11.23.11 1.09.16 2.07.16 2.94 0 6.75-2.5 13.37-7.51 19.85-5.01 6.48-11.21 10.23-18.6 11.25-.05-.87-.12-1.9-.12-3.1z"/>
            </svg>
            <div className="text-[10px] font-semibold text-zinc-600 leading-tight">
              Think Different.<br />Choose Better.
            </div>
          </div>

          {/* Left Content Area */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl space-y-4 text-left">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-500 tracking-[0.22em] uppercase">
              <span>LIMITED TIME ONLY</span>
              <div className="h-[1px] w-12 bg-zinc-300" />
            </div>

            {/* Title with Warm Gold Highlight */}
            <h2 className="font-ds-quilter text-3xl sm:text-4xl lg:text-[46px] font-bold text-zinc-950 tracking-tight leading-[1.08]">
              Exclusive Apple <br />
              <span className="text-[#B5915D]">Offers & Deals.</span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 font-medium max-w-md leading-relaxed">
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
            <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-zinc-200/80 text-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  100%<br />Genuine Products
                </div>
              </div>

              <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  Special<br />Store Offers
                </div>
              </div>

              <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                  <Headphones className="w-3.5 h-3.5 text-zinc-800" />
                </div>
                <div className="text-[10.5px] font-bold leading-tight">
                  Support<br />Across Kerala
                </div>
              </div>
            </div>

          </div>

          {/* Right Product Image & Discount Badge (Vector Sharp) */}
          <div className="hidden lg:flex absolute right-4 xl:right-12 bottom-0 top-0 w-[45%] items-center justify-center pointer-events-none z-10">
            {/* Discount Circular Badge */}
            <div className="absolute right-4 xl:right-8 top-1/2 -translate-y-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#A88247] to-[#8C6B37] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white/60 z-20">
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90">UP TO</span>
              <span className="text-2xl font-black leading-none">20%</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">OFF</span>
            </div>

            {/* High-Res Crisp iPhone Image (Increased by another 15px) */}
            <img
              src="/images/hero-object.png"
              alt="M STORE Special Offers iPhone"
              className="w-full max-w-[405px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] origin-bottom"
            />
          </div>

        </div>
      </div>
    </section>
  );
};


