import React from 'react';
import type { FilterOptions } from '../../types/product';
import { Filter, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  totalResults,
}) => {
  const models = [
    'all',
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15',
    'iPhone 14 Pro',
    'iPhone 14',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone 12',
  ];

  const storageOptions = ['all', '128GB', '256GB', '512GB', '1TB'];

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      condition: 'all',
      model: 'all',
      storage: 'all',
      minPrice: 0,
      maxPrice: 200000,
      availableOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-sm text-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#E50914]" />
          <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Refine Inventory</h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'New', value: 'iphone-new' },
            { label: 'Pre-Owned', value: 'iphone-used' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.value as any }))}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                filters.category === cat.value
                  ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                  : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">iPhone Series / Model</label>
        <select
          value={filters.model}
          onChange={(e) => setFilters((prev) => ({ ...prev, model: e.target.value }))}
          className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {m === 'all' ? 'All Models' : m}
            </option>
          ))}
        </select>
      </div>

      {/* Storage Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">Storage Option</label>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((st) => (
            <button
              key={st}
              onClick={() => setFilters((prev) => ({ ...prev, storage: st }))}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                filters.storage === st
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {st === 'all' ? 'Any' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">Device State</label>
        <select
          value={filters.condition}
          onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value as any }))}
          className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
        >
          <option value="all">All Conditions</option>
          <option value="new">Brand New (Sealed Pack)</option>
          <option value="used">Pre-Owned (Quality Checked)</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Stock</option>
        </select>
      </div>

      <div className="pt-3 border-t border-zinc-200 text-xs text-zinc-500 flex items-center justify-between">
        <span>Showing devices:</span>
        <span className="font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">{totalResults}</span>
      </div>
    </div>
  );
};
