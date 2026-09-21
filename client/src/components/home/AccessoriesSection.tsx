import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { getProductPath } from '../../utils/slug';
import { useWishlist } from '../../context/WishlistContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';

interface AccessoryItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice?: number;
  image: string;
  link: string;
  product: Product;
}



const FALLBACK_ACCESSORY_PRODUCTS: Product[] = [
  {
    id: 'acc_airpods_pro_2',
    name: 'AirPods Pro (2nd Gen)',
    model: 'AirPods Pro',
    category: 'accessory',
    price: 18900,
    originalPrice: 24900,
    storage: 'N/A',
    condition: 'Brand New',
    color: 'White',
    available: true,
    storeId: 'ALL',
    images: ['/images/cat-accessories.png'],
    description: 'USB-C • Active Noise Cancellation & Spatial Audio',
  },
  {
    id: 'acc_apple_20w_charger',
    name: 'Apple 20W USB-C Adapter',
    model: '20W Adapter',
    category: 'accessory',
    price: 1890,
    originalPrice: 2190,
    storage: 'N/A',
    condition: 'Brand New',
    color: 'White',
    available: true,
    storeId: 'ALL',
    images: ['/images/cat-accessories.png'],
    description: 'Official Fast Charging Power Adapter for iPhone',
  },
  {
    id: 'acc_magsafe_charger',
    name: 'Apple MagSafe Charger',
    model: 'MagSafe',
    category: 'accessory',
    price: 3890,
    originalPrice: 4500,
    storage: 'N/A',
    condition: 'Brand New',
    color: 'Silver',
    available: true,
    storeId: 'ALL',
    images: ['/images/cat-accessories.png'],
    description: '15W Fast Wireless Charging Disk with MagSafe Magnet Alignment',
  },
  {
    id: 'acc_apple_silicone_case',
    name: 'iPhone MagSafe Silicone Case',
    model: 'Silicone Case',
    category: 'accessory',
    price: 2490,
    originalPrice: 4900,
    storage: 'N/A',
    condition: 'Brand New',
    color: 'Midnight Black',
    available: true,
    storeId: 'ALL',
    images: ['/images/cat-accessories.png'],
    description: 'Original Apple Soft-touch Silky Finish with MagSafe Support',
  },
  {
    id: 'acc_apple_watch_s9',
    name: 'Apple Watch Series 9',
    model: 'Series 9',
    category: 'accessory',
    price: 34900,
    originalPrice: 44900,
    storage: 'N/A',
    condition: 'Brand New',
    color: 'Midnight Aluminum',
    available: true,
    storeId: 'ALL',
    images: ['/images/cat-accessories.png'],
    description: 'GPS 45mm • S9 Chip • Double Tap Gesture Control',
  },
];

export const AccessoriesSection: React.FC = () => {
  const { products, loading } = useProducts();
  const { activeStoreId } = useStore();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.01, rootMargin: '300px 0px 300px 0px' });

  // Filter dynamic backend products for category === 'accessory'
  const realAccessories = products.filter(
    (p) => p.category === 'accessory' && p.available !== false
  );

  // Filter accessories by active store context
  const storeFiltered = realAccessories.filter((p) => {
    if (!activeStoreId || activeStoreId === 'ALL' || activeStoreId === 'all') return true;
    return p.storeId === 'ALL' || p.storeId === 'all' || p.storeId === activeStoreId;
  });

  // Prioritize featured accessories first, then non-featured
  const featured = storeFiltered.filter((p) => p.featured === true);
  const nonFeatured = storeFiltered.filter((p) => !p.featured);
  const targetAccessories = [...featured, ...nonFeatured];

  // Fallback chain: Store-filtered -> All DB Accessories -> Curated Essential Fallbacks
  const finalAccessories = targetAccessories.length > 0
    ? targetAccessories
    : (realAccessories.length > 0 ? realAccessories : FALLBACK_ACCESSORY_PRODUCTS);

  // Loading state skeleton to prevent initial blank flash or lag
  if (loading) {
    return (
      <section className="py-9 sm:py-12 lg:py-11 bg-white border-b border-zinc-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-7">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-zinc-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-28 bg-zinc-200 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden h-72 animate-pulse space-y-3 p-3">
                <div className="w-full h-36 bg-zinc-100 rounded-xl" />
                <div className="h-4 w-3/4 bg-zinc-200 rounded" />
                <div className="h-3 w-1/2 bg-zinc-100 rounded" />
                <div className="h-6 w-1/3 bg-zinc-200 rounded mt-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayAccessories: AccessoryItem[] = finalAccessories.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    desc: p.description || p.subCategory || 'Apple Essential Accessory',
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images && p.images.length > 0 ? p.images[0] : '/images/cat-accessories.png',
    link: getProductPath(p),
    product: p,
  }));

  return (
    <section ref={ref} className="py-9 sm:py-12 lg:py-11 bg-white border-b border-zinc-200/60">
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-7 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 apple-reveal-item" style={{ transitionDelay: '0ms' }}>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-[0.2em] block">
              APPLE ESSENTIALS
            </span>
            <h2 className="font-ds-quilter text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
              Complete Your Setup.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed max-w-lg">
              Premium accessories designed to complement the way you use your Apple devices.
            </p>
          </div>

          <Link
            to="/accessories"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-900 hover:text-[#E50914] bg-white border border-zinc-200/90 hover:bg-zinc-100 transition-colors shrink-0 shadow-xs"
          >
            <span>View Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Card Mobile Carousel / 5-Column Desktop Grid */}
        <div className="flex md:grid md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-2 pt-1">
          {displayAccessories.map((item, idx) => {
            const isLiked = isInWishlist(item.id);
            return (
              <div
                key={item.id}
                className="group relative bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 shrink-0 w-[calc((100%-12px)/2)] sm:w-[240px] snap-start md:w-auto apple-reveal-card"
                style={{ transitionDelay: `${100 + idx * 80}ms` }}
              >
                {/* Product Image Area - Edge to Edge Fixed Aspect Ratio */}
                <div className="relative w-full h-40 sm:h-48 bg-zinc-50 border-b border-zinc-100 overflow-hidden select-none">
                  {/* Heart Wishlist Icon (Top Right) */}
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200/60 shadow-xs flex items-center justify-center text-zinc-600 hover:text-rose-500 transition-colors"
                    aria-label={`Save ${item.name}`}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <Link to={item.link} className="w-full h-full block">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cat-accessories.png';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 pointer-events-none"
                    />
                  </Link>
                </div>

                {/* Compact Product Info & Action Buttons */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <div>
                    <Link to={item.link} className="group-hover:text-[#E50914] transition-colors">
                      <h3 className="font-display font-semibold text-[15px] sm:text-base text-zinc-950 tracking-tight leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[12px] text-zinc-500 font-normal leading-snug line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="space-y-1.5 sm:space-y-2.5 pt-2 border-t border-zinc-100 mt-auto">
                    <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                      <span className="font-display text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[11px] sm:text-xs text-zinc-400 line-through font-normal">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: View Details & Clean WhatsApp Button */}
                    <div className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9">
                      <Link
                        to={item.link}
                        className="flex-1 h-8 sm:h-9 px-2 sm:px-3 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 rounded-xl text-[11px] sm:text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-zinc-200/80"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Link>

                      <a
                        href={getWhatsAppProductLink(item.product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/90 text-[#25D366] flex items-center justify-center transition-colors shrink-0 shadow-xs"
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
          })}
        </div>

      </div>
    </section>
  );
};
