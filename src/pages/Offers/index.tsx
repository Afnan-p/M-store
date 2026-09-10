import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Tag, Sparkles } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { Button } from '../../components/common/Button';

export const OffersPage: React.FC = () => {
  const { products, loading } = useProducts();
  const offerProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
      {/* Banner Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-50 via-zinc-50 to-white border border-rose-100 p-8 sm:p-14 overflow-hidden shadow-xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-xs font-bold text-[#E50914]">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Exclusive Showroom Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight">
            Special <span className="text-[#E50914]">Offers</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600">
            Handpicked device price drops and accessory bundles available at our Kootanad, Kecheri, and Mattom showrooms.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          <a href={getGeneralWhatsAppLink('Hi M Store, I would like to inquire about your current active promotional offers.')} target="_blank" rel="noopener noreferrer">
            <Button size="md" variant="whatsapp" icon={<svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/></svg>}>
              Enquire Special Offer Stock
            </Button>
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-4">
          <Tag className="w-5 h-5 text-[#E50914]" />
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Discounted Stock & Bundles</h2>
        </div>

        <ProductGrid
          products={offerProducts.length > 0 ? offerProducts : products}
          loading={loading}
        />
      </div>
    </div>
  );
};
