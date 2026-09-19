import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { OfferProductService } from '../../services/offerProducts';
import { useStore } from '../../context/StoreContext';
import type { OfferProduct } from '../../types/offerProduct';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Store as StoreIcon,
  Gift,
  CheckCircle2,
  X,
  PackageCheck,
  Upload,
} from 'lucide-react';

export const AdminOfferProducts: React.FC = () => {
  const { stores } = useStore();
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfferProduct | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [storeId, setStoreId] = useState('ALL');
  const [stock, setStock] = useState(100);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadImageToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Could not upload image file. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const loadOfferProducts = async () => {
    try {
      setLoading(true);
      const data = await OfferProductService.getOfferProducts();
      setOfferProducts(data);
    } catch (err) {
      console.error('Failed to load offer products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfferProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop');
    setStoreId('ALL');
    setStock(100);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: OfferProduct) => {
    setEditingItem(item);
    setName(item.name);
    setImage(item.image);
    setStoreId(item.storeId || 'ALL');
    setStock(item.stock ?? 100);
    setStatus(item.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setToastMsg('Please enter a product name');
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await OfferProductService.updateOfferProduct(editingItem.id, {
          name: name.trim(),
          image: image.trim(),
          storeId,
          stock,
          status,
        });
        setToastMsg(`Updated "${name}"`);
      } else {
        await OfferProductService.addOfferProduct({
          name: name.trim(),
          image: image.trim(),
          storeId,
          stock,
          status,
        });
        setToastMsg(`Added new offer product "${name}"`);
      }

      setIsModalOpen(false);
      await loadOfferProducts();
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to save offer product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: OfferProduct) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    await OfferProductService.updateOfferProduct(item.id, { status: newStatus });
    await loadOfferProducts();
    setToastMsg(`Status updated for "${item.name}"`);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}" from Offer Products?`)) {
      await OfferProductService.deleteOfferProduct(id);
      await loadOfferProducts();
      setToastMsg(`Deleted "${itemTitle}"`);
    }
  };

  // Filtered List
  const filteredItems = offerProducts.filter((item) => {
    const matchSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (selectedStoreFilter !== 'ALL' && item.storeId !== 'ALL' && item.storeId !== selectedStoreFilter) {
      return false;
    }

    if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  return (
    <AdminLayout
      title="Offer Products"
      subtitle="Manage products that can be offered free with selected products."
      action={
        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenAddModal}
          className="bg-[#E50914] text-white hover:bg-red-700 font-bold"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Offer Product
        </Button>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

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
                placeholder="Search offer product name..."
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
                <option value="ALL">All Showrooms</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-zinc-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#E50914]" />
            <h2 className="font-extrabold text-sm sm:text-base text-zinc-900">
              Reusable Free Offer Products ({filteredItems.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            Selectable as free items when enabling offers on iPhones & products
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-zinc-50 text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-200">
                <tr>
                  <th className="p-3 sm:p-4">Offer Product Details</th>
                  <th className="p-3 sm:p-4">Showroom / Store</th>
                  <th className="p-3 sm:p-4">Promotional Stock</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      Loading offer products...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                      No offer products added yet. Click "+ Add Offer Product" to create reusable free promotional items!
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const assignedStore = stores.find((s) => s.id === item.storeId);
                    return (
                      <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                        {/* Name & Thumbnail */}
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || '/images/placeholder-iphone.svg'}
                              alt={item.name}
                              className="w-10 h-10 object-contain rounded-xl bg-zinc-100 p-1 border border-zinc-200 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-zinc-900 text-xs sm:text-sm">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Store */}
                        <td className="p-3 sm:p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200 whitespace-nowrap">
                            <StoreIcon className="w-3 h-3 text-[#E50914]" />
                            {item.storeId === 'ALL' ? 'All Stores' : assignedStore?.name || item.storeId}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="p-3 sm:p-4 font-bold text-zinc-800">
                          <div className="flex items-center gap-1.5">
                            <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{item.stock ?? 100} units</span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3 sm:p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap ${
                              item.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
                            }`}
                          >
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3 sm:p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition-colors border border-zinc-200"
                              title="Edit item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-lg transition-colors border border-zinc-200"
                              title="Delete item"
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
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-extrabold text-base text-zinc-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#E50914]" />
                <span>{editingItem ? 'Edit Offer Product' : 'Add Offer Product'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple Silicone Case, 20W USB-C Charger"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-800">Promotional Item Image</label>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-zinc-200 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>{uploadingImage ? 'Uploading Image...' : 'Choose File from Device'}</span>
                    <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">Or paste image URL below</span>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />

                {image && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 p-1">
                      <img src={image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <span>✓ Item image attached</span>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="ml-2 text-rose-600 hover:underline text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Store & Stock & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Showroom Store</label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                  >
                    <option value="ALL">All Stores</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Promotional Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={submitting}
                  className="bg-[#E50914] text-white hover:bg-red-700 font-bold"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Save Offer Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
