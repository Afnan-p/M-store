import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StoreService } from '../../services/stores';
import type { Store } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Plus, Edit, Trash2, Store as StoreIcon, MapPin, Phone, X, Save, Upload } from 'lucide-react';

export const AdminStores: React.FC = () => {
  const { refreshStores } = useStore();
  const [stores, setStoresList] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [maps, setMaps] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    const data = await StoreService.getStores();
    setStoresList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const openNewStoreModal = () => {
    setEditingStore(null);
    setName('');
    setCode(`STORE-0${stores.length + 1}`);
    setLocation('');
    setPhone('');
    setImage('');
    setMaps('');
    setStatus('active');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditStoreModal = (store: Store) => {
    setEditingStore(store);
    setName(store.name);
    setCode(store.code);
    setLocation(store.location);
    setPhone(store.phone || '');
    setImage(store.image || '');
    setMaps(store.maps || '');
    setStatus(store.status);
    setDescription(store.description || '');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (store: Store) => {
    const nextStatus = store.status === 'active' ? 'inactive' : 'active';
    await StoreService.updateStore(store.id, { status: nextStatus });
    await fetchStores();
    await refreshStores();
    setToastMsg(`Store "${store.name}" status updated to ${nextStatus}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      alert('Please fill in store name and location');
      return;
    }

    if (editingStore) {
      await StoreService.updateStore(editingStore.id, {
        name,
        code,
        location,
        phone,
        image,
        maps,
        status,
        description,
      });
      setToastMsg(`Updated store "${name}"`);
    } else {
      await StoreService.addStore({
        name,
        code,
        location,
        phone,
        image,
        maps,
        status,
        description,
      });
      setToastMsg(`Created new store "${name}"`);
    }

    setIsModalOpen(false);
    await fetchStores();
    await refreshStores();
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadImageToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Could not upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDeleteStore = async () => {
    if (!storeToDelete) return;
    try {
      setIsDeleting(true);
      await StoreService.deleteStore(storeToDelete.id);
      await fetchStores();
      await refreshStores();
      setToastMsg(`Deleted store "${storeToDelete.name}"`);
    } catch (err) {
      console.error('Failed to delete store:', err);
      alert('Could not delete store. Please try again.');
    } finally {
      setIsDeleting(false);
      setStoreToDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Physical Store Management"
      subtitle="Manage showroom branches, addresses, active status, store images, and configurations."
      action={
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openNewStoreModal}>
          Add New Store
        </Button>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Delete Confirmation Modal */}
      {storeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Delete Showroom Branch?</h3>
                <p className="text-xs text-zinc-500 font-medium">This will permanently remove the store location.</p>
              </div>
            </div>

            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-zinc-900 text-sm">{storeToDelete.name}</div>
              <div className="text-zinc-500 font-medium">
                Location: <span className="text-zinc-800 font-semibold">{storeToDelete.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStoreToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStore}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Store'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stores List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-semibold">
            Loading stores list...
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-semibold">
            No stores configured. Click "Add New Store" to create one.
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 shrink-0 bg-zinc-100 flex items-center justify-center">
                    {store.image ? (
                      <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      <StoreIcon className="w-6 h-6 text-[#E50914]" />
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleStatus(store)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-colors ${
                      store.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {store.status === 'active' ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-950 text-base">{store.name}</h3>
                  <span className="text-[10px] font-bold text-zinc-400 block tracking-wider uppercase">{store.code}</span>
                </div>

                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                    <span>{store.location}</span>
                  </div>

                  {store.phone && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>

                {store.description && (
                  <p className="text-[11px] text-zinc-500 line-clamp-2 border-t border-zinc-100 pt-3">
                    {store.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400">ID: {store.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditStoreModal(store)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200"
                    title="Edit store details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setStoreToDelete(store)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center transition-colors border border-rose-200/80"
                    title="Delete store location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold text-zinc-900 text-base">
                {editingStore ? `Edit Store: ${editingStore.name}` : 'Add New Showroom Store'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Store 5 - Calicut"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Store Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. STORE-05"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-zinc-800 block">Showroom Image *</label>
                
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
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />

                {image && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      <img src={image} alt="Showroom Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <span>✓ Image set cleanly</span>
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

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Address / Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Road, Near Bus Stand"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Google Maps Link (URL)</label>
                <input
                  type="text"
                  value={maps}
                  onChange={(e) => setMaps(e.target.value)}
                  placeholder="e.g. https://maps.google.com/?q=Kootanad+Kerala"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Phone Contact</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Store Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="active">Active (Visible to Customers)</option>
                    <option value="inactive">Disabled (Hidden from Customer UI)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Store Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this showroom..."
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                  {editingStore ? 'Save Changes' : 'Create Store'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
