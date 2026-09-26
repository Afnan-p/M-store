import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_STORES } from '../../services/stores';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const StoreLocationsSection: React.FC = () => {
  const { stores } = useStore();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const activeStoresList = stores.filter((s) => s.status === 'active');
  const displayStores = activeStoresList.length > 0 ? activeStoresList : INITIAL_STORES;

  const countWords = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'];
  const countLabel = countWords[displayStores.length - 1] || `${displayStores.length}`;

  const storeCount = displayStores.length;

  return (
    <section ref={ref} className="relative py-8 sm:py-12 lg:py-16 bg-[#FAF9F6] border-b border-zinc-200/60 overflow-hidden" id="locations">
      
      {/* Background Giant M Watermark */}
      <div className="absolute right-[-20px] lg:right-[5%] top-1/2 -translate-y-1/2 text-[260px] sm:text-[380px] lg:text-[480px] font-black text-zinc-200/40 select-none pointer-events-none font-display leading-none z-0">
        M
      </div>

      <div className={`relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Main Title, Description, Button, Feature Points */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 text-left apple-reveal-item pt-2" style={{ transitionDelay: '0ms' }}>
            
            {/* Header Tag */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold text-[#E50914] uppercase tracking-[0.22em]">
                SHOWROOM LOCATIONS
              </span>
              <div className="h-[1.5px] w-12 bg-zinc-300/80" />
            </div>

            {/* Main Headline with Accent Color */}
            <h2 className="font-ds-quilter text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight leading-[1.06]">
              Visit an <br />
              <span className="text-[#E50914]">M Store</span> <br />
              Near You.
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed max-w-md">
              Explore our physical showrooms across Kerala for hands-on device testing and expert guidance.
            </p>

            {/* View All Stores CTA Button */}
            <div className="pt-1">
              <Link
                to="/stores"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#18181B] text-white font-bold text-xs hover:bg-black hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md group"
              >
                <span>View All Stores</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Circular Stores Cards with Pin Indicators & Map Curve */}
          <div className="lg:col-span-8 xl:col-span-8 relative">
            
            {/* Top Right Label */}
            <div className="flex justify-end mb-4">
              <span className="text-[10px] font-bold text-zinc-400 tracking-[0.22em] uppercase">
                {countLabel} {storeCount === 1 ? 'LOCATION' : 'LOCATIONS'}. ONE M STORE.
              </span>
            </div>

            {/* Connecting Curved Vector Wave Line for up to 5 stores */}
            {storeCount <= 5 && (
              <div className="hidden lg:block absolute top-[75px] left-8 right-8 z-0 pointer-events-none">
                <svg viewBox="0 0 800 120" fill="none" className="w-full h-auto stroke-amber-800/30" strokeWidth="1.8" strokeDasharray="4 4">
                  <path d="M 80 40 Q 260 110, 400 40 T 720 40" />
                </svg>
              </div>
            )}

            {/* Dynamic Circular Cards Grid */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 ${
                storeCount === 1
                  ? 'lg:grid-cols-1 max-w-xs mx-auto'
                  : storeCount === 2
                  ? 'lg:grid-cols-2 max-w-xl mx-auto'
                  : storeCount === 3
                  ? 'lg:grid-cols-3'
                  : storeCount === 4
                  ? 'lg:grid-cols-4'
                  : storeCount === 5
                  ? 'lg:grid-cols-5'
                  : 'lg:grid-cols-3 xl:grid-cols-4'
              } gap-x-3 sm:gap-x-5 lg:gap-x-4 gap-y-8 sm:gap-y-10 relative z-10 items-start`}
            >
              {displayStores.map((st, idx) => {
                const storeNum = String(idx + 1).padStart(2, '0');
                const storeDisplayName = st.name.replace(/^Store\s*\d+\s*-\s*/i, '').trim() || st.name;
                const mapUrl = st.maps || `https://maps.google.com/?q=${encodeURIComponent(st.name + ' Kerala')}`;
                const storeImage = st.image || '/images/store-kootanad.png';

                return (
                  <div
                    key={st.id}
                    className="flex flex-col items-center group apple-reveal-card"
                    style={{ transitionDelay: `${120 + idx * 80}ms` }}
                  >
                    
                    {/* Top Red Location Pin Header */}
                    <div className="flex items-center gap-1 mb-2.5 select-none w-full justify-center">
                      <MapPin className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914] shrink-0" />
                      <div className="text-left min-w-0">
                        <span className="text-xs font-extrabold text-zinc-900 block leading-tight truncate max-w-[110px]">
                          {storeDisplayName}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 block -mt-0.5">
                          {storeNum}
                        </span>
                      </div>
                    </div>

                    {/* Circular Image Frame */}
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative w-full aspect-square ${
                        storeCount >= 5 ? 'max-w-[160px] sm:max-w-[190px] lg:max-w-[155px] xl:max-w-[185px]' : 'max-w-[190px] sm:max-w-[210px] lg:max-w-[200px]'
                      } mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl shadow-zinc-900/10 bg-zinc-100 block transition-transform duration-500 group-hover:scale-105`}
                    >
                      <img
                        src={storeImage}
                        alt={st.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/store-kootanad.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </a>

                    {/* Floating White Info Pill Box */}
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative -mt-7 sm:-mt-8 z-20 w-[96%] max-w-[220px] bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-zinc-200/80 flex items-center justify-between gap-1.5 transition-all duration-300 group-hover:shadow-2xl group-hover:border-zinc-300"
                    >
                      <div className="min-w-0 text-left">
                        <h3 className="font-display text-xs sm:text-sm font-bold text-zinc-950 group-hover:text-[#E50914] transition-colors truncate">
                          {storeDisplayName}
                        </h3>
                        
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                          <MapPin className="w-3 h-3 text-[#E50914] shrink-0" />
                          <span className="truncate">{st.location ? st.location.split(',')[0] : 'Kerala'}</span>
                        </div>
                      </div>

                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E50914] transition-colors shadow-xs">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </a>

                  </div>
                );
              })}
            </div>

            {/* Bottom Right Route Trail Graphic */}
            <div className="mt-8 pt-4 flex flex-col items-end justify-end text-right border-t border-zinc-200/60 max-w-sm ml-auto">
              <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-zinc-500 tracking-wider">
                <span className="italic font-serif">Official M Store Network</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <div className="w-12 border-b-2 border-dashed border-zinc-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                </div>
                <span className="italic font-serif">Kerala</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
