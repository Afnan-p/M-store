import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { CategoryService } from '../../services/categories';
import type { CategoryItem } from '../../types/category';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Plus, Edit, Trash2, FolderTree, X, Save, Upload, ExternalLink } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<string>('custom');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await CategoryService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImage('');
    setLink('');
    setType('custom');
    setDescription('');
    setStatus('active');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setImage(category.image || '');
    setLink(category.link || '');
    setType(category.type || 'custom');
    setDescription(category.description || '');
    setStatus(category.status);
    setDisplayOrder(category.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!link || link.startsWith('/products?category=')) {
        setLink(`/products?category=${generatedSlug}`);
      }
    }
  };

  const handleToggleStatus = async (category: CategoryItem) => {
    const nextStatus = category.status === 'active' ? 'inactive' : 'active';
    await CategoryService.updateCategory(category.id, { status: nextStatus });
    await fetchCategories();
    setToastMsg(`Category "${category.name}" status updated to ${nextStatus}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter category name');
      return;
    }

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalLink = link.trim() || `/products?category=${finalSlug}`;
    const finalImage = image.trim() || '/images/placeholder-iphone.svg';

    if (editingCategory) {
      await CategoryService.updateCategory(editingCategory.id, {
        name: name.trim(),
        slug: finalSlug,
        image: finalImage,
        link: finalLink,
        type,
        description,
        status,
        displayOrder: Number(displayOrder),
      });
      setToastMsg(`Updated category "${name}"`);
    } else {
      await CategoryService.addCategory({
        name: name.trim(),
        slug: finalSlug,
        image: finalImage,
        link: finalLink,
        type,
        description,
        status,
        displayOrder: Number(displayOrder),
      });
      setToastMsg(`Created new category "${name}"`);
    }

    setIsModalOpen(false);
    await fetchCategories();
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
      alert('Could not upload category image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await CategoryService.deleteCategory(categoryToDelete.id);
      await fetchCategories();
      setToastMsg(`Deleted category "${categoryToDelete.name}"`);
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Could not delete category. Please try again.');
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Shop Category Management"
      subtitle="Standard M-Store shop categories, navigation links, icons, and product filters."
      action={
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>5 Standard Categories Locked</span>
        </div>
      }
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Delete Shop Category?</h3>
                <p className="text-xs text-zinc-500 font-medium">This will remove this category from the homepage.</p>
              </div>
            </div>

            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-zinc-900 text-sm">{categoryToDelete.name}</div>
              <div className="text-zinc-500 font-medium">
                Slug: <span className="text-zinc-800 font-semibold">{categoryToDelete.slug}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-semibold">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-semibold">
            No categories created yet. Click "Add New Category" above.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={cat.image || '/images/placeholder-iphone.svg'}
                      alt={cat.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-colors ${
                      cat.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {cat.status === 'active' ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-950 text-base">{cat.name}</h3>
                  <span className="text-[10px] font-bold text-zinc-400 block tracking-wider uppercase">
                    SLUG: {cat.slug}
                  </span>
                </div>

                {cat.description && (
                  <p className="text-[11px] text-zinc-500 line-clamp-2 border-t border-zinc-100 pt-2">
                    {cat.description}
                  </p>
                )}

                <div className="text-[11px] text-zinc-600 space-y-1 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-500">Route Link:</span>
                    <a
                      href={cat.link || `/products?category=${cat.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E50914] hover:underline font-bold flex items-center gap-1 text-[10px] truncate max-w-[140px]"
                    >
                      <span className="truncate">{cat.link || `/products?category=${cat.slug}`}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400">Order: #{cat.displayOrder || 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditCategoryModal(cat)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center transition-colors border border-rose-200/80"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold text-zinc-900 text-base">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Shop Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-900 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Apple Watch, MacBooks, Audio"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Filter Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. apple-watch, macbooks"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-zinc-800 block">Category Thumbnail Image *</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-zinc-200 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose File from Device'}</span>
                    <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">Or paste image URL below</span>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://... or /images/cat-iphones.png"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />

                {image && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0 p-1 flex items-center justify-center">
                      <img src={image} alt="Category Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <span>✓ Image set</span>
                      <button type="button" onClick={() => setImage('')} className="ml-2 text-rose-600 hover:underline text-[10px]">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Navigation Link Route</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g. /products?category=apple-watch"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Category Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                >
                  <option value="active">Active (Visible on Homepage)</option>
                  <option value="inactive">Disabled (Hidden from Customer UI)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of this category..."
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
