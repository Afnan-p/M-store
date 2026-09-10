import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useProducts } from '../../hooks/useProducts';
import { ProductService } from '../../services/products';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { Plus, Edit, Trash2, Search, Layers } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase()) ||
      p.storage.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleSold = async (id: string) => {
    await ProductService.toggleProductAvailability(id);
    await refreshProducts();
    setToastMsg('Product availability updated');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await ProductService.deleteProduct(id);
      await refreshProducts();
      setToastMsg(`Deleted ${name}`);
    }
  };

  return (
    <AdminLayout
      title="Product Inventory Management"
      subtitle="Manage device listings, price tags, pre-owned condition notes, and availability status."
      action={
        <div className="flex items-center gap-3">
          <Link to="/admin/segments">
            <Button size="sm" variant="secondary" icon={<Layers className="w-4 h-4" />}>
              iPhone Segments
            </Button>
          </Link>
          <Link to="/admin/products/new">
            <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add New Device
            </Button>
          </Link>
        </div>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter stock by model or storage..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914]"
          />
        </div>

        <span className="text-xs text-zinc-500 font-semibold">
          Total listed: <strong className="text-zinc-900">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Condition / Battery</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No products found matching "{search}"
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
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
                      <div className="text-[11px] text-zinc-500">{product.storage} • {product.color || 'N/A'}</div>
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
                        product.condition
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
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-lg transition-colors border border-rose-200"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
