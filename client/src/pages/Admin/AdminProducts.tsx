import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import type { Product } from '../../types/product';
import type { ProductStock } from '../../types/stock';
import { useProducts } from '../../hooks/useProducts';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { CustomSelect } from '../../components/common/CustomSelect';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Layers,
  Filter,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const [stockRecords, setStockRecords] = useState<ProductStock[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL');
  const [customDate, setCustomDate] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedSortOption, setSelectedSortOption] = useState('NEWEST');

  const [toastMsg, setToastMsg] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStockData = async () => {
    try {
      const list = await StockService.getStockList();
      setStockRecords(list);
    } catch (err) {
      console.error('Failed loading stock records in AdminProducts:', err);
    }
  };

  useEffect(() => {
    loadStockData();

    const handleUpdate = () => {
      loadStockData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_products_updated', handleUpdate);
      window.addEventListener('mstore_stock_updated', handleUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_products_updated', handleUpdate);
        window.removeEventListener('mstore_stock_updated', handleUpdate);
      }
    };
  }, []);

  const getProductStockQty = (productId: string): number => {
    const record = stockRecords.find((s) => String(s.productId) === String(productId));
    if (record !== undefined && record.stock !== undefined) {
      return record.stock;
    }
    const prod = products.find((p) => String(p.id) === String(productId));
    return (prod as any)?.initialStock ?? (prod as any)?.stock ?? 10;
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategoryFilter('ALL');
    setSelectedDateFilter('ALL');
    setCustomDate('');
    setSelectedStatusFilter('ALL');
    setSelectedSortOption('NEWEST');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategoryFilter !== 'ALL' ||
    selectedDateFilter !== 'ALL' ||
    customDate !== '' ||
    selectedStatusFilter !== 'ALL' ||
    selectedSortOption !== 'NEWEST';

  const filtered = products
    .filter((p) => {
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchModel = (p.model || '').toLowerCase().includes(q);
        const matchStorage = (p.storage || '').toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        if (!matchName && !matchModel && !matchStorage && !matchBrand) return false;
      }

      // Category Filter
      if (selectedCategoryFilter !== 'ALL') {
        if (p.category !== selectedCategoryFilter) return false;
      }

      // Real-Time Stock & Availability Status Filter
      const stockQty = getProductStockQty(p.id);
      const isOutOfStock = !p.available || stockQty <= 0;

      if (selectedStatusFilter === 'AVAILABLE' && isOutOfStock) {
        return false;
      }
      if (selectedStatusFilter === 'UNAVAILABLE' && !isOutOfStock) {
        return false;
      }

      // Date Filter
      if (selectedDateFilter !== 'ALL') {
        const prodDate = p.createdAt ? new Date(p.createdAt) : null;
        const now = Date.now();

        if (selectedDateFilter === 'TODAY') {
          if (!prodDate) return false;
          const todayStr = new Date().toISOString().split('T')[0];
          const prodDateStr = prodDate.toISOString().split('T')[0];
          if (prodDateStr !== todayStr) return false;
        } else if (selectedDateFilter === 'THIS_WEEK') {
          if (!prodDate) return false;
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          if (now - prodDate.getTime() > sevenDaysMs) return false;
        } else if (selectedDateFilter === 'THIS_MONTH') {
          if (!prodDate) return false;
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          if (now - prodDate.getTime() > thirtyDaysMs) return false;
        } else if (selectedDateFilter === 'CUSTOM' && customDate) {
          if (!prodDate) return false;
          const prodDateStr = prodDate.toISOString().split('T')[0];
          if (prodDateStr !== customDate) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (selectedSortOption === 'OLDEST') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      }
      if (selectedSortOption === 'PRICE_HIGH') {
        return b.price - a.price;
      }
      if (selectedSortOption === 'PRICE_LOW') {
        return a.price - b.price;
      }
      if (selectedSortOption === 'NAME_ASC') {
        return a.name.localeCompare(b.name);
      }
      // Default: NEWEST
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleToggleSold = async (id: string) => {
    await ProductService.toggleProductAvailability(id);
    await refreshProducts();
    await loadStockData();
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
      await loadStockData();
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link to="/mstore-management-portal/segments">
            <Button size="sm" variant="secondary" icon={<Layers className="w-4 h-4" />}>
              iPhone Segments
            </Button>
          </Link>
          <Link to="/mstore-management-portal/products/new?type=iphone">
            <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add Phone / Device
            </Button>
          </Link>
          <Link to="/mstore-management-portal/products/new?type=accessory">
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
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm relative z-20">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter stock by name, model, or storage..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Category Filter */}
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

          {/* Date Filter */}
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Dates' },
              { value: 'TODAY', label: 'Added Today' },
              { value: 'THIS_WEEK', label: 'Last 7 Days' },
              { value: 'THIS_MONTH', label: 'Last 30 Days' },
              { value: 'CUSTOM', label: 'Specific Date...' },
            ]}
            value={selectedDateFilter}
            onChange={(val) => {
              setSelectedDateFilter(val);
              if (val !== 'CUSTOM') setCustomDate('');
            }}
            icon={<Calendar className="w-3.5 h-3.5 text-zinc-500" />}
            buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
          />

          {/* Custom Date Input */}
          {selectedDateFilter === 'CUSTOM' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          )}

          {/* Stock Availability Status Filter */}
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'AVAILABLE', label: 'In Stock Only' },
              { value: 'UNAVAILABLE', label: 'Out of Stock Only' },
            ]}
            value={selectedStatusFilter}
            onChange={(val) => setSelectedStatusFilter(val)}
            icon={<CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />}
            buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
          />

          {/* Sort Options */}
          <CustomSelect
            options={[
              { value: 'NEWEST', label: 'Sort: Newest First' },
              { value: 'OLDEST', label: 'Sort: Oldest First' },
              { value: 'PRICE_HIGH', label: 'Price: High to Low' },
              { value: 'PRICE_LOW', label: 'Price: Low to High' },
              { value: 'NAME_ASC', label: 'Name: A to Z' },
            ]}
            value={selectedSortOption}
            onChange={(val) => setSelectedSortOption(val)}
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />}
            buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
          />

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-xs text-zinc-500 font-semibold">
          <span>
            Showing <strong className="text-zinc-900">{filtered.length}</strong> of <strong className="text-zinc-900">{products.length}</strong> items
          </span>
          {hasActiveFilters && (
            <span className="text-[#E50914] text-[11px] font-medium">
              Filters active
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product / Item</th>
                <th className="p-4">Added Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Specs / Condition</th>
                <th className="p-4">Stock Status</th>
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
                  const stockQty = getProductStockQty(product.id);
                  const isOutOfStock = !product.available || stockQty <= 0;

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
                      <td className="p-4 font-semibold text-zinc-600 text-xs">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </td>
                      <td className="p-4">
                        {product.category === 'iphone-used' && <Badge variant="used">Pre-Owned</Badge>}
                        {product.category === 'iphone-new' && <Badge variant="new">Brand New</Badge>}
                        {product.category === 'accessory' && <Badge variant="accessory">Accessory</Badge>}
                        {product.category !== 'iphone-used' && product.category !== 'iphone-new' && product.category !== 'accessory' && (
                          <Badge variant="secondary" className="capitalize">
                            {(product.category || 'Device').replace(/-/g, ' ')}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 font-bold text-zinc-900 text-sm">{formatCurrency(product.price)}</td>
                      <td className="p-4 font-medium text-xs">
                        {product.category !== 'iphone-new' && product.condition !== 'Brand New' && product.batteryHealth ? (
                          <span className="text-emerald-600 font-semibold">{product.batteryHealth}% Battery</span>
                        ) : (
                          <span className="text-zinc-700 font-semibold">{product.condition || 'Brand New'}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleSold(product.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-colors whitespace-nowrap shrink-0 ${
                            isOutOfStock
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Click to toggle availability"
                        >
                          {stockQty === 0
                            ? 'Out of Stock (0 units)'
                            : !product.available
                            ? 'Marked Sold'
                            : `In Stock (${stockQty} units)`}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/mstore-management-portal/products/${product.id}/edit`}
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

