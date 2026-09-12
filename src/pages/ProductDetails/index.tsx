import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/products';
import type { Product } from '../../types/product';
import { ProductGallery } from '../../components/product/ProductGallery';
import { ProductGrid } from '../../components/product/ProductGrid';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { BRAND_CONFIG } from '../../services/config';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useWishlist } from '../../context/WishlistContext';
import {
  Phone,
  BatteryCharging,
  ArrowLeft,
  Smartphone,
  MapPin,
  ShieldCheck,
  PackageCheck,
  Heart,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ProductService.getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });

    ProductService.getProducts().then((all) => {
      setRelatedProducts(all.filter((item) => item.id !== id).slice(0, 4));
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 max-w-7xl mx-auto px-4 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading Device Details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <Smartphone className="w-12 h-12 mx-auto text-zinc-600" />
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-zinc-400">
          The requested device or accessory might have been sold or removed.
        </p>
        <Link to="/iphones">
          <Button variant="primary">Browse Available Stock</Button>
        </Link>
      </div>
    );
  }

  const isUsed = product.category === 'iphone-used';
  const isNew = product.category === 'iphone-new';
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showroom</span>
        </button>
      </div>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Image Gallery (approx 58%) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Sticky Purchase Panel (approx 42%) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-4.5 sticky top-28">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isNew && <Badge variant="new">Brand New Sealed</Badge>}
            {isUsed && <Badge variant="used">Certified Pre-Owned</Badge>}
            {product.category === 'accessory' && <Badge variant="accessory">Accessory</Badge>}
            
            {product.available ? (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                In Stock
              </span>
            ) : (
              <Badge variant="sold">Sold Out</Badge>
            )}
          </div>

          {/* Title & Finish */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-[32px] font-bold text-zinc-950 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {product.color ? `Color: ${product.color}` : 'Original Finish'} &bull; Storage: {product.storage}
              </p>
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2.5 sm:p-3 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-rose-200 text-zinc-600 hover:text-rose-500 transition-colors shrink-0"
              title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Wishlist toggle"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 bg-white border border-zinc-200/90 rounded-2xl space-y-1.5 shadow-xs">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl sm:text-[28px] font-extrabold text-zinc-950 tracking-tight">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs sm:text-sm text-zinc-400 line-through font-normal">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Save {formatCurrency(savings)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 font-normal">Includes quality guarantee & store testing warranty</div>
          </div>

          {/* Key Specs Matrix */}
          <div className="grid grid-cols-2 gap-2.5 p-3 sm:p-3.5 bg-zinc-50/80 border border-zinc-200/80 rounded-2xl text-xs">
            {isUsed && product.batteryHealth && (
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-zinc-200/80">
                <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-zinc-500 text-[10px] font-medium">Battery Health</div>
                  <div className="font-bold text-zinc-950">{product.batteryHealth}% Health</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-zinc-200/80">
              <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-zinc-500 text-[10px] font-medium">Storage</div>
                <div className="font-bold text-zinc-950">{product.storage}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-zinc-200/80">
              <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
              <div>
                <div className="text-zinc-500 text-[10px] font-medium">Condition</div>
                <div className="font-bold text-zinc-950">{product.condition}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-zinc-200/80">
              <PackageCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="text-zinc-500 text-[10px] font-medium">Diagnostics</div>
                <div className="font-bold text-zinc-950">{product.replacementStatus || 'Verified Original'}</div>
              </div>
            </div>
          </div>

          {/* Prominent CTAs */}
          <div className="space-y-2.5 pt-1">
            <a
              href={getWhatsAppProductLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block"
            >
              <Button size="lg" fullWidth variant="whatsapp" className="h-11 sm:h-12 text-sm font-semibold rounded-xl text-white fill-white" icon={<svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/></svg>}>
                Enquire on WhatsApp
              </Button>
            </a>

            <a href={`tel:${BRAND_CONFIG.phone.replace(/\s+/g, '')}`} className="w-full inline-block">
              <Button size="lg" fullWidth variant="secondary" className="h-11 sm:h-12 text-sm font-semibold rounded-xl bg-zinc-950 hover:bg-black text-white border border-zinc-800" icon={<Phone className="w-4 h-4 text-white" />}>
                Call Store ({BRAND_CONFIG.phone})
              </Button>
            </a>
          </div>

          {/* Store Availability Bar */}
          <div className="p-3.5 sm:p-4 bg-zinc-50/90 border border-zinc-200/80 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between text-zinc-950 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E50914]" />
                Available at M STORE Showrooms:
              </span>
            </div>
            <div className="text-zinc-600 text-[11.5px] leading-relaxed">
              Instant walk-in inspection & pickup available at <strong className="text-zinc-900 font-semibold">Kootanad</strong>, <strong className="text-zinc-900 font-semibold">Kecheri</strong>, and <strong className="text-zinc-900 font-semibold">Mattom</strong> branches.
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs - Balanced Equal Top Start Position */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-10 sm:pt-14 border-t border-zinc-200/80">
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Why Choose This Device?</h3>
          <div className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
            {product.description}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Device Specifications</h3>
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-2.5 text-xs shadow-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-normal">Model Series</span>
              <span className="text-zinc-950 font-semibold">{product.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-normal">Storage Option</span>
              <span className="text-zinc-950 font-semibold">{product.storage}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-normal">Condition Grade</span>
              <span className="text-zinc-950 font-semibold">{product.condition}</span>
            </div>
            {isUsed && product.batteryHealth && (
              <div className="flex justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500 font-normal">Battery Health</span>
                <span className="text-emerald-600 font-bold">{product.batteryHealth}%</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-zinc-500 font-normal">Warranty Included</span>
              <span className="text-[#E50914] font-semibold">{product.warranty || 'Store Warranty'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Devices */}
      {relatedProducts.length > 0 && (
        <div className="space-y-5 pt-10 sm:pt-14 border-t border-zinc-200/80">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Related Devices</h3>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};
