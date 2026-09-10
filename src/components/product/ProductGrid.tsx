import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/product';
import { Smartphone } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  mobileHorizontalScroll?: boolean;
  animated?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyTitle = 'No iPhones found',
  emptySubtitle = 'Try adjusting your filters or search terms.',
  mobileHorizontalScroll = false,
  animated = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 items-stretch w-full">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200/80 rounded-2xl h-72 sm:h-96 animate-pulse p-3 sm:p-4 space-y-4 flex flex-col justify-between"
          >
            <div className="w-full h-36 sm:h-56 bg-zinc-100 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-100 rounded w-1/2"></div>
            </div>
            <div className="h-8 sm:h-10 bg-zinc-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-zinc-200/80 rounded-2xl space-y-3 p-8">
        <Smartphone className="w-12 h-12 mx-auto text-zinc-400" />
        <h3 className="text-lg font-bold text-zinc-900">{emptyTitle}</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">{emptySubtitle}</p>
      </div>
    );
  }

  if (mobileHorizontalScroll) {
    return (
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-6px)] sm:auto-cols-[calc(33.333%-10px)] gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-cols-3 lg:grid-cols-4 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0 md:gap-6 items-stretch w-full">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`snap-start h-full flex flex-col ${animated ? 'apple-reveal-card' : ''}`}
            style={animated ? { transitionDelay: `${100 + idx * 80}ms` } : undefined}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 items-stretch w-full">
      {products.map((product, idx) => (
        <div
          key={product.id}
          className={`h-full flex flex-col ${animated ? 'apple-reveal-card' : ''}`}
          style={animated ? { transitionDelay: `${100 + idx * 80}ms` } : undefined}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
