import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { PhoneModelNavigation } from './PhoneModelNavigation';
import { ProductGrid } from './ProductGrid';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../../types/product';

interface PhoneCategoryPageProps {
  categoryType: 'NEW' | 'USED';
}

export const PhoneCategoryPage: React.FC<PhoneCategoryPageProps> = ({ categoryType }) => {
  const { segmentSlug } = useParams<{ segmentSlug?: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();

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

  // Filter products strictly by category type, model slug, storage, and color
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      // 1. Strict Category Partitioning (Never mix New and Used)
      if (p.category === 'accessory') return false;
      
      if (categoryType === 'NEW') {
        if (p.category === 'iphone-used' || (p.condition && p.condition !== 'Brand New')) {
          return false;
        }
      } else {
        // USED Category
        if (p.category !== 'iphone-used' && p.condition === 'Brand New') {
          return false;
        }
      }

      // 2. Model Segment Filtering
      if (selectedModelSlug !== 'all') {
        const slugFormatted = selectedModelSlug.replace(/-/g, ' ').toLowerCase();
        const modelName = (p.model || '').toLowerCase();
        const productName = (p.name || '').toLowerCase();

        const isMatch =
          modelName.includes(slugFormatted) ||
          productName.includes(slugFormatted) ||
          (p.segmentSlug && p.segmentSlug === selectedModelSlug);

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
  }, [products, categoryType, selectedModelSlug, selectedStorage, selectedColor]);

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-950 tracking-tight">
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
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 w-full overflow-hidden">
          
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
              <label htmlFor="filter-storage" className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Storage
              </label>
              <select
                id="filter-storage"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914] focus:bg-white transition-colors cursor-pointer truncate"
              >
                <option value="all">All Storage</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            {/* Color Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0">
              <label htmlFor="filter-color" className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Color
              </label>
              <select
                id="filter-color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914] focus:bg-white transition-colors cursor-pointer truncate"
              >
                <option value="all">All Colors</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 min-w-0">
              <label htmlFor="filter-sort" className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block sm:inline">
                Sort By
              </label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914] focus:bg-white transition-colors cursor-pointer truncate"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Section Header & Count */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left border-b border-zinc-200/60 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              {sectionSubtitle}
            </p>
          </div>

          <span className="text-xs font-semibold text-zinc-500">
            Showing <strong className="text-zinc-900">{sortedProducts.length}</strong> available devices
          </span>
        </div>

        {/* Product Cards Grid */}
        <ProductGrid products={sortedProducts} loading={loading} />

      </div>
    </div>
  );
};
