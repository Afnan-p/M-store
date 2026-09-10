import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

export const StoreLocationsSection: React.FC = () => {
  const stores = [
    {
      id: 'kootanad',
      number: '01',
      name: 'Kootanad',
      location: 'Main Road, Near Bus Stand',
      image: '/images/store-kootanad.png',
      maps: 'https://maps.google.com/?q=Kootanad+Kerala',
    },
    {
      id: 'kecheri',
      number: '02',
      name: 'Kecheri',
      location: 'Opposite Calicut Road',
      image: '/images/store-kecheri.png',
      maps: 'https://maps.google.com/?q=Kecheri+Kerala',
    },
    {
      id: 'mattom',
      number: '03',
      name: 'Mattom',
      location: 'Near Mini Bypass',
      image: '/images/store-mattom.png',
      maps: 'https://maps.google.com/?q=Mattom+Kerala',
    },
  ];

  return (
    <section className="relative py-5 sm:py-8 lg:py-12 bg-[#FAF9F6] border-b border-zinc-200/60 overflow-hidden" id="locations">
      
      {/* Background Giant M Watermark */}
      <div className="absolute right-[-20px] lg:right-[5%] top-1/2 -translate-y-1/2 text-[260px] sm:text-[380px] lg:text-[480px] font-black text-zinc-200/40 select-none pointer-events-none font-display leading-none z-0">
        M
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Main Title, Description, Button, Feature Points */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 text-left">
            
            {/* Header Tag */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold text-[#E50914] uppercase tracking-[0.22em]">
                SHOWROOM LOCATIONS
              </span>
              <div className="h-[1.5px] w-12 bg-zinc-300/80" />
            </div>

            {/* Main Headline with Accent Color */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-black text-zinc-950 tracking-tight leading-[1.06]">
              Visit an <br />
              <span className="text-[#B5915D]">M Store</span> <br />
              Near You.
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed max-w-md">
              Explore our physical showrooms across Palakkad and Thrissur for hands-on device testing and expert guidance.
            </p>

            {/* View All Stores CTA Button */}
            <div className="pt-0.5">
              <Link
                to="/stores"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#18181B] text-white font-bold text-xs hover:bg-black hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md group"
              >
                <span>View All Stores</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>



          </div>

          {/* RIGHT COLUMN: 3 Circular Stores Cards with Pin Indicators & Map Curve */}
          <div className="lg:col-span-8 xl:col-span-8 relative">
            
            {/* Top Right Label */}
            <div className="hidden lg:flex justify-end mb-4">
              <span className="text-[10px] font-bold text-zinc-400 tracking-[0.22em] uppercase">
                THREE LOCATIONS. ONE M STORE.
              </span>
            </div>

            {/* Connecting Curved Vector Wave Line */}
            <div className="hidden lg:block absolute top-[75px] left-12 right-12 z-0 pointer-events-none">
              <svg viewBox="0 0 800 120" fill="none" className="w-full h-auto stroke-amber-800/30" strokeWidth="1.8" strokeDasharray="4 4">
                <path d="M 100 40 Q 260 110, 400 40 T 700 40" />
              </svg>
            </div>

            {/* 3 Circular Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 relative z-10 items-start">
              {stores.map((st) => (
                <div key={st.id} className="flex flex-col items-center group">
                  
                  {/* Top Red Location Pin Header */}
                  <div className="flex items-center gap-1.5 mb-3 select-none">
                    <MapPin className="w-4 h-4 text-[#E50914] fill-[#E50914] shrink-0" />
                    <div className="text-left">
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-900 block leading-tight">
                        {st.name}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 block -mt-0.5">
                        {st.number}
                      </span>
                    </div>
                  </div>

                  {/* Circular Image Frame */}
                  <a
                    href={st.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full aspect-square max-w-[240px] sm:max-w-[260px] lg:max-w-[250px] mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl shadow-zinc-900/10 bg-zinc-100 block transition-transform duration-500 group-hover:scale-105"
                  >
                    <img
                      src={st.image}
                      alt={st.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </a>

                  {/* Floating White Info Pill Box */}
                  <a
                    href={st.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative -mt-10 sm:-mt-12 z-20 w-[92%] max-w-[280px] bg-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-zinc-200/80 flex items-center justify-between gap-2 transition-all duration-300 group-hover:shadow-2xl group-hover:border-zinc-300"
                  >
                    <div className="min-w-0 text-left">
                      <h3 className="font-display text-sm sm:text-base font-bold text-zinc-950 group-hover:text-[#E50914] transition-colors truncate">
                        {st.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-zinc-500 font-medium">
                        <MapPin className="w-3 h-3 text-[#E50914] shrink-0" />
                        <span className="truncate">{st.location}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E50914] transition-colors shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </a>

                </div>
              ))}
            </div>

            {/* Bottom Right Route Trail Graphic */}
            <div className="mt-8 pt-4 flex flex-col items-end justify-end text-right border-t border-zinc-200/60 max-w-xs ml-auto">
              <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-zinc-500 tracking-wider">
                <span className="italic font-serif">Thrissur</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <div className="w-12 border-b-2 border-dashed border-zinc-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                </div>
                <span className="italic font-serif">Palakkad</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
