import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';
import { ProductGrid } from '../../components/product/ProductGrid';
import { MapPin, Flame, Gift } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { Button } from '../../components/common/Button';
import { SEO } from '../../components/common/SEO';
import { generateBreadcrumbSchema } from '../../utils/seo';
import { isIPhoneProduct, isAndroidProduct } from '../../utils/categoryUtils';

export const OffersPage: React.FC = () => {
  const { products, loading } = useProducts();
  const { activeStoreId, stores, setActiveStoreId } = useStore();
  const { settings } = useSettings();
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<'ALL' | 'IPHONE' | 'ANDROID' | 'ACCESSORY'>('ALL');

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

  const iphoneOffersCount = allStoreOfferProducts.filter((p) => isIPhoneProduct(p)).length;

  const androidOffersCount = allStoreOfferProducts.filter((p) => isAndroidProduct(p)).length;

  const accessoryOffersCount = allStoreOfferProducts.filter((p) => p.category === 'accessory').length;

  // Final filtered list based on active category tab
  const offerProducts = allStoreOfferProducts.filter((p) => {
    if (selectedOfferCategory === 'IPHONE') {
      return isIPhoneProduct(p);
    } else if (selectedOfferCategory === 'ANDROID') {
      return isAndroidProduct(p);
    } else if (selectedOfferCategory === 'ACCESSORY') {
      return p.category === 'accessory';
    }
    return true;
  });

  const offersBreadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Offers', url: '/offers' },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
      <SEO
        title="iPhone & Smartphone Offers & Best Deals Kerala | M Store"
        description="Explore active iPhone & Android discounts, bundled accessory offers, and special festival deals at M Store Kerala. Save on new and certified pre-owned devices."
        jsonLd={offersBreadcrumbs}
      />
      {/* Premium Apple Promotional Hero Banner (/offers Page Top Banner) */}
      <div className="relative rounded-3xl border border-zinc-200/90 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center">
        {/* Full Seamless Background Image */}
        <img
          src="/images/special-offer-bg.png"
          alt="Exclusive Apple Deals & Offers Background"
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center pointer-events-none z-0"
        />

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
            Handpicked device offers, verified pre-owned deals, and free genuine accessories with select devices across our Kerala showrooms.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={getGeneralWhatsAppLink(
                'Hi M Store, I would like to inquire about your current active promotional offer deals.',
                settings.whatsappNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-emerald-600 font-extrabold text-xs sm:text-sm border border-emerald-500/30 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
              >
                <Gift className="w-4.5 h-4.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Inquire Active Offers</span>
              </button>
            </a>
          </div>
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
            onClick={() => setSelectedOfferCategory('ANDROID')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedOfferCategory === 'ANDROID'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Android Offers ({androidOffersCount})
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
