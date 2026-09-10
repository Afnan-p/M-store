import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Package, CheckCircle2, XCircle, Plus, Smartphone, RefreshCw, ArrowRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, loading } = useProducts();

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const soldProducts = totalProducts - availableProducts;
  const newIphones = products.filter((p) => p.category === 'iphone-new').length;
  const usedIphones = products.filter((p) => p.category === 'iphone-used').length;

  return (
    <AdminLayout
      title="Inventory Overview"
      subtitle="Track stock status, pre-owned devices, and new iPhone arrivals."
      action={
        <Link to="/admin/products/new">
          <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add New Product
          </Button>
        </Link>
      }
    >
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Devices"
          value={totalProducts}
          subtitle="All items listed"
          icon={<Package className="w-5 h-5 text-zinc-900" />}
        />
        <StatsCard
          title="Available Stock"
          value={availableProducts}
          subtitle="Ready for sale"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          accentColor="border-emerald-500/30"
        />
        <StatsCard
          title="Sold Items"
          value={soldProducts}
          subtitle="Completed sales"
          icon={<XCircle className="w-5 h-5 text-zinc-400" />}
        />
        <StatsCard
          title="Pre-Owned Stock"
          value={usedIphones}
          subtitle="Quality verified"
          icon={<RefreshCw className="w-5 h-5 text-[#E50914]" />}
        />
        <StatsCard
          title="Brand New Units"
          value={newIphones}
          subtitle="Sealed pack"
          icon={<Smartphone className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Recent Inventory Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900">Recent Inventory Items</h3>
          <Link to="/admin/products" className="text-xs text-[#E50914] font-semibold hover:underline flex items-center gap-1">
            <span>View All Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-3">Device</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Condition / Battery</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Loading recent items...
                  </td>
                </tr>
              ) : (
                products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-semibold text-zinc-900 flex items-center gap-3">
                      <img
                        src={product.images[0] || '/images/placeholder-iphone.svg'}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                        }}
                        className="w-8 h-8 object-contain rounded bg-zinc-100 p-1 border border-zinc-200"
                      />
                      <div>
                        <div>{product.name}</div>
                        <div className="text-[10px] text-zinc-500">{product.storage}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {product.category === 'iphone-used' && <Badge variant="used">Pre-Owned</Badge>}
                      {product.category === 'iphone-new' && <Badge variant="new">New</Badge>}
                      {product.category === 'accessory' && <Badge variant="accessory">Accessory</Badge>}
                    </td>
                    <td className="p-3 font-bold text-zinc-900">{formatCurrency(product.price)}</td>
                    <td className="p-3">
                      {product.batteryHealth ? `${product.batteryHealth}% Battery` : product.condition}
                    </td>
                    <td className="p-3">
                      {product.available ? (
                        <span className="text-emerald-600 font-semibold">Available</span>
                      ) : (
                        <span className="text-zinc-400 line-through">Sold</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
