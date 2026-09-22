import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductGrid } from '../product/ProductGrid';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, loading }) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const { activeStoreId, activeStore } = useStore();
  const [activeTab, setActiveTab] = React.useState<'all' | 'new' | 'used' | 'accessory'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const storeFilteredProducts = products.filter((p) => {
    if (
      activeStoreId &&
      activeStoreId !== 'ALL' &&
      activeStoreId !== 'all'
    ) {
      if (!p.storeId || p.storeId === 'ALL' || p.storeId === 'all') return true;

      const pStore = p.storeId.toLowerCase();
      const aStore = activeStoreId.toLowerCase();
      const isMatch =
        pStore === aStore ||
        (aStore === 'store001' && pStore.includes('kootanad')) ||
        (aStore === 'store002' && pStore.includes('kecheri')) ||
        (aStore === 'store003' && pStore.includes('mattom')) ||
        (aStore === 'store004' && pStore.includes('pattambi')) ||
        (pStore === 'store001' && aStore.includes('kootanad')) ||
        (pStore === 'store002' && aStore.includes('kecheri')) ||
        (pStore === 'store003' && aStore.includes('mattom')) ||
        (pStore === 'store004' && aStore.includes('pattambi'));

      if (!isMatch) return false;
    }
    return true;
  });

  const hasFeaturedProducts = storeFilteredProducts.some((p) => p.featured === true);

  const iphoneProducts = storeFilteredProducts.filter(
    (p) =>
      (p.category === 'iphone-new' || p.category === 'iphone-used') &&
      (hasFeaturedProducts ? p.featured === true : true)
  );

  const filtered = iphoneProducts
    .filter((p) => {
      if (activeTab === 'new') return p.category === 'iphone-new';
      if (activeTab === 'used') return p.category === 'iphone-used';
      return true;
    })
    .slice(0, 8);

  return (
    <section ref={ref} className="py-10 sm:py-14 lg:py-[54px] relative overflow-hidden bg-[#FAF9F6]">
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
          
          {/* Left Title */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-[0.2em] block">
              FEATURED COLLECTION
            </span>
            <div className="flex items-center gap-2">
              <h2 className="font-ds-quilter text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                The Latest iPhones
              </h2>
              {activeStore && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E50914] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  <MapPin className="w-3 h-3" /> {activeStore.name}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Curated devices. Exceptional condition. Ready for your next upgrade.
            </p>
          </div>

          {/* Right Filters, Scroll Controls & View All */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full lg:w-auto">
            
            {/* Filter Tabs Container */}
            <div className="flex items-center gap-1 bg-zinc-200/60 p-1 rounded-xl border border-zinc-200/90 text-xs font-semibold backdrop-blur-sm overflow-x-auto max-w-full scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {[
                { key: 'all', label: 'All iPhones' },
                { key: 'new', label: 'Brand New' },
                { key: 'used', label: 'Pre-Owned' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold shrink-0 ${
                    activeTab === tab.key
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white text-zinc-600 border border-zinc-200/80 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scroll Control Arrows (< >) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-lg bg-white border border-zinc-200/90 hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll left"
                title="Previous products"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-lg bg-white border border-zinc-200/90 hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll right"
                title="Next products"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* View All Link */}
            <Link
              to="/iphones"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-900 hover:text-[#E50914] bg-white border border-zinc-200/90 hover:bg-zinc-100 transition-colors shrink-0 shadow-xs"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid with 2-row horizontal scroll on mobile & scroll container ref */}
        <ProductGrid
          products={filtered}
          loading={loading}
          emptyTitle={activeStore ? `No products available in ${activeStore.name}` : 'No products found'}
          emptySubtitle={activeStore ? 'This store branch has no products in this sub-category. Try selecting "All Stores" in the header.' : 'Try adjusting your filter selection.'}
          mobileHorizontalScroll={true}
          animated={true}
          containerRef={scrollContainerRef}
        />
      </div>
    </section>
  );
};
