import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useSegments } from '../../hooks/useSegments';
import { useStore } from '../../context/StoreContext';
import { PhoneModelNavigation } from './PhoneModelNavigation';
import { ProductGrid } from './ProductGrid';
import { CustomSelect } from '../common/CustomSelect';
import { ShieldCheck, SlidersHorizontal, MapPin } from 'lucide-react';
import type { Product } from '../../types/product';

interface PhoneCategoryPageProps {
  categoryType: 'NEW' | 'USED';
}

export const PhoneCategoryPage: React.FC<PhoneCategoryPageProps> = ({ categoryType }) => {
  const { segmentSlug } = useParams<{ segmentSlug?: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { segments } = useSegments();
  const { activeStoreId, activeStore } = useStore();

  const disabledSegmentSlugs = useMemo(() => {
    const set = new Set<string>();
    segments.forEach((s) => {
      if (s.isActive === false) {
        set.add(s.slug);
        set.add(s.name.toLowerCase());
      }
    });
    return set;
  }, [segments]);

  // Local Model & Attribute Filter States
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Base path for navigation
  const basePath = categoryType === 'NEW' ? '/iphones' : '/used-iphones';

  // Sync route slug with selected model
  useEffect(() => {
    if (segmentSlug) {
      setSelectedModelSlug(segmentSlug);
    } else {
      setSelectedModelSlug('all');
    }
  }, [segmentSlug]);

  const handleSelectModel = (slug: string) => {
    if (slug === 'all') {
      navigate(basePath);
      setSelectedModelSlug('all');
    } else {
      navigate(`${basePath}/${slug}`);
      setSelectedModelSlug(slug);
    }
  };

  // Dynamically extract available colors for current category
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => {
      if (p.color && p.category !== 'accessory') {
        colorSet.add(p.color);
      }
    });
    return Array.from(colorSet);
  }, [products]);

  // Filter products strictly by category type, model slug, storage, color, and active store context
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      // Exclude products belonging to disabled segments
      if (disabledSegmentSlugs.size > 0 && p.segmentSlug && disabledSegmentSlugs.has(p.segmentSlug)) {
        return false;
      }
      // 0. Active Store Context Filter
      if (
        activeStoreId !== 'ALL' &&
        activeStoreId !== 'all' &&
        p.storeId &&
        p.storeId !== 'ALL' &&
        p.storeId !== 'all' &&
        p.storeId !== activeStoreId
      ) {
        return false;
      }

      // 1. Strict Category Partitioning (Never mix New and Used)
      if (p.category === 'accessory') return false;
      
      if (categoryType === 'NEW') {
        if (p.category === 'iphone-used') {
          return false;
        }
      } else {
        // USED Category
        if (p.category === 'iphone-new') {
          return false;
        }
      }

      // 2. Model Segment Filtering
      if (selectedModelSlug !== 'all') {
        const normalize = (s: string) =>
          (s || '')
            .toLowerCase()
            .replace(/i\s+phone/g, 'iphone')
            .replace(/[^a-z0-9]/g, '');

        const targetNorm = normalize(selectedModelSlug);
        const productModelNorm = normalize(p.model || '');
        const productNameNorm = normalize(p.name || '');
        const segmentSlugNorm = normalize(p.segmentSlug || '');

        let isMatch = p.segmentSlug === selectedModelSlug || (segmentSlugNorm.length > 0 && segmentSlugNorm === targetNorm);

        if (!isMatch) {
          if (targetNorm.includes('max')) {
            isMatch = productNameNorm.includes(targetNorm) || productModelNorm.includes(targetNorm);
          } else {
            const matchesNameOrModel =
              productNameNorm.includes(targetNorm) || productModelNorm.includes(targetNorm);
            const isMaxProduct = productNameNorm.includes('max') || productModelNorm.includes('max');
            isMatch = matchesNameOrModel && !isMaxProduct;
          }
        }

        if (!isMatch) return false;
      }

      // 3. Storage Attribute Filter
      if (selectedStorage !== 'all') {
        if (!p.storage || !p.storage.toLowerCase().includes(selectedStorage.toLowerCase())) {
          return false;
        }
      }

      // 4. Color Attribute Filter
      if (selectedColor !== 'all') {
        if (!p.color || p.color.toLowerCase() !== selectedColor.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [products, categoryType, selectedModelSlug, selectedStorage, selectedColor, activeStoreId, disabledSegmentSlugs]);

  // Sorted Products by Price / Featured
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const pageTitle = categoryType === 'NEW' ? 'iPhone' : 'Used iPhones';
  const pageSubtitle =
    categoryType === 'NEW'
      ? 'Latest models. Great deals. Genuine devices.'
      : 'Verified pre-owned devices. Quality checked.';

  const sectionTitle =
    selectedModelSlug === 'all'
      ? categoryType === 'NEW'
        ? 'All iPhones'
        : 'All Used iPhones'
      : selectedModelSlug.replace(/-/g, ' ').toUpperCase();

  const sectionSubtitle =
    categoryType === 'NEW'
      ? 'Handpicked devices. Great performance. Great prices.'
      : 'Verified pre-owned devices. Great value.';

  const hasActiveAttributeFilters =
    selectedStorage !== 'all' || selectedColor !== 'all' || sortBy !== 'featured';

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 sm:pt-32 pb-24 font-sans text-zinc-900 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 space-y-5 sm:space-y-6">
        
        {/* Compact Page Title Header */}
        <div className="pt-2 text-left space-y-1">
          {categoryType === 'USED' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Quality Inspected</span>
            </div>
          )}
          <h1 className="font-ds-quilter text-4xl sm:text-5xl md:text-6xl font-black text-zinc-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl">
            {pageSubtitle}
          </p>
        </div>

        {/* Dynamic Centered Horizontal Model / Series Navigation */}
        <PhoneModelNavigation
          categoryType={categoryType}
          selectedModelSlug={selectedModelSlug}
          onSelectModel={handleSelectModel}
        />

        {/* Attribute Filtering Bar (Storage, Color, Price Sort) */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 w-full relative z-20">
          
          {/* Top Bar on Mobile / Left Section on Desktop */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Filters & Sort</span>
            </div>

            {hasActiveAttributeFilters && (
              <button
                onClick={() => {
                  setSelectedStorage('all');
                  setSelectedColor('all');
                  setSortBy('featured');
                }}
                className="text-[11px] font-bold text-[#E50914] hover:underline px-1 py-0.5"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Filters Controls: Storage, Color, Sort */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Storage Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Storage
              </span>
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Storage' },
                  { value: '128GB', label: '128GB' },
                  { value: '256GB', label: '256GB' },
                  { value: '512GB', label: '512GB' },
                  { value: '1TB', label: '1TB' },
                ]}
                value={selectedStorage}
                onChange={(val) => setSelectedStorage(val)}
                size="sm"
                buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
              />
            </div>

            {/* Color Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Color
              </span>
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Colors' },
                  ...availableColors.map((c) => ({ value: c, label: c })),
                ]}
                value={selectedColor}
                onChange={(val) => setSelectedColor(val)}
                size="sm"
                buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
              />
            </div>

            {/* Sort Filter */}
            <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Sort By
              </span>
              <CustomSelect
                options={[
                  { value: 'featured', label: 'Featured First' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                ]}
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                size="sm"
                buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
              />
            </div>
          </div>

        </div>

        {/* Product Section Header & Count */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left border-b border-zinc-200/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-ds-quilter text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                {sectionTitle}
              </h2>
              {activeStore && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E50914] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  <MapPin className="w-3 h-3" /> {activeStore.name}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              {sectionSubtitle}
            </p>
          </div>

          <span className="text-xs font-semibold text-zinc-500">
            Showing <strong className="text-zinc-900">{sortedProducts.length}</strong> available devices
          </span>
        </div>

        {/* Product Cards Grid */}
        <ProductGrid
          products={sortedProducts}
          loading={loading}
          emptyTitle={activeStore ? `No products available in ${activeStore.name}` : 'No products available'}
          emptySubtitle={activeStore ? 'This physical showroom branch currently has no devices matching your criteria. Try switching stores to "All Stores" in the header.' : 'Try adjusting your filters.'}
        />

      </div>
    </div>
  );
};
