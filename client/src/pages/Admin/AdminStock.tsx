import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { StockService, calculateStockStatus } from '../../services/stock';
import { useStore } from '../../context/StoreContext';
import type { ProductStock } from '../../types/stock';
import { ManageStockModal } from '../../components/admin/ManageStockModal';
import { Toast } from '../../components/common/Toast';
import { CustomSelect } from '../../components/common/CustomSelect';
import {
  Package,
  Search,
  Store as StoreIcon,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  Layers,
  RefreshCw,
} from 'lucide-react';

export const AdminStockPage: React.FC = () => {
  const { stores } = useStore();
  const [stockRecords, setStockRecords] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'iphone-new' | 'iphone-used' | 'accessory'>('ALL');

  // Modal State
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ProductStock | null>(null);

  useEffect(() => {
    loadStockList();

    const handleUpdate = () => {
      loadStockList();
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
  }, [selectedStoreFilter, selectedStatusFilter, selectedCategoryFilter]);

  const loadStockList = async () => {
    try {
      setLoading(true);
      const data = await StockService.getStockList({
        storeId: selectedStoreFilter,
        status: selectedStatusFilter,
        category: selectedCategoryFilter,
        search,
      });
      setStockRecords(data);
    } catch (err) {
      console.error('Failed to load stock list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStockList();
  };

  const filteredRecords = stockRecords.filter((record) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = record.productName?.toLowerCase().includes(q);
      const matchId = record.productId.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  // Calculate summary stats
  const totalCount = stockRecords.length;
  const inStockCount = stockRecords.filter((s) => calculateStockStatus(s.stock) === 'In Stock').length;
  const lowStockCount = stockRecords.filter((s) => calculateStockStatus(s.stock) === 'Low Stock').length;
  const outOfStockCount = stockRecords.filter((s) => calculateStockStatus(s.stock) === 'Out of Stock').length;

  const handleStockUpdated = (updatedRecord: ProductStock) => {
    setToastMsg(`Updated stock for "${updatedRecord.productName || updatedRecord.productId}" to ${updatedRecord.stock} units`);
    loadStockList();
  };

  return (
    <AdminLayout
      title="Products Stock"
      subtitle="Manage product availability across all showrooms."
      action={
        <button
          onClick={loadStockList}
          className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-zinc-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Stock Items"
          value={totalCount}
          subtitle="Monitored across showrooms"
          icon={<Package className="w-5 h-5 text-zinc-700" />}
        />
        <StatsCard
          title="In Stock (Above 5)"
          value={inStockCount}
          subtitle="Healthy stock levels"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Low Stock (1-5)"
          value={lowStockCount}
          subtitle="Re-order recommended"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="Out of Stock (0)"
          value={outOfStockCount}
          subtitle="Ordering disabled on site"
          icon={<XCircle className="w-5 h-5 text-rose-600" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px]">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, model, or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </form>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Store Filter */}
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

            {/* Status Filter */}
            <CustomSelect
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'In Stock', label: 'In Stock (Above 5)' },
                { value: 'Low Stock', label: 'Low Stock (1-5)' },
                { value: 'Out of Stock', label: 'Out of Stock (0)' },
              ]}
              value={selectedStatusFilter}
              onChange={(val) => setSelectedStatusFilter(val as any)}
              icon={<Filter className="w-3.5 h-3.5 text-zinc-500" />}
              buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
            />

            {/* Category Filter */}
            <CustomSelect
              options={[
                { value: 'ALL', label: 'All Categories' },
                { value: 'iphone-new', label: 'Brand New iPhone' },
                { value: 'iphone-used', label: 'Pre-Owned iPhone' },
                { value: 'accessory', label: 'Accessories' },
              ]}
              value={selectedCategoryFilter}
              onChange={(val) => setSelectedCategoryFilter(val as any)}
              icon={<Layers className="w-3.5 h-3.5 text-zinc-500" />}
              buttonClassName="bg-zinc-50 border-zinc-200 text-zinc-900 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* Stock Table Section */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="p-4">Product Details</th>
                <th className="p-4">Store Branch</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 font-semibold">
                    Loading stock records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500 font-semibold">
                    No stock records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const assignedStore = stores.find((s) => s.id === record.storeId);
                  const storeName = record.storeId === 'ALL' || record.storeId === 'all'
                    ? 'All Stores'
                    : (assignedStore?.name || record.storeId);

                  const status = calculateStockStatus(record.stock);

                  return (
                    <tr key={record.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Product Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-xl border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={record.productImage || '/images/placeholder-iphone.svg'}
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                              }}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-950 text-sm">{record.productName || record.productId}</div>
                            <div className="text-[11px] text-zinc-500 font-medium">
                              {record.productCategory === 'accessory'
                                ? 'Accessory'
                                : `${record.productStorage || '128GB'} • ${record.productCategory === 'iphone-new' ? 'Brand New' : 'Pre-Owned'}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Store Branch Column */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          <StoreIcon className="w-3 h-3 text-[#E50914]" />
                          {storeName}
                        </span>
                      </td>

                      {/* Current Stock Number */}
                      <td className="p-4 font-black text-zinc-950 text-sm whitespace-nowrap">
                        {record.stock} units
                      </td>

                      {/* Automatic Stock Status Badge */}
                      <td className="p-4 whitespace-nowrap">
                        {status === 'In Stock' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            In Stock
                          </span>
                        )}
                        {status === 'Low Stock' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Low Stock ({record.stock} left)
                          </span>
                        )}
                        {status === 'Out of Stock' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Last Updated */}
                      <td className="p-4 text-zinc-500 font-medium text-xs whitespace-nowrap">
                        {record.updatedAt
                          ? new Date(record.updatedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </td>

                      {/* Action Button */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRecordForModal(record)}
                          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ml-auto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Manage Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Stock Modal */}
      {selectedRecordForModal && (
        <ManageStockModal
          stockRecord={selectedRecordForModal}
          onClose={() => setSelectedRecordForModal(null)}
          onStockUpdated={handleStockUpdated}
        />
      )}
    </AdminLayout>
  );
};
