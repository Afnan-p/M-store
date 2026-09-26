import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/products';
import type { Product } from '../../types/product';
import { ProductGallery } from '../../components/product/ProductGallery';
import { ProductGrid } from '../../components/product/ProductGrid';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { updateProductSEO, generateProductSchema, generateBreadcrumbSchema } from '../../utils/seo';
import { SEO } from '../../components/common/SEO';
import { BRAND_CONFIG } from '../../services/config';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useSettings } from '../../context/SettingsContext';
import { StockService } from '../../services/stock';
import { OfferProductService } from '../../services/offerProducts';
import {
  Phone,
  BatteryCharging,
  ArrowLeft,
  Smartphone,
  MapPin,
  ShieldCheck,
  PackageCheck,
  Heart,
  Gift,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { stores, activeStoreId, isMultiStoreEnabled } = useStore();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stockNum, setStockNum] = useState<number>(10);
  const [branchBreakdown, setBranchBreakdown] = useState<{ storeId: string; storeName: string; stock: number }[]>([]);

  const targetStoreId = (product?.storeId && product.storeId !== 'ALL' && product.storeId !== 'all')
    ? product.storeId
    : (activeStoreId && activeStoreId !== 'ALL' && activeStoreId !== 'all' ? activeStoreId : 'ALL');

  const offerItemsWithDetails = ((): { name: string; image: string; quantity: number }[] => {
    if (!product?.offer?.enabled || (product?.offer?.status || 'active') !== 'active' || !product?.offer?.items || product.offer.items.length === 0) {
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
          quantity: item.quantity,
        };
      });
    } catch {
      return product.offer.items.map((item) => ({
        name: item.offerProductId.replace(/offprod_\d+/, 'Free Accessory Item'),
        image: '/images/placeholder-iphone.svg',
        quantity: item.quantity,
      }));
    }
  })();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ProductService.getProductById(id).then((p) => {
      setProduct(p);
      updateProductSEO(p);
      setLoading(false);
    });

    ProductService.getProducts().then((all) => {
      setRelatedProducts(all.filter((item) => item.id !== id && item.slug !== id).slice(0, 4));
    });

    return () => {
      updateProductSEO(null);
    };
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;

    const loadStockData = async () => {
      const qty = await StockService.getStockForProduct(product.id, targetStoreId);
      setStockNum(qty);

      const breakdown = await StockService.getProductStockBreakdown(product.id);
      const pStoreIds = Array.isArray(product.storeIds) && product.storeIds.length > 0
        ? product.storeIds
        : (product.storeId ? [product.storeId] : ['ALL']);
      const isAllStores = pStoreIds.some((id) => id === 'ALL' || id === 'all');

      let formatted = stores.map((s) => {
        const match = breakdown.find((b) => b.storeId === s.id);
        let stockVal = match ? Math.max(0, match.stock) : 10;

        const isMatch = isAllStores || pStoreIds.includes(s.id);

        return {
          storeId: s.id,
          storeName: s.name,
          stock: isMatch ? stockVal : 0,
          isAssignedStore: isMatch,
        };
      });

      if (!isAllStores) {
        formatted = formatted.filter((item) => item.isAssignedStore);
      }

      setBranchBreakdown(formatted);
    };

    loadStockData();

    const handleUpdate = () => {
      loadStockData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_stock_updated', handleUpdate);
      window.addEventListener('mstore_products_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_stock_updated', handleUpdate);
        window.removeEventListener('mstore_products_updated', handleUpdate);
      }
    };
  }, [product?.id, product?.storeIds, product?.storeId, targetStoreId, stores]);

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

  const isUsed = product.category === 'iphone-used' || (product.condition && product.condition !== 'Brand New');
  const isNew = product.category === 'iphone-new' || product.condition === 'Brand New';
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const storageStr = product.storage && product.storage !== 'N/A' && product.storage !== 'None' ? product.storage : '';
  const colorStr = product.color && product.color !== 'N/A' && product.color !== 'None' ? product.color : '';
  const conditionStr = product.condition || (isUsed ? 'Pre-Owned' : 'New');

  const dynamicProductTitle = `${product.name} ${storageStr} ${colorStr}`.replace(/\s+/g, ' ').trim() + ` | Price & Availability | M Store Kerala`;
  const dynamicProductDescription = `Buy ${product.name} ${storageStr} ${colorStr} (${conditionStr}) at M Store Kerala. Check current price, condition, availability and product details online.`;

  const categoryPath = product.category === 'accessory'
    ? '/accessories'
    : isUsed
    ? '/used-iphones'
    : '/iphones';

  const categoryLabel = product.category === 'accessory'
    ? 'Accessories'
    : isUsed
    ? 'Used iPhones'
    : 'iPhones';

  const isStockAvailable = stockNum > 0 && product.inStock !== false;

  const productBreadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: categoryLabel, url: categoryPath },
    { name: product.name, url: `/product/${product.id}` },
  ]);

  const productSchema = generateProductSchema(product, isStockAvailable);
  const productJsonLd = [productSchema, productBreadcrumbs].filter(Boolean);

  const primaryImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || '/images/placeholder-iphone.svg');

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      <SEO
        title={dynamicProductTitle}
        description={dynamicProductDescription}
        type="product"
        image={primaryImage}
        jsonLd={productJsonLd}
      />
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
            
            {stockNum === 0 ? (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                Out of Stock
              </span>
            ) : stockNum <= 3 ? (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Only {stockNum} Left in Stock</span>
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Stock ({stockNum} Units Available)</span>
              </span>
            )}
          </div>

          {/* Title & Finish */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-ds-quilter text-2xl sm:text-3xl lg:text-[32px] font-bold text-zinc-950 tracking-tight leading-tight">
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
          {(() => {
            const effectiveOriginal = (product.originalPrice && product.originalPrice > product.price)
              ? product.originalPrice
              : Math.round(product.price * 1.15);
            
            const detailSavings = effectiveOriginal > product.price ? effectiveOriginal - product.price : 0;
            const discountPct = effectiveOriginal > product.price
              ? Math.round((detailSavings / effectiveOriginal) * 100)
              : 0;

            return (
              <div className="p-4 sm:p-5 bg-white border border-zinc-200/90 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl sm:text-[28px] font-extrabold text-zinc-950 tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                    {effectiveOriginal > product.price && (
                      <span className="text-xs sm:text-sm text-zinc-400 line-through font-normal">
                        {formatCurrency(effectiveOriginal)}
                      </span>
                    )}
                  </div>

                  {detailSavings > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Save {formatCurrency(detailSavings)} ({discountPct}% OFF)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 font-normal">Includes quality guarantee & store testing warranty</div>
              </div>
            );
          })()}

          {/* SPECIAL FREE OFFER BANNER */}
          {product.offer?.enabled && (product.offer?.status || 'active') === 'active' && offerItemsWithDetails.length > 0 && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-white border border-rose-200/90 rounded-2xl space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-[#E50914] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Gift className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#E50914]">Special Free Offer Included</div>
                    <h4 className="font-extrabold text-sm sm:text-base text-zinc-950">
                      {product.offer.title || 'Free Items Included With This Product'}
                    </h4>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
                  100% FREE
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-rose-200/60">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Included Free Products:</div>
                <div className="space-y-2">
                  {offerItemsWithDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-bold text-zinc-900 bg-white p-3 rounded-xl border border-rose-100 shadow-xs hover:border-rose-300 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-200/80 shrink-0 bg-zinc-50"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg'; }}
                        />
                        <div className="truncate text-left">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-extrabold text-zinc-950 text-sm truncate">{item.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            Free Gift Package
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-[#E50914] text-xs font-black border border-rose-200 shrink-0">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {product.offer.description && (
                <p className="text-xs text-zinc-600 font-medium pt-1 italic">{product.offer.description}</p>
              )}
            </div>
          )}

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

          {/* Prominent CTAs & Stock Notice */}
          {(() => {
            const isOutOfStock = stockNum === 0 || product.available === false;

            return (
              <div className="space-y-2.5 pt-1">
                {isOutOfStock ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-extrabold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Out of Stock. Contact us on WhatsApp for arrival updates.</span>
                  </div>
                ) : stockNum <= 3 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-extrabold flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>⚡ Low Stock: Only {stockNum} units left in stock!</span>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In Stock! Ready for instant pickup or fast delivery across Kerala.</span>
                  </div>
                )}

                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full h-11 sm:h-12 bg-zinc-200 text-zinc-400 font-bold rounded-xl text-sm cursor-not-allowed border border-zinc-300 flex items-center justify-center gap-2"
                  >
                    <span>Out of Stock</span>
                  </button>
                ) : (
                  <a
                    href={getWhatsAppProductLink(product, undefined, settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-block"
                  >
                    <Button size="lg" fullWidth variant="whatsapp" className="h-11 sm:h-12 text-sm font-semibold rounded-xl text-white fill-white" icon={<svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/></svg>}>
                      Enquire on WhatsApp
                    </Button>
                  </a>
                )}

                <a href={`tel:${(settings.phone || '').replace(/\s+/g, '')}`} className="w-full inline-block">
                  <Button size="lg" fullWidth variant="secondary" className="h-11 sm:h-12 text-sm font-semibold rounded-xl bg-zinc-950 hover:bg-black text-white border border-zinc-800" icon={<Phone className="w-4 h-4 text-white" />}>
                    Call Store ({settings.phone})
                  </Button>
                </a>
              </div>
            );
          })()}

          {/* Showroom Branch Availability Card (Rendered when Multi-Store Mode is enabled) */}
          <div className={`${isMultiStoreEnabled ? 'block' : 'hidden'} p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-extrabold text-xs text-zinc-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#E50914]" />
                Showroom Branch Stock Availability:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-zinc-900 text-white uppercase tracking-wider">
                {targetStoreId === 'ALL' ? 'All Stores View' : 'Filtered Store'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {branchBreakdown.map((b) => {
                const isSelected = targetStoreId === b.storeId;
                const isOut = b.stock === 0;
                const isLow = b.stock >= 1 && b.stock <= 5;
                const cleanName = b.storeName.includes('-') ? b.storeName.split('-')[1].trim() : b.storeName;

                return (
                  <div
                    key={b.storeId}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-red-50/70 border-red-200 font-medium shadow-xs'
                        : 'bg-white border-zinc-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-900 truncate">
                      <span className="truncate">{cleanName}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0" title="Currently Selected" />}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      {isOut ? (
                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {b.stock} left
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {b.stock} in stock
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overview & Store Notes (Only if description is provided) */}
      {product.description && product.description.trim() ? (
        <div className="pt-8 sm:pt-12 border-t border-zinc-200/80 space-y-3">
          <h3 className="font-ds-quilter text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
            {product.category === 'accessory' ? 'Overview & Accessory Notes' : 'Why Choose This Device?'}
          </h3>
          <div className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed whitespace-pre-line bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
            {product.description}
          </div>
        </div>
      ) : null}

      {/* Related Devices / Accessories */}
      {relatedProducts.length > 0 && (
        <div className="space-y-5 pt-8 sm:pt-12 border-t border-zinc-200/80">
          <h3 className="font-ds-quilter text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
            Related {product.category === 'accessory' ? 'Accessories' : 'Devices'}
          </h3>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};
