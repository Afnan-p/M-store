import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';
import { OfferProductService } from '../../services/offerProducts';
import { ProductService } from '../../services/products';
import type { OfferProduct } from '../../types/offerProduct';
import type { Product } from '../../types/product';
import { Toast } from '../../components/common/Toast';
import {
  Search,
  Store as StoreIcon,
  Filter,
  Sparkles,
  Gift,
  Edit,
  Plus,
} from 'lucide-react';

export const AdminOffers: React.FC = () => {
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { stores } = useStore();

  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    OfferProductService.getOfferProducts().then(setOfferProducts);
  }, []);

  const offerProductsMap = new Map(offerProducts.map((item) => [item.id, item]));

  // Products with offer configured
  const productsWithOffers = products.filter(
    (p) => Boolean(p.offer?.enabled) || Boolean(p.isOffer)
  );

  // Filtered Products List
  const filteredProductsWithOffers = productsWithOffers.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase()) ||
      (p.offer?.title && p.offer.title.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    if (selectedStoreFilter !== 'ALL' && selectedStoreFilter !== 'all' && (p.storeId || 'store001') !== selectedStoreFilter && p.storeId !== 'ALL' && p.storeId !== 'all') {
      return false;
    }

    const offerStatus = p.offer?.status || 'active';
    if (selectedStatusFilter !== 'ALL' && offerStatus !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  // Summary Metrics
  const activeOffersCount = productsWithOffers.filter(
    (p) => (p.offer?.status || 'active') === 'active'
  ).length;

  const storesWithOffersCount = new Set(
    productsWithOffers
      .filter((p) => (p.offer?.status || 'active') === 'active')
      .map((p) => p.storeId || 'store001')
  ).size;

  // Toggle Offer Status ON / OFF directly
  const handleToggleOfferStatus = async (product: Product) => {
    const currentOffer = product.offer || {
      enabled: true,
      status: 'active',
      items: [],
    };
    const newStatus = currentOffer.status === 'active' ? 'disabled' : 'active';

    await ProductService.updateProduct(product.id, {
      ...product,
      offer: {
        ...currentOffer,
        status: newStatus,
      },
    });

    await refreshProducts();
    setToastMsg(`Offer set to ${newStatus} for "${product.name}"`);
  };

  return (
    <AdminLayout
      title="Offers Directory"
      subtitle="Overview of main products with active free offer packages."
      action={
        <div className="flex items-center gap-2">
          <Link to="/mstore-management-portal/offer-products">
            <button className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Manage Offer Products</span>
            </button>
          </Link>
          <Link to="/mstore-management-portal/products/new?type=iphone">
            <button className="px-4 py-2 bg-[#E50914] text-white hover:bg-red-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Add iPhone + Offer</span>
            </button>
          </Link>
        </div>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Metric Cards Row (Clean Product-Based Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatsCard
          title="ACTIVE OFFERS"
          value={activeOffersCount}
          subtitle="Products with free items"
          icon={<Sparkles className="w-4 h-4 text-[#E50914]" />}
          accentColor="border-rose-500/30"
        />
        <StatsCard
          title="OFFER PRODUCTS"
          value={offerProducts.length}
          subtitle="Reusable free items catalog"
          icon={<Gift className="w-4 h-4 text-purple-600" />}
          accentColor="border-purple-500/30"
        />
        <StatsCard
          title="STORES WITH OFFERS"
          value={storesWithOffersCount}
          subtitle="Showroom coverage"
          icon={<StoreIcon className="w-4 h-4 text-zinc-900" />}
        />
      </div>

      {/* Control Bar: Search + Store Filter + Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or free offer titles..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* Store Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs">
              <StoreIcon className="w-3.5 h-3.5 text-[#E50914]" />
              <select
                value={selectedStoreFilter}
                onChange={(e) => setSelectedStoreFilter(e.target.value)}
                className="bg-transparent font-bold text-zinc-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Stores</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-zinc-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <h2 className="font-extrabold text-sm sm:text-base text-zinc-900">
              Main Products With Offers ({filteredProductsWithOffers.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            Click 'Edit' on any product to change attached free items
          </span>
        </div>

        {productsLoading ? (
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl text-center text-zinc-500 text-xs">
            Loading products with offers...
          </div>
        ) : filteredProductsWithOffers.length === 0 ? (
          <div className="p-10 bg-white border border-zinc-200 rounded-2xl text-center space-y-3">
            <Gift className="w-10 h-10 text-zinc-300 mx-auto" />
            <div className="font-bold text-sm text-zinc-700">No active product offers found</div>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              To attach a free offer to an iPhone or accessory, edit the product and turn "Enable Offer = ON".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProductsWithOffers.map((product) => {
              const assignedStore = stores.find((s) => s.id === (product.storeId || 'store001'));
              const offerObj = product.offer;
              const isOfferActive = (offerObj?.status || 'active') === 'active';

              // Resolve items list
              const freeItemsList = offerObj?.items || [];

              return (
                <div
                  key={product.id}
                  className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Main Product Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || '/images/placeholder-iphone.svg'}
                          alt={product.name}
                          className="w-12 h-12 object-contain rounded-xl bg-zinc-100 p-1 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
                            <span>{product.name}</span>
                            <Sparkles className="w-3.5 h-3.5 text-[#E50914] fill-current shrink-0" />
                          </div>
                          <div className="text-xs font-semibold text-zinc-500">
                            {product.storage !== 'N/A' ? `${product.storage} • ${product.color || 'Default'}` : product.category}
                          </div>
                        </div>
                      </div>

                      {/* Store Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200 whitespace-nowrap">
                        <StoreIcon className="w-3 h-3 text-[#E50914]" />
                        {product.storeId === 'ALL' || product.storeId === 'all'
                          ? 'All Stores'
                          : (assignedStore?.name || product.storeId || 'Store 1')}
                      </span>
                    </div>

                    {/* Offer Title Banner */}
                    <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-900 flex items-center gap-1">
                          🎁 {offerObj?.title || 'Special Free Offer Included'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isOfferActive
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                          }`}
                        >
                          {isOfferActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      {/* Free Items List */}
                      <div className="space-y-1 pt-1 border-t border-rose-200/60 text-xs">
                        <span className="text-[11px] font-bold text-zinc-500">Included Free Items:</span>
                        {freeItemsList.length === 0 ? (
                          <div className="text-xs text-zinc-400 italic">No free items attached yet</div>
                        ) : (
                          <div className="space-y-1">
                            {freeItemsList.map((item, idx) => {
                              const offerProd = offerProductsMap.get(item.offerProductId);
                              return (
                                <div key={idx} className="flex items-center gap-2 font-bold text-zinc-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0" />
                                  <span>{offerProd?.name || item.offerProductId}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-black border border-rose-200 text-[#E50914]">
                                    × {item.quantity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleOfferStatus(product)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        isOfferActive
                          ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isOfferActive ? 'Disable Offer' : 'Enable Offer'}
                    </button>

                    <Link
                      to={`/mstore-management-portal/products/${product.id}/edit`}
                      className="px-4 py-1.5 bg-[#E50914] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Offer & Product</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
