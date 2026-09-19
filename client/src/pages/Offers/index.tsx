import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';
import { ProductGrid } from '../../components/product/ProductGrid';
import { MapPin, Flame, Gift } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { Button } from '../../components/common/Button';

export const OffersPage: React.FC = () => {
  const { products, loading } = useProducts();
  const { activeStoreId, stores, setActiveStoreId } = useStore();
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<'ALL' | 'IPHONE' | 'ACCESSORY'>('ALL');

  // Base list of all active offer-enabled products matching active store selection
  const allStoreOfferProducts = products.filter((p) => {
    // Show ONLY products where the admin has explicitly enabled a product offer
    const isOfferActive = Boolean(p.offer?.enabled) && p.offer?.status === 'active';
    if (!isOfferActive) return false;

    // Store filter
    if (activeStoreId !== 'ALL' && activeStoreId !== 'all') {
      if (p.storeId && p.storeId !== activeStoreId && p.storeId !== 'ALL' && p.storeId !== 'all') return false;
    }

    return true;
  });

  const iphoneOffersCount = allStoreOfferProducts.filter(
    (p) => p.category === 'iphone-new' || p.category === 'iphone-used'
  ).length;

  const accessoryOffersCount = allStoreOfferProducts.filter(
    (p) => p.category === 'accessory'
  ).length;

  // Final filtered list based on active category tab
  const offerProducts = allStoreOfferProducts.filter((p) => {
    if (selectedOfferCategory === 'IPHONE') {
      if (p.category !== 'iphone-new' && p.category !== 'iphone-used') return false;
    } else if (selectedOfferCategory === 'ACCESSORY') {
      if (p.category !== 'accessory') return false;
    }
    return true;
  });

  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
      {/* Premium Apple Promotional Hero Banner (/offers Page Top Banner) */}
      <div className="relative rounded-3xl border border-zinc-200/90 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs bg-gradient-to-r from-[#FAF9F6] via-rose-50/30 to-white min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center">
        
        {/* Soft Ambient Radial Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_75%_50%,rgba(229,9,20,0.06)_0%,rgba(255,255,255,0)_70%)] pointer-events-none z-0" />

        {/* Left Side: Tagline, Main Headline, Subtitle & WhatsApp CTA */}
        <div className="space-y-4 max-w-xl lg:max-w-2xl relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-[#E50914] text-[11px] font-extrabold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 fill-current text-[#E50914]" />
            <span>Showroom Promotional Deals</span>
          </div>

          <h1 className="font-ds-quilter text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.08]">
            Exclusive <br className="hidden sm:inline" />
            <span className="text-[#E50914]">Deals & Offers</span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-zinc-600 font-medium leading-relaxed max-w-md">
            Handpicked device offers, verified pre-owned deals, and free genuine Apple accessories with select iPhones across our Kerala showrooms.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={getGeneralWhatsAppLink(
                'Hi M Store, I would like to inquire about your current active promotional offer deals.'
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="md"
                variant="whatsapp"
                icon={<Gift className="w-4 h-4 text-white" />}
                className="px-6 shadow-md shadow-emerald-600/20"
              >
                Inquire Active Offers
              </Button>
            </a>
          </div>
        </div>

        {/* Right Side: Clean High-Res Isolated Product Render (No Text Overlap or Inner Banner) */}
        <div className="hidden lg:flex absolute right-4 xl:right-10 top-0 bottom-0 w-[45%] items-center justify-end pointer-events-none z-0">
          <img
            src="/images/offers-hero-phones.png"
            alt="Exclusive Apple Deals & Offers"
            className="h-[92%] w-auto max-h-[360px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] rounded-2xl"
          />
        </div>

      </div>

      {/* Store & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedOfferCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedOfferCategory === 'ALL'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Offers ({allStoreOfferProducts.length})
          </button>
          <button
            onClick={() => setSelectedOfferCategory('IPHONE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedOfferCategory === 'IPHONE'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            iPhone Offers ({iphoneOffersCount})
          </button>
          <button
            onClick={() => setSelectedOfferCategory('ACCESSORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedOfferCategory === 'ACCESSORY'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Accessory Offers ({accessoryOffersCount})
          </button>
        </div>

        {/* Store Location Status Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium hidden sm:inline">Active Branch:</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
            <select
              value={activeStoreId}
              onChange={(e) => setActiveStoreId(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer font-bold text-zinc-900 text-xs"
            >
              <option value="ALL">All Kerala Showrooms</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Offers Product Grid */}
      <ProductGrid
        products={offerProducts}
        loading={loading}
        emptyTitle="No Active Offers Found"
        emptySubtitle="There are currently no active promotional offer deals matching your selected category or store branch."
      />
    </div>
  );
};
