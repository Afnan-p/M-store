import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

export const SpecialOffer: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-zinc-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-[24px] bg-white border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex items-center">
          
          {/* Full Banner Background Image - Edge-to-Edge Integration */}
          <img
            src="/images/offers-banner-bg.png?v=2"
            alt="M STORE Special Offers Banner"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
          />

          {/* Smooth White Gradient Overlay on Left Side for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 sm:via-white/60 to-transparent w-full sm:w-3/5 lg:w-1/2 pointer-events-none" />

          {/* Content Area - Left-Aligned inside Container */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-xl lg:max-w-2xl space-y-4 text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-semibold text-[#E50914] uppercase tracking-[0.15em]">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>EXCLUSIVE OFFERS</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-950 tracking-tight leading-tight">
              Exclusive Offers & Deals.
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-600 font-normal max-w-md leading-relaxed">
              Explore curated promotional pricing on selected iPhones and genuine Apple accessories across our Kerala stores.
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                to="/offers"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full sm:rounded-xl bg-[#E50914] text-white hover:bg-[#c90712] font-semibold text-sm shadow-md shadow-[#E50914]/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>View Offers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};


