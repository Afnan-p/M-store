import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, MapPin, Flame, Sparkles, Gift, Layers, Package } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { getProductPath } from '../../utils/slug';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { OfferProductService } from '../../services/offerProducts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isUsed = product.category === 'iphone-used';
  const isNew = product.category === 'iphone-new';
  const whatsappUrl = getWhatsAppProductLink(product);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { stores, activeStoreId } = useStore();
  const liked = isInWishlist(product.id);

  const productStore = stores.find((s) => s.id === product.storeId);
  const storeName = productStore ? (productStore.name.includes('-') ? productStore.name.split('-')[1].trim() : productStore.name) : null;

  // Resolve offer items with thumbnail images
  const offerThumbnails = ((): { name: string; image: string; qty: number }[] => {
    if (!product.offer?.enabled || (product.offer?.status || 'active') !== 'active' || !product.offer?.items || product.offer.items.length === 0) {
      return [];
    }
    try {
      const allOfferProds = OfferProductService.getOfferProductsSync();
      const map = new Map(allOfferProds.map((op) => [op.id, op]));
      return product.offer.items.map((item) => {
        const found = map.get(item.offerProductId);
        return {
          name: found?.name || item.offerProductId.replace(/offprod_\d+/, 'Free Accessory Item'),
          image: found?.image || '/images/placeholder-iphone.svg',
          qty: item.quantity,
        };
      });
    } catch {
      return [];
    }
  })();

  // Active Store Stock Calculation
  const targetStoreId = (product.storeId && product.storeId !== 'ALL' && product.storeId !== 'all')
    ? product.storeId
    : (activeStoreId && activeStoreId !== 'ALL' && activeStoreId !== 'all' ? activeStoreId : 'ALL');

  const currentStockNum = ((): number => {
    try {
      const raw = localStorage.getItem('mstore_stock_records_v2') || localStorage.getItem('mstore_stock_records_v1');
      if (raw) {
        const list = JSON.parse(raw);
        const matches = list.filter(
          (s: any) =>
            s.productId === product.id ||
            (s.productName && s.productName.toLowerCase().trim() === product.name.toLowerCase().trim())
        );

        if (matches.length > 0) {
          if (targetStoreId === 'ALL') {
            return matches.reduce((sum: number, item: any) => sum + Math.max(0, Number(item.stock) || 0), 0);
          }
          const item = matches.find((s: any) => s.storeId === targetStoreId);
          if (item && item.stock !== undefined && item.stock !== null) {
            return Math.max(0, Number(item.stock));
          }
        }
      }
    } catch (err) {
      console.error('Error reading stock record:', err);
    }
    return (product as any).initialStock !== undefined ? Number((product as any).initialStock) : 10;
  })();

  const isOutOfStock = currentStockNum === 0;
  const isLowStock = currentStockNum >= 1 && currentStockNum <= 5;

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
      
      {/* 1. EDGE-TO-EDGE FULL-WIDTH TOP PRODUCT IMAGE CONTAINER */}
      <div className="relative w-full h-40 sm:h-52 lg:h-56 bg-zinc-100/70 border-b border-zinc-100 overflow-hidden select-none">
        
        {/* Badges Overlay (Top Left) - Premium Glassmorphism Rounded-MD Tags */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none max-w-[88%]">
          {/* Out of Stock / Low Stock Glass Badge */}
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold bg-zinc-950/85 text-zinc-200 backdrop-blur-md border border-zinc-700/60 shadow-sm tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
              <span>Out of Stock</span>
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold bg-gradient-to-r from-red-600/90 via-rose-600/90 to-red-700/90 text-white backdrop-blur-md border border-white/35 shadow-[0_2px_10px_rgba(229,9,20,0.3)] tracking-tight flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>Only {currentStockNum} Left</span>
            </span>
          ) : null}

          {/* New Product Badge */}
          {isNew && (
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold bg-[#E50914]/90 text-white backdrop-blur-md border border-white/35 shadow-[0_2px_10px_rgba(229,9,20,0.3)] tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 shrink-0" />
              <span>New</span>
            </span>
          )}

          {/* Pre-Owned Badge */}
          {isUsed && (
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-zinc-950/80 text-zinc-100 backdrop-blur-md border border-white/20 shadow-xs tracking-tight flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Pre-Owned</span>
            </span>
          )}

          {/* Accessories Badge */}
          {product.category === 'accessory' && (
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-zinc-900/85 text-zinc-100 backdrop-blur-md border border-white/20 shadow-xs tracking-tight flex items-center gap-1.5">
              <Package className="w-3 h-3 text-indigo-300 shrink-0" />
              <span>Accessories</span>
            </span>
          )}
        </div>

        {/* Floating Glass Offer Bar on Product Image (If Offer Enabled) */}
        {product.offer?.enabled && (product.offer?.status || 'active') === 'active' && (
          <div className="absolute bottom-2 left-2 right-2 z-10 bg-zinc-950/90 backdrop-blur-md border border-white/25 text-white p-1.5 sm:p-2 rounded-xl flex items-center justify-between shadow-lg shadow-black/60 pointer-events-none group-hover:bg-black/95 transition-all gap-2">
            <div className="flex items-center gap-2 truncate min-w-0">
              {offerThumbnails.length > 0 && (
                <div className="flex items-center -space-x-2 shrink-0">
                  {offerThumbnails.slice(0, 2).map((thumb, idx) => (
                    <img
                      key={idx}
                      src={thumb.image}
                      alt={thumb.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-white/80 shadow-xs bg-zinc-900"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg'; }}
                    />
                  ))}
                </div>
              )}
              <div className="truncate text-left leading-tight">
                <div className="text-[10px] sm:text-[11px] font-extrabold text-amber-300 uppercase tracking-wide flex items-center gap-1">
                  <Gift className="w-3 h-3 text-amber-300 shrink-0 inline" />
                  <span className="truncate">{product.offer.title || 'Free Gift Included'}</span>
                </div>
                <div className="text-[10.5px] sm:text-[11.5px] font-bold text-zinc-100 truncate">
                  {offerThumbnails.map((t) => t.name).join(', ') || 'Free Accessory Package'}
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-[#E50914] text-white shrink-0 tracking-tight shadow-xs">
              FREE
            </span>
          </div>
        )}

        {/* Heart Wishlist Icon (Top Right) */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200/60 shadow-xs flex items-center justify-center text-zinc-600 hover:text-rose-500 transition-colors"
          aria-label="Save product"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image - Full Width Container */}
        <Link to={getProductPath(product)} className="w-full h-full flex items-center justify-center p-2 sm:p-3">
          <img
            src={product.images[0] || '/images/placeholder-iphone.svg'}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
            }}
            className="max-h-full max-w-full object-contain scale-100 group-hover:scale-[1.03] transition-transform duration-300 pointer-events-none"
          />
        </Link>
      </div>

      {/* 2. COMPACT PRODUCT INFORMATION AREA */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
        
        {/* Title & Storage / Color Metadata */}
        <div>
          <Link to={getProductPath(product)} className="group-hover:text-[#E50914] transition-colors">
            <h3 className="font-sans font-semibold text-[13px] sm:text-[17px] text-zinc-950 tracking-tight leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="text-[10.5px] sm:text-[12px] text-zinc-500 font-normal mt-0.5 flex items-center justify-between gap-1.5 h-4">
            <div className="flex items-center gap-1 sm:gap-1.5 truncate">
              {product.storage !== 'N/A' && <span>{product.storage}</span>}
              {product.storage !== 'N/A' && <span>|</span>}
              <span className="truncate">{swatch.name}</span>
            </div>
            {storeName && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10.5px] font-semibold bg-red-50 text-[#E50914] border border-red-100 shrink-0">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E50914]" />
                {storeName}
              </span>
            )}
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
              to={getProductPath(product)}
              className="flex-1 h-7 sm:h-9 px-1.5 sm:px-3.5 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium transition-colors flex items-center justify-center gap-0.5 sm:gap-1.5 border border-zinc-200/80 truncate"
            >
              <span className="truncate">View Details</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 hidden sm:inline" />
            </Link>

            {/* Modern Official WhatsApp Button (Disabled if Out of Stock) */}
            {isOutOfStock ? (
              <button
                disabled
                title="Out of Stock at selected showroom branch"
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed flex items-center justify-center shrink-0 shadow-xs opacity-60"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-zinc-400" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </button>
            ) : (
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
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

