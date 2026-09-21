import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { useProducts } from '../../hooks/useProducts';
import { useStore } from '../../context/StoreContext';
import { StockService } from '../../services/stock';
import type { ProductStock } from '../../types/stock';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import {
  Package,
  CheckCircle2,
  XCircle,
  Plus,
  Smartphone,
  RefreshCw,
  ArrowRight,
  Headphones,
  Store as StoreIcon,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  useProducts();
  const { stores } = useStore();
  const [stockRecords, setStockRecords] = useState<ProductStock[]>([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string>('');

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

  const loadStockData = async () => {
    try {
      setStockLoading(true);
      const list = await StockService.getStockList();
      setStockRecords(list);
    } catch (err) {
      console.error('Failed loading stock records in dashboard:', err);
    } finally {
      setStockLoading(false);
    }
  };

  const loading = stockLoading;

  // Filter stock records by selected showroom store scope
  const activeStockRecords =
    selectedStore === 'ALL'
      ? stockRecords
      : stockRecords.filter((s) => s.storeId === selectedStore);

  // Compute metrics based on selected store scope
  const totalProducts = activeStockRecords.length;
  const availableProducts = activeStockRecords.filter((s) => s.stock > 0).length;
  const soldProducts = activeStockRecords.filter((s) => s.stock === 0).length;

  const newIphones = activeStockRecords.filter(
    (s) => s.productCategory === 'iphone-new' && s.stock > 0
  ).length;
  const usedIphones = activeStockRecords.filter(
    (s) => s.productCategory === 'iphone-used' && s.stock > 0
  ).length;
  const accessoriesCount = activeStockRecords.filter(
    (s) => s.productCategory === 'accessory' && s.stock > 0
  ).length;

  const activeStoreName =
    selectedStore === 'ALL'
      ? 'All 4 Showrooms (Grand Total)'
      : stores.find((s) => s.id === selectedStore)?.name || 'Selected Showroom';

  return (
    <AdminLayout
      title="Inventory & Store Operations"
      subtitle="Real-time stock metrics, showroom inventory breakdown, pre-owned & new iPhone arrivals, and accessories."
      action={
        <div className="flex items-center gap-2">
          <Link to="/mstore-management-portal/products/new?type=iphone">
            <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add iPhone
            </Button>
          </Link>
          <Link to="/mstore-management-portal/products/new?type=accessory">
            <Button
              size="sm"
              variant="secondary"
              className="bg-zinc-900 text-white hover:bg-black"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Accessory
            </Button>
          </Link>
        </div>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Showroom Store Selector Bar */}
      <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StoreIcon className="w-5 h-5 text-[#E50914]" />
            <h3 className="text-sm font-bold text-zinc-900">Showroom Inventory Scope</h3>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full font-semibold">
              {activeStoreName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {/* Grand Total All Showrooms Button */}
            <button
              onClick={() => setSelectedStore('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedStore === 'ALL'
                  ? 'bg-zinc-900 text-white shadow-sm ring-2 ring-zinc-950/20'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span>All Showrooms</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedStore === 'ALL' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
                }`}
              >
                {stockRecords.length}
              </span>
            </button>

            {/* Individual Store Scope Buttons */}
            {stores.map((s) => {
              const storeRecordCount = stockRecords.filter((sr) => sr.storeId === s.id).length;
              const isSelected = selectedStore === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStore(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#E50914] text-white shadow-sm ring-2 ring-[#E50914]/20'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{s.name.replace('Store ', 'S')}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {storeRecordCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards Grid - 6 Dynamic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          title="Total Listed"
          value={totalProducts}
          subtitle={selectedStore === 'ALL' ? 'Grand total across 4 showrooms' : 'Items in this showroom'}
          icon={<Package className="w-4 h-4 text-zinc-900" />}
        />
        <StatsCard
          title="Available Stock"
          value={availableProducts}
          subtitle="Ready for sale"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          accentColor="border-emerald-500/30"
        />
        <StatsCard
          title="Brand New Units"
          value={newIphones}
          subtitle="In stock sealed iPhones"
          icon={<Smartphone className="w-4 h-4 text-blue-600" />}
        />
        <StatsCard
          title="Pre-Owned Stock"
          value={usedIphones}
          subtitle="In stock verified used"
          icon={<RefreshCw className="w-4 h-4 text-[#E50914]" />}
        />
        <StatsCard
          title="Accessories"
          value={accessoriesCount}
          subtitle="In stock chargers, audio, cases"
          icon={<Headphones className="w-4 h-4 text-purple-600" />}
        />
        <StatsCard
          title="Out of Stock"
          value={soldProducts}
          subtitle="0 stock items"
          icon={<XCircle className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Store Inventory Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <h3 className="text-sm font-bold text-zinc-900">Physical Store Inventory Status</h3>
          </div>
          <Link to="/mstore-management-portal/stock" className="text-xs text-[#E50914] font-semibold hover:underline">
            Manage Products Stock →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((s) => {
            const storeRecords = stockRecords.filter((sr) => sr.storeId === s.id);
            const inStockStoreRecords = storeRecords.filter((sr) => sr.stock > 0);
            
            const storeNew = inStockStoreRecords.filter((sr) => sr.productCategory === 'iphone-new').length;
            const storeUsed = inStockStoreRecords.filter((sr) => sr.productCategory === 'iphone-used').length;
            const storeAcc = inStockStoreRecords.filter((sr) => sr.productCategory === 'accessory').length;
            const isSelected = selectedStore === s.id;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedStore(s.id)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-[#E50914] ring-2 ring-[#E50914]/20 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                      {s.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{s.location}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200 whitespace-nowrap">
                    {inStockStoreRecords.length} / {storeRecords.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-zinc-50 p-2 rounded-xl text-center border border-zinc-100">
                  <div>
                    <div className="text-xs font-bold text-blue-600">{storeNew}</div>
                    <div className="text-[9px] text-zinc-500 font-medium">New</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#E50914]">{storeUsed}</div>
                    <div className="text-[9px] text-zinc-500 font-medium">Pre-Owned</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-600">{storeAcc}</div>
                    <div className="text-[9px] text-zinc-500 font-medium">Accessories</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent / Filtered Inventory Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Inventory Breakdown ({activeStockRecords.length})
            </h3>
            <p className="text-xs text-zinc-500">
              Showing stock records for <strong className="text-zinc-800">{activeStoreName}</strong>
            </p>
          </div>
          <Link
            to="/mstore-management-portal/stock"
            className="text-xs text-[#E50914] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View Full Stock Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-3">Device / Item</th>
                <th className="p-3">Showroom Store</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Loading inventory data...
                  </td>
                </tr>
              ) : activeStockRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No stock records found for {activeStoreName}.
                  </td>
                </tr>
              ) : (
                activeStockRecords.slice(0, 12).map((record) => {
                  const assignedStore = stores.find((s) => s.id === record.storeId);
                  const storeName = assignedStore?.name || record.storeId;

                  return (
                    <tr key={record.id} className="hover:bg-zinc-50">
                      <td className="p-3 font-semibold text-zinc-900 flex items-center gap-3">
                        <img
                          src={record.productImage || '/images/placeholder-iphone.svg'}
                          alt={record.productName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                          }}
                          className="w-9 h-9 object-contain rounded-lg bg-zinc-100 p-1 border border-zinc-200"
                        />
                        <div>
                          <div className="font-bold text-zinc-900">{record.productName || record.productId}</div>
                          <div className="text-[10px] text-zinc-500">
                            {record.productCategory === 'accessory'
                              ? 'Accessory'
                              : `${record.productStorage || '128GB'} • ${
                                  record.productCategory === 'iphone-new' ? 'Brand New' : 'Pre-Owned'
                                }`}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          <StoreIcon className="w-3 h-3 text-[#E50914]" />
                          {storeName}
                        </span>
                      </td>
                      <td className="p-3">
                        {record.productCategory === 'iphone-used' && <Badge variant="used">Pre-Owned</Badge>}
                        {record.productCategory === 'iphone-new' && <Badge variant="new">Brand New</Badge>}
                        {record.productCategory === 'accessory' && <Badge variant="accessory">Accessory</Badge>}
                      </td>
                      <td className="p-3 font-bold text-zinc-900">{formatCurrency(record.productPrice || 0)}</td>
                      <td className="p-3 font-black text-zinc-900">{record.stock} units</td>
                      <td className="p-3">
                        {record.stock > 5 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            In Stock
                          </span>
                        )}
                        {record.stock >= 1 && record.stock <= 5 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock ({record.stock} left)
                          </span>
                        )}
                        {record.stock === 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Out of Stock
                          </span>
                        )}
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


