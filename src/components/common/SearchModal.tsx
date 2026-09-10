import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Smartphone } from 'lucide-react';
import { Modal } from './Modal';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.model.toLowerCase().includes(query.toLowerCase()) ||
          p.storage.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (id: string) => {
    onClose();
    setQuery('');
    navigate(`/product/${id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search iPhone models, storage (e.g., 256GB), accessories..."
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914] text-sm transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Type model name like <span className="text-zinc-800 font-semibold">"iPhone 15 Pro"</span> or storage <span className="text-zinc-800 font-semibold">"256GB"</span>
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-zinc-200 shrink-0 flex items-center justify-center p-1">
                    <img
                      src={product.images[0] || '/images/placeholder-iphone.svg'}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                      }}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-[#E50914] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-medium">
                        {product.storage}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {product.condition} {product.batteryHealth ? `• ${product.batteryHealth}% Battery` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-zinc-900">{formatCurrency(product.price)}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-zinc-500 text-sm">
              <Smartphone className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
              No iPhones or accessories matching "{query}"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
