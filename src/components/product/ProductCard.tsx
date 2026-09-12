import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isUsed = product.category === 'iphone-used';
  const isNew = product.category === 'iphone-new';
  const whatsappUrl = getWhatsAppProductLink(product);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  // Swatches mapping matching Apple-style dots
  const getSwatches = () => {
    if (product.name.includes('15 Pro')) {
      return { dots: ['#8F8A81', '#3B3B3D', '#2B3A4A', '#F2F1EC'], name: 'Natural Titanium' };
    }
    if (product.name.includes('15')) {
      return { dots: ['#2D2E30', '#D2E4D6', '#E3E4E8', '#FCE3E7'], name: 'Black' };
    }
    if (product.name.includes('14 Pro')) {
      return { dots: ['#4B3D59', '#F5E5C9', '#363638', '#E3E4E6'], name: 'Deep Purple' };
    }
    if (product.name.includes('14')) {
      return { dots: ['#A0C0D6', '#E5D5E8', '#2C3035', '#FAFAF5', '#E33B44'], name: 'Blue' };
    }
    return { dots: ['#8F8A81', '#3B3B3D', '#2B3A4A'], name: product.color || 'Default' };
  };

  const swatch = getSwatches();

  return (
    <div className="group relative bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5">
      
      {/* 1. EDGE-TO-EDGE FULL-WIDTH TOP PRODUCT IMAGE CONTAINER (NO INNER WHITE PADDING) */}
      <div className="relative w-full h-40 sm:h-52 lg:h-56 bg-zinc-100/70 border-b border-zinc-100 overflow-hidden select-none">
        
        {/* Badges Overlay (Top Left) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex flex-wrap gap-1 pointer-events-none">
          {isNew && (
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#E50914] text-white shadow-sm tracking-wide">
              New
            </span>
          )}
          {isUsed && (
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-zinc-900/90 backdrop-blur-sm text-white shadow-sm tracking-wide">
              Pre-Owned
            </span>
          )}
          {product.category === 'accessory' && (
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-zinc-800/90 backdrop-blur-sm text-white shadow-sm tracking-wide">
              Accessories
            </span>
          )}
        </div>

        {/* Heart Wishlist Icon (Top Right) */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200/60 shadow-xs flex items-center justify-center text-zinc-600 hover:text-rose-500 transition-colors"
          aria-label="Save product"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image - Full Width Edge-to-Edge Image */}
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img
            src={product.images[0] || '/images/placeholder-iphone.svg'}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
            }}
            className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-300 pointer-events-none"
          />
        </Link>
      </div>

      {/* 2. COMPACT PRODUCT INFORMATION AREA */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
        
        {/* Title & Storage / Color Metadata */}
        <div>
          <Link to={`/product/${product.id}`} className="group-hover:text-[#E50914] transition-colors">
            <h3 className="font-sans font-semibold text-[13px] sm:text-[17px] text-zinc-950 tracking-tight leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="text-[10.5px] sm:text-[12px] text-zinc-500 font-normal mt-0.5 flex items-center gap-1 sm:gap-1.5 h-4">
            {product.storage !== 'N/A' && <span>{product.storage}</span>}
            {product.storage !== 'N/A' && <span>|</span>}
            <span className="truncate">{swatch.name}</span>
          </div>
        </div>

        {/* Price Row */}
        <div className="space-y-1 sm:space-y-2 pt-1.5 border-t border-zinc-100 mt-auto">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-display text-sm sm:text-[20px] font-bold text-zinc-950 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-normal">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* 3. COMPACT BUTTON AREA: "View Details" & Modern Official WhatsApp Button */}
          <div className="flex items-center gap-1 sm:gap-2 pt-0.5 h-8 sm:h-9">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 h-7 sm:h-9 px-1.5 sm:px-3.5 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium transition-colors flex items-center justify-center gap-0.5 sm:gap-1.5 border border-zinc-200/80 truncate"
            >
              <span className="truncate">View Details</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 hidden sm:inline" />
            </Link>

            {/* Modern Official WhatsApp Button (White Background, Green Icon) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-[#25D366] flex items-center justify-center transition-colors shrink-0 shadow-xs"
              title="Enquire on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};

