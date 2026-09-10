import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Headphones } from 'lucide-react';

export const AccessoriesPage: React.FC = () => {
  const { filteredProducts, loading, setFilters } = useProducts();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All Gear');

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: 'accessory',
    }));
  }, [setFilters]);

  const allAccessories = useMemo(() => {
    return filteredProducts.filter((p) => p.category === 'accessory');
  }, [filteredProducts]);

  const subCategories = ['All Gear', 'Chargers & Adapters', 'AirPods & Audio', 'MagSafe Cases'];

  const displayedAccessories = useMemo(() => {
    if (selectedSubCategory === 'All Gear') return allAccessories;
    return allAccessories.filter((p) => {
      const nameLower = p.name.toLowerCase();
      const descLower = (p.description || '').toLowerCase();

      if (selectedSubCategory === 'Chargers & Adapters') {
        return nameLower.includes('charger') || nameLower.includes('adapter') || descLower.includes('charging') || descLower.includes('magsafe charger');
      }
      if (selectedSubCategory === 'AirPods & Audio') {
        return nameLower.includes('airpods') || nameLower.includes('homepod') || nameLower.includes('watch') || descLower.includes('audio') || descLower.includes('sound');
      }
      if (selectedSubCategory === 'MagSafe Cases') {
        return nameLower.includes('case') || descLower.includes('case') || nameLower.includes('silicone');
      }
      return true;
    });
  }, [allAccessories, selectedSubCategory]);

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-12">
      {/* Accessories Banner */}
      <div className="space-y-4 text-center sm:text-left border-b border-zinc-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-600">
          <Headphones className="w-4 h-4" />
          <span>Original Apple Gear & Essentials</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight">
          Apple Accessories
        </h1>

        <p className="text-sm text-zinc-600 max-w-2xl">
          Complete your Apple setup with original 20W fast power adapters, AirPods Pro (2nd Gen), MagSafe cases, and screen protectors.
        </p>

        {/* Interactive Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
          {subCategories.map((tag) => {
            const isActive = selectedSubCategory === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedSubCategory(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-200/90 hover:bg-zinc-200 hover:text-zinc-950'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Accessories Grid */}
      <ProductGrid
        products={displayedAccessories}
        loading={loading}
        emptyTitle="No accessories found"
        emptySubtitle="Try selecting another category or enquire on WhatsApp for custom Apple accessory requests."
      />
    </div>
  );
};
