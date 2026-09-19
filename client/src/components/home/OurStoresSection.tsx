import React from 'react';
import { Check, Layers, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_STORES } from '../../services/stores';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const OurStoresSection: React.FC = () => {
  const { stores, activeStoreId, setActiveStoreId } = useStore();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const handleSelectStore = (storeId: string) => {
    setActiveStoreId(storeId);
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeStoresList = stores.filter((s) => s.status === 'active');
  const physicalStores = activeStoresList.length > 0 ? activeStoresList : INITIAL_STORES;

  return (
    <section ref={ref} className="relative py-12 sm:py-16 bg-[#FAF9F6] border-b border-zinc-200/60 overflow-hidden" id="our-stores">
      {/* Subtle Background Accent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-rose-100/30 via-amber-100/30 to-zinc-100/30 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className={`relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14 text-center md:text-left">
          <div className="space-y-2 max-w-xl mx-auto md:mx-0">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-[11px] font-extrabold text-[#E50914] uppercase tracking-[0.22em]">
                PHYSICAL BRANCHES
              </span>
              <div className="h-[1.5px] w-10 bg-zinc-300 hidden sm:block" />
            </div>
            
            <h2 className="font-ds-quilter text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              Our <span className="text-[#E50914]">Stores</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-zinc-600 font-medium">
              Tap a physical showroom avatar below to activate store context & browse store inventory.
            </p>
          </div>

          {/* Active Context Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200/90 shadow-sm text-xs font-bold text-zinc-800 self-center md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <span>Active Store:</span>
            <span className="text-[#E50914] font-extrabold uppercase">
              {activeStoreId === 'ALL'
                ? 'All Showrooms'
                : stores.find((s) => s.id === activeStoreId)?.name || activeStoreId}
            </span>
          </div>
        </div>

        {/* Square Avatar Showrooms Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
          
          {/* 1. ALL STORES SQUARE AVATAR */}
          <div
            onClick={() => handleSelectStore('ALL')}
            className="group cursor-pointer flex flex-col items-center text-center space-y-3 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center p-1 bg-white ${
                  activeStoreId === 'ALL'
                    ? 'ring-4 ring-[#E50914] border-2 border-white shadow-xl scale-105'
                    : 'border-2 border-zinc-200 group-hover:border-zinc-400 group-hover:shadow-md'
                }`}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80"
                    alt="All Stores"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                    <Layers className="w-7 h-7 text-amber-400 mb-0.5" />
                    <span className="text-[10px] font-black tracking-wider uppercase">ALL</span>
                  </div>
                </div>
              </div>

              {/* Active Badge Checkmark */}
              {activeStoreId === 'ALL' && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#E50914] text-white border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <h3 className={`font-bold text-sm sm:text-base ${activeStoreId === 'ALL' ? 'text-[#E50914] font-extrabold' : 'text-zinc-900 group-hover:text-[#E50914] transition-colors'}`}>
                All Stores
              </h3>
              <p className="text-[11px] font-semibold text-zinc-500">
                All Kerala Showrooms
              </p>
            </div>
          </div>

          {/* 2. DYNAMIC PHYSICAL STORE SQUARE AVATARS */}
          {physicalStores.map((store) => {
            const isSelected = activeStoreId === store.id;
            const defaultStoreImage =
              store.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80';

            return (
              <div
                key={store.id}
                onClick={() => handleSelectStore(store.id)}
                className="group cursor-pointer flex flex-col items-center text-center space-y-3 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center p-1 bg-white ${
                      isSelected
                        ? 'ring-4 ring-[#E50914] border-2 border-white shadow-xl scale-105'
                        : 'border-2 border-zinc-200 group-hover:border-zinc-400 group-hover:shadow-md'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-100">
                      <img
                        src={defaultStoreImage}
                        alt={store.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    </div>
                  </div>

                  {/* Active Badge Checkmark */}
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#E50914] text-white border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 max-w-[150px]">
                  <h3
                    className={`font-bold text-sm sm:text-base truncate ${
                      isSelected
                        ? 'text-[#E50914] font-extrabold'
                        : 'text-zinc-900 group-hover:text-[#E50914] transition-colors'
                    }`}
                  >
                    {store.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-zinc-500 truncate">
                    <MapPin className="w-3 h-3 text-[#E50914] shrink-0" />
                    <span className="truncate">{store.location.split(',')[0] || store.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
