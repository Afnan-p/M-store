import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';
import { ProductService } from '../../services/products';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { CustomSelect } from '../../components/common/CustomSelect';
import { Plus, Edit, Trash2, Search, Layers, Store as StoreIcon, Filter } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const { stores } = useStore();
  const [search, setSearch] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = products.filter((p) => {
    // Search query
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase()) ||
      p.storage.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    // Store Filter
    if (selectedStoreFilter !== 'ALL' && selectedStoreFilter !== 'all') {
      const pStore = p.storeId || 'store001';
      if (pStore !== selectedStoreFilter && pStore !== 'ALL' && pStore !== 'all') return false;
    }

    // Category Filter
    if (selectedCategoryFilter !== 'ALL') {
      if (p.category !== selectedCategoryFilter) return false;
    }

    return true;
  });

  const handleToggleSold = async (id: string) => {
    await ProductService.toggleProductAvailability(id);
    await refreshProducts();
    setToastMsg('Product availability updated');
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const prodId = productToDelete.id || (productToDelete as any)._id;
    if (!prodId) return;

    try {
      setIsDeleting(true);
      await ProductService.deleteProduct(prodId);
      await refreshProducts();
      setToastMsg(`Deleted ${productToDelete.name}`);
    } catch (err) {
      console.error('Delete product error:', err);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Product & Accessory Inventory"
      subtitle="Manage device listings, store-based accessories, prices, showroom store assignments, and stock status."
      action={
        <div className="flex items-center gap-3">
          <Link to="/admin/stores">
            <Button size="sm" variant="secondary" icon={<StoreIcon className="w-4 h-4" />}>
              Showroom Stores
            </Button>
          </Link>
          <Link to="/admin/segments">
            <Button size="sm" variant="secondary" icon={<Layers className="w-4 h-4" />}>
              iPhone Segments
            </Button>
          </Link>
          <Link to="/admin/products/new?type=iphone">
            <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add iPhone
            </Button>
          </Link>
          <Link to="/admin/products/new?type=accessory">
            <Button size="sm" variant="secondary" className="bg-zinc-900 text-white hover:bg-black" icon={<Plus className="w-4 h-4" />}>
              Add Accessory
            </Button>
          </Link>
        </div>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Sleek Custom Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Delete Product?</h3>
                <p className="text-xs text-zinc-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-zinc-900 text-sm">{productToDelete.name}</div>
              <div className="text-zinc-500 font-medium">
                Category: <span className="text-zinc-800 font-semibold">{productToDelete.category}</span> &bull; Price: <span className="text-zinc-800 font-semibold">{formatCurrency(productToDelete.price)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm relative z-20">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter stock by name, model, or storage..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Filter By Store Dropdown */}
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Stores' },
              ...stores.map((s) => ({ value: s.id, label: s.name })),
            ]}
            value={selectedStoreFilter}
            onChange={(val) => setSelectedStoreFilter(val)}
            icon={<StoreIcon className="w-3.5 h-3.5 text-[#E50914]" />}
            buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
          />

          {/* Filter By Category Dropdown */}
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Items' },
              { value: 'iphone-new', label: 'Brand New iPhones' },
              { value: 'iphone-used', label: 'Pre-Owned iPhones' },
              { value: 'accessory', label: 'Accessories' },
            ]}
            value={selectedCategoryFilter}
            onChange={(val) => setSelectedCategoryFilter(val)}
            icon={<Filter className="w-3.5 h-3.5 text-zinc-500" />}
            buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
          />
        </div>

        <span className="text-xs text-zinc-500 font-semibold">
          Total listed: <strong className="text-zinc-900">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product / Item</th>
                <th className="p-4">Showroom Store</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Specs / Condition</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const assignedStore = stores.find((s) => s.id === (product.storeId || 'store001'));

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg border border-zinc-200 p-1 flex items-center justify-center">
                          <img
                            src={product.images[0] || '/images/placeholder-iphone.svg'}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-900 text-sm">{product.name}</div>
                        <div className="text-[11px] text-zinc-500">
                          {product.category === 'accessory'
                            ? (product.color || 'Original Accessory')
                            : `${product.storage} • ${product.color || 'N/A'}`}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          <StoreIcon className="w-3 h-3 text-[#E50914]" />
                          {product.storeId === 'ALL' || product.storeId === 'all'
                            ? 'All Stores'
                            : assignedStore?.name || product.storeId || 'Store 1'}
                        </span>
                      </td>
                      <td className="p-4">
                        {product.category === 'iphone-used' && <Badge variant="used">Pre-Owned</Badge>}
                        {product.category === 'iphone-new' && <Badge variant="new">Brand New</Badge>}
                        {product.category === 'accessory' && <Badge variant="accessory">Accessory</Badge>}
                      </td>
                      <td className="p-4 font-bold text-zinc-900 text-sm">{formatCurrency(product.price)}</td>
                      <td className="p-4">
                        {product.batteryHealth ? (
                          <span className="text-emerald-600 font-semibold">{product.batteryHealth}% Battery</span>
                        ) : (
                          product.condition || 'New'
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleSold(product.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            product.available
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {product.available ? 'In Stock' : 'Marked Sold'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition-colors border border-zinc-200"
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-lg transition-colors border border-zinc-200"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
