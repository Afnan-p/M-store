import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, CategoryType, ConditionType } from '../../types/product';
import { useSegments } from '../../hooks/useSegments';
import { Button } from '../common/Button';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Upload, X, Check } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  buttonText: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  buttonText,
}) => {
  const navigate = useNavigate();
  const { segments } = useSegments();

  const [name, setName] = useState(initialData?.name || '');
  const [model, setModel] = useState(initialData?.model || 'iPhone 15 Pro');
  const [segmentId, setSegmentId] = useState(initialData?.segmentId || '');
  const [segmentSlug, setSegmentSlug] = useState(initialData?.segmentSlug || '');
  const [category, setCategory] = useState<CategoryType>(initialData?.category || 'iphone-used');
  const [price, setPrice] = useState<number | string>(initialData?.price || '');
  const [originalPrice, setOriginalPrice] = useState<number | string>(initialData?.originalPrice || '');
  const [storage, setStorage] = useState(initialData?.storage || '128GB');
  const [condition, setCondition] = useState<ConditionType>(initialData?.condition || 'Excellent');
  const [batteryHealth, setBatteryHealth] = useState<number | string>(initialData?.batteryHealth || 92);
  const [replacementStatus, setReplacementStatus] = useState(initialData?.replacementStatus || 'No Replacement');
  const [color, setColor] = useState(initialData?.color || 'Natural Titanium');
  const [warranty, setWarranty] = useState(initialData?.warranty || 'M Store 3 Month Warranty');
  const [description, setDescription] = useState(initialData?.description || '');
  const [available, setAvailable] = useState<boolean>(initialData?.available ?? true);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? false);

  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    ]
  );
  const [imageInput, setImageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      setImages((prev) => [...prev, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const url = await uploadImageToCloudinary(file);
      setImages((prev) => [...prev, url]);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Please enter product name and price');
      return;
    }

    // Auto find matching segment if not explicit
    const foundSeg = segments.find((s) => s.name === model || s.id === segmentId);
    const finalSegmentId = foundSeg?.id || segmentId;
    const finalSegmentSlug = foundSeg?.slug || segmentSlug;

    setSubmitting(true);
    try {
      await onSubmit({
        name,
        model,
        segmentId: finalSegmentId,
        segmentSlug: finalSegmentSlug,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        storage,
        condition,
        batteryHealth: category === 'iphone-used' && batteryHealth ? Number(batteryHealth) : undefined,
        replacementStatus: category === 'iphone-used' ? replacementStatus : undefined,
        color,
        warranty,
        description,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'],
        available,
        featured,
      });
      navigate('/admin/products');
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-zinc-900">
      {/* Product Details Grid */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-200 pb-3">
          Device Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 15 Pro 256GB Natural Titanium"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Apple Model Series</label>
            <select
              value={model}
              onChange={(e) => {
                const val = e.target.value;
                setModel(val);
                const found = segments.find((s) => s.name === val);
                if (found) {
                  setSegmentId(found.id);
                  setSegmentSlug(found.slug);
                }
              }}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            >
              {segments.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Accessory">Accessory / Original Charger</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            >
              <option value="iphone-used">Pre-Owned iPhone (Quality Checked)</option>
              <option value="iphone-new">Brand New iPhone (Sealed Pack)</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          {/* Storage */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Storage Capacity</label>
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            >
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
              <option value="N/A">N/A (Accessories)</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Selling Price (₹ INR) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 56900"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Original Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Original / MRP Price (₹ INR)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 134900"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Pre-owned specific fields */}
          {category === 'iphone-used' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Cosmetic Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ConditionType)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                >
                  <option value="Brand New">Brand New (Sealed Pack)</option>
                  <option value="Like New">Like New (Mint)</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-600">Battery Health (% Health)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="e.g. 96"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Replacement History / Diagnostic Note</label>
                <input
                  type="text"
                  value={replacementStatus}
                  onChange={(e) => setReplacementStatus(e.target.value)}
                  placeholder="e.g. No Replacement, Original Screen"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </>
          )}

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Color Finish</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Natural Titanium, Deep Purple"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Warranty */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Warranty Coverage</label>
            <input
              type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="e.g. Apple Care till Oct 2026"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700">Device Description & Store Notes</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description about device condition, included box accessories, warranty period..."
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
          />
        </div>

        {/* Status Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-50 border-zinc-300 text-[#E50914] focus:ring-0"
            />
            <span>In Stock (Available for Sale)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-50 border-zinc-300 text-[#E50914] focus:ring-0"
            />
            <span>Highlight on Homepage (Featured)</span>
          </label>
        </div>
      </div>

      {/* Image Uploader */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-200 pb-3">
          Device Images
        </h3>

        <div className="space-y-3">
          {/* File Upload / Cloudinary Ready */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-zinc-200">
              <Upload className="w-4 h-4" />
              <span>Choose Image File (Cloudinary Ready)</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-xs text-zinc-500">or add image URL below:</span>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
            <Button type="button" variant="secondary" onClick={handleAddImageUrl}>
              Add Image
            </Button>
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden p-1 group">
              <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Action */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting} icon={<Check className="w-4 h-4" />}>
          {submitting ? 'Saving Device...' : buttonText}
        </Button>
      </div>
    </form>
  );
};
