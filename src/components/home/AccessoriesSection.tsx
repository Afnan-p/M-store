import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';

interface AccessoryItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice?: number;
  image: string;
  link: string;
}

export const AccessoriesSection: React.FC = () => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const accessories: AccessoryItem[] = [
    {
      id: 'p9',
      name: 'AirPods Pro (2nd Gen)',
      desc: 'Active Noise Cancellation & USB-C',
      price: 24900,
      originalPrice: 26900,
      image: '/images/acc-airpods-pro.png',
      link: '/product/p9',
    },
    {
      id: 'p10',
      name: 'Apple Watch Series 9',
      desc: 'S9 SiP chip & Double Tap gesture',
      price: 41900,
      originalPrice: 44900,
      image: '/images/acc-watch-s9.png',
      link: '/product/p10',
    },
    {
      id: 'p11',
      name: 'MagSafe Charger',
      desc: 'Fast wireless charging up to 15W',
      price: 4500,
      originalPrice: 4900,
      image: '/images/acc-magsafe-charger.png',
      link: '/product/p11',
    },
    {
      id: 'p12',
      name: 'iPhone Silicone Case',
      desc: 'MagSafe compatible luxury case',
      price: 4900,
      originalPrice: 5400,
      image: '/images/acc-silicone-case.png',
      link: '/product/p12',
    },
    {
      id: 'p13',
      name: 'HomePod mini',
      desc: 'Room-filling sound & Siri built-in',
      price: 9900,
      originalPrice: 10900,
      image: '/images/acc-homepod-mini.png',
      link: '/product/p13',
    },
  ];

  const getWhatsAppUrl = (item: AccessoryItem) => {
    const text = encodeURIComponent(
      `Hi M STORE, I am interested in buying ${item.name} (${formatCurrency(item.price)}). Please provide more details.`
    );
    return `https://wa.me/919876543210?text=${text}`;
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-zinc-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-7">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-[0.2em] block">
              APPLE ESSENTIALS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
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
        <div className="flex md:grid md:grid-cols-5 gap-2.5 md:gap-5 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {accessories.map((item) => {
            const isLiked = isInWishlist(item.id);
            return (
              <div
                key={item.id}
                className="group relative bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 shrink-0 w-[calc((100%-10px)/2)] snap-start md:w-auto"
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
                        href={getWhatsAppUrl(item)}
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
