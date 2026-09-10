import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductGrid } from '../product/ProductGrid';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, loading }) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'new' | 'used' | 'accessory'>('all');

  const filtered = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return p.category === 'iphone-new';
    if (activeTab === 'used') return p.category === 'iphone-used';
    if (activeTab === 'accessory') return p.category === 'accessory';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-[#FAF9F6]">
      
      {/* Full Cover Background Banner matching reference image */}
      {/* <img
        src="/images/featured-header-banner.png"
        alt="Featured Banner Background"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-100 pointer-events-none select-none z-0"
      /> */}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
          
          {/* Left Title */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-[0.2em] block">
              FEATURED COLLECTION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
              The Latest iPhones
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Curated devices. Exceptional condition. Ready for your next upgrade.
            </p>
          </div>

          {/* Right Filters & View All */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full lg:w-auto">
            
            {/* Filter Tabs Container - Modern rounded-xl border radius instead of pillow shape */}
            <div className="flex items-center gap-1 bg-zinc-200/60 p-1 rounded-xl border border-zinc-200/90 text-xs font-semibold backdrop-blur-sm overflow-x-auto max-w-full scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {[
                { key: 'all', label: 'All' },
                { key: 'new', label: 'New' },
                { key: 'used', label: 'Pre-Owned' },
                { key: 'accessory', label: 'Accessories' },
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

            {/* View All Link - Modern rounded-lg border radius */}
            <Link
              to="/iphones"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-900 hover:text-[#E50914] bg-white border border-zinc-200/90 hover:bg-zinc-100 transition-colors shrink-0 shadow-xs"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid with 2-row horizontal scroll on mobile */}
        <ProductGrid products={filtered} loading={loading} mobileHorizontalScroll={true} />
      </div>
    </section>
  );
};
