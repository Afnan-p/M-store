import React from 'react';
import type { FilterOptions } from '../../types/product';
import { Filter, RotateCcw } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

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
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-sm text-zinc-900 relative z-20">
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
        <CustomSelect
          options={models.map((m) => ({
            value: m,
            label: m === 'all' ? 'All Models' : m,
          }))}
          value={filters.model}
          onChange={(val) => setFilters((prev) => ({ ...prev, model: val }))}
          buttonClassName="bg-zinc-50 border-zinc-200 text-xs font-semibold"
        />
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
        <CustomSelect
          options={[
            { value: 'all', label: 'All Conditions' },
            { value: 'new', label: 'Brand New (Sealed Pack)' },
            { value: 'used', label: 'Pre-Owned (Quality Checked)' },
          ]}
          value={filters.condition}
          onChange={(val) => setFilters((prev) => ({ ...prev, condition: val as any }))}
          buttonClassName="bg-zinc-50 border-zinc-200 text-xs font-semibold"
        />
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600">Sort By</label>
        <CustomSelect
          options={[
            { value: 'featured', label: 'Featured First' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'newest', label: 'Newest Stock' },
          ]}
          value={filters.sortBy}
          onChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
          buttonClassName="bg-zinc-50 border-zinc-200 text-xs font-semibold"
        />
      </div>

      <div className="pt-3 border-t border-zinc-200 text-xs text-zinc-500 flex items-center justify-between">
        <span>Showing devices:</span>
        <span className="font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">{totalResults}</span>
      </div>
    </div>
  );
};
