import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, CategoryType, ConditionType } from '../../types/product';
import type { OfferProduct, OfferItem } from '../../types/offerProduct';
import { OfferProductService } from '../../services/offerProducts';
import { StockService } from '../../services/stock';
import { ProductService } from '../../services/products';
import { useSegments } from '../../hooks/useSegments';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Upload, X, Gift, Trash2 } from 'lucide-react';

const POPULAR_COLORS = [
  'Natural Titanium',
  'Desert Titanium',
  'Black Titanium',
  'White Titanium',
  'Deep Purple',
  'Space Black',
  'Gold',
  'Silver',
  'Space Gray',
  'Midnight',
  'Starlight',
  'Blue',
  'Pink',
  'Yellow',
  'Green',
  'Red (PRODUCT)RED',
  'Teal',
  'Ultramarine',
  'White / Standard',
  'Black / Standard',
];

interface ProductFormProps {
  initialData?: Product;
  defaultCategory?: CategoryType;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'> & { initialStock?: number }) => Promise<void>;
  buttonText: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  defaultCategory,
  onSubmit,
  buttonText,
}) => {
  const navigate = useNavigate();
  const { segments } = useSegments();
  const { stores } = useStore();

  const isAccessoryForm = defaultCategory === 'accessory' || initialData?.category === 'accessory';

  const initialCat = isAccessoryForm ? 'accessory' : (initialData?.category || defaultCategory || 'iphone-used');
  const [name, setName] = useState(initialData?.name || '');
  const [model, setModel] = useState(initialData?.model || (isAccessoryForm ? 'Accessory' : 'iPhone 15 Pro'));
  const [storeId, setStoreId] = useState(initialData?.storeId || 'ALL');
  const [category, setCategory] = useState<CategoryType>(initialCat === 'accessory' && !isAccessoryForm ? 'iphone-used' : initialCat);
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || 'Chargers & Adapters');
  const [customSubCategory, setCustomSubCategory] = useState('');
  const [isCustomSubCat, setIsCustomSubCat] = useState(false);
  const [price, setPrice] = useState<number | string>(initialData?.price || '');
  const [originalPrice, setOriginalPrice] = useState<number | string>(initialData?.originalPrice || '');
  const [initialStock, setInitialStock] = useState<number | string>(10);
  const [storage, setStorage] = useState(initialData?.storage || (isAccessoryForm ? 'N/A' : '128GB'));
  const [condition, setCondition] = useState<ConditionType>(initialData?.condition || 'Excellent');
  const [batteryHealth, setBatteryHealth] = useState<number | string>(initialData?.batteryHealth || 92);
  const [color, setColor] = useState(initialData?.color || (isAccessoryForm ? 'White / Standard' : 'Natural Titanium'));
  const [description, setDescription] = useState(initialData?.description || '');
  const [available, setAvailable] = useState<boolean>(initialData?.available ?? true);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? false);

  const [segmentId, setSegmentId] = useState(initialData?.segmentId || '');
  const [segmentSlug, setSegmentSlug] = useState(initialData?.segmentSlug || '');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const replacementStatus = initialData?.replacementStatus || 'No Replacement';
  const warranty = initialData?.warranty || (isAccessoryForm ? 'M Store 6 Month Warranty' : 'M Store 3 Month Warranty');

  // Keep category in sync with mode
  useEffect(() => {
    if (isAccessoryForm) {
      setCategory('accessory');
    } else if (category === 'accessory') {
      setCategory('iphone-used');
    }
  }, [defaultCategory, isAccessoryForm]);

  // Fetch initial stock level if editing an existing product
  useEffect(() => {
    if (initialData?.id) {
      const targetStore = storeId === 'ALL' || storeId === 'all' ? 'store001' : storeId;
      StockService.getStockForProduct(initialData.id, targetStore).then((qty) => {
        setInitialStock(qty);
      });
    }
  }, [initialData, storeId]);

  // OFFERS STATE
  const [availableOfferProducts, setAvailableOfferProducts] = useState<OfferProduct[]>([]);
  const [offerEnabled, setOfferEnabled] = useState<boolean>(initialData?.offer?.enabled ?? false);
  const [offerTitle, setOfferTitle] = useState<string>(initialData?.offer?.title || '');
  const [offerDescription, setOfferDescription] = useState<string>(initialData?.offer?.description || '');
  const [offerStatus, setOfferStatus] = useState<'active' | 'disabled'>(initialData?.offer?.status || 'active');
  const [offerItems, setOfferItems] = useState<OfferItem[]>(initialData?.offer?.items || []);
  const [selectedOfferProdToAdd, setSelectedOfferProdToAdd] = useState<string>('');

  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    ]
  );
  const [imageInput, setImageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      setImages(initialData.images);
    }
  }, [initialData]);

  useEffect(() => {
    OfferProductService.getOfferProducts().then(setAvailableOfferProducts);
  }, []);

  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setImages((prev) => [...prev, uploadedUrl]);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  // Add Free Item to Offer
  const handleAddOfferItem = () => {
    if (!selectedOfferProdToAdd) return;
    const existingIndex = offerItems.findIndex((i) => i.offerProductId === selectedOfferProdToAdd);
    if (existingIndex > -1) {
      const updated = [...offerItems];
      updated[existingIndex].quantity += 1;
      setOfferItems(updated);
    } else {
      setOfferItems([...offerItems, { offerProductId: selectedOfferProdToAdd, quantity: 1 }]);
    }
    setSelectedOfferProdToAdd('');
  };

  const handleUpdateOfferItemQty = (prodId: string, newQty: number) => {
    if (newQty <= 0) {
      setOfferItems(offerItems.filter((i) => i.offerProductId !== prodId));
    } else {
      setOfferItems(
        offerItems.map((i) => (i.offerProductId === prodId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveOfferItem = (prodId: string) => {
    setOfferItems(offerItems.filter((i) => i.offerProductId !== prodId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    try {
      setSubmitting(true);
      const selectedSeg = segments.find((s) => s.id === segmentId);
      const finalSegmentId = selectedSeg ? selectedSeg.id : segmentId || undefined;
      const finalSegmentSlug = selectedSeg ? selectedSeg.slug : segmentSlug || undefined;
      const finalSubCategory = isCustomSubCat ? customSubCategory : subCategory;
      const finalCategory = isAccessoryForm ? 'accessory' : (category === 'accessory' ? 'iphone-used' : category);

      // Auto generate offer title if empty but items selected
      let autoOfferTitle = offerTitle.trim();
      if (offerEnabled && !autoOfferTitle && offerItems.length > 0) {
        const itemNames = offerItems
          .map((i) => {
            const op = availableOfferProducts.find((p) => p.id === i.offerProductId);
            return op ? op.name.replace(/Apple|Silicone|Case|Cover/gi, '').trim() : '';
          })
          .filter(Boolean);
        autoOfferTitle = `Free ${itemNames.join(' + ') || 'Gift Included'}`;
      }

      await onSubmit({
        name: name.trim(),
        model: isAccessoryForm ? 'Accessory' : model,
        segmentId: isAccessoryForm ? undefined : finalSegmentId,
        segmentSlug: isAccessoryForm ? undefined : finalSegmentSlug,
        subCategory: isAccessoryForm ? finalSubCategory : undefined,
        storeId,
        category: finalCategory,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : (null as any),
        initialStock: Number(initialStock),
        storage: isAccessoryForm ? 'N/A' : storage,
        condition: isAccessoryForm || finalCategory === 'iphone-new' ? 'Brand New' : condition,
        batteryHealth: !isAccessoryForm && finalCategory === 'iphone-used' && batteryHealth ? Number(batteryHealth) : undefined,
        replacementStatus: !isAccessoryForm && finalCategory === 'iphone-used' ? replacementStatus : undefined,
        color,
        warranty,
        description,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'],
        available,
        featured,
        isOffer: offerEnabled,
        offerBadge: offerEnabled ? (autoOfferTitle || 'SPECIAL OFFER') : '',
        offer: {
          enabled: offerEnabled,
          title: autoOfferTitle,
          description: offerDescription.trim(),
          status: offerStatus,
          items: offerEnabled ? offerItems : [],
        },
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
          {isAccessoryForm ? 'Accessory Details' : 'Device Information'}
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
              placeholder={isAccessoryForm ? "e.g. 20W USB-C Power Adapter, AirPods Pro 2" : "e.g. iPhone 15 Pro 256GB Natural Titanium"}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Showroom Store Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Showroom Store Branch *</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
            >
              <option value="ALL">All Stores (Available in All Branches)</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.location})
                </option>
              ))}
            </select>
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Product Category *</label>
            {isAccessoryForm ? (
              <input
                type="text"
                disabled
                value="Accessories"
                className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-not-allowed"
              />
            ) : (
              <select
                value={category === 'accessory' ? 'iphone-used' : category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
              >
                <option value="iphone-new">Brand New iPhone</option>
                <option value="iphone-used">Pre-Owned / Used iPhone</option>
              </select>
            )}
          </div>

          {/* Sub Category for Accessories */}
          {isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Accessory Sub-Category *</label>
              {!isCustomSubCat ? (
                <div className="flex gap-2">
                  <select
                    value={subCategory}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomSubCat(true);
                      } else {
                        setSubCategory(e.target.value);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="Apple Original Accessories">Apple Original Accessories</option>
                    <option value="General Accessories">General / Universal Accessories</option>
                    <option value="Chargers & Adapters">Chargers & Adapters</option>
                    <option value="Cases & Covers">Cases & Covers</option>
                    <option value="Speakers & Audio">Speakers & Audio</option>
                    <option value="Cables & Protection">Cables & Protection</option>
                    <option value="CUSTOM">+ Add Custom Sub-Category...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    placeholder="Enter custom sub-category..."
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomSubCat(false)}
                    className="px-3 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* iPhone Model Series Dropdown */}
          {!isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Apple Model Series (Segment) *</label>
              {!isCustomModel ? (
                <select
                  value={model}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomModel(true);
                      setModel('');
                    } else {
                      const selectedSeg = segments.find((s) => s.name === e.target.value);
                      setModel(e.target.value);
                      if (selectedSeg) {
                        setSegmentId(selectedSeg.id);
                        setSegmentSlug(selectedSeg.slug);
                      }
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                >
                  <option value="">Select Apple Model Series...</option>
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.name}>
                      {seg.name}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add / Type Custom Model...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. iPhone 16 Pro Max"
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomModel(false)}
                    className="px-3 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-300"
                  >
                    Select List
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Storage */}
          {!isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Storage Capacity *</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
              >
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
                <option value="64GB">64GB</option>
              </select>
            </div>
          )}

          {/* Selling Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Selling Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 89900"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Regular MRP */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Regular MRP (₹) Optional</label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 94900"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Initial Stock Quantity (Units) *</label>
            <input
              type="number"
              required
              min="0"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Condition */}
          {!isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Device Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionType)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
              >
                <option value="Brand New">Brand New (Sealed)</option>
                <option value="Like New">Like New (Mint Condition)</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
              </select>
            </div>
          )}

          {/* Color Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">{isAccessoryForm ? 'Color / Variant' : 'Color Variant *'}</label>
            {!isCustomColor ? (
              <select
                value={color}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setIsCustomColor(true);
                    setColor('');
                  } else {
                    setColor(e.target.value);
                  }
                }}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
              >
                <option value="">Select Color...</option>
                {Array.from(new Set([...POPULAR_COLORS, ...ProductService.getProductsSync().map((p) => p.color).filter(Boolean)])).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="CUSTOM">+ Type Custom Color...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Natural Titanium, Deep Purple"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomColor(false)}
                  className="px-3 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-300"
                >
                  Select List
                </button>
              </div>
            )}
          </div>

          {/* Battery Health for Used */}
          {!isAccessoryForm && category === 'iphone-used' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Battery Health %</label>
              <input
                type="number"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                placeholder="e.g. 96"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700">
            {isAccessoryForm ? 'Accessory Description & Notes' : 'Device Description & Store Notes'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isAccessoryForm ? "Product compatibility, box contents, warranty terms..." : "Detailed description about device condition, included box accessories..."}
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
          />
        </div>

        {/* Status Toggles */}
        <div className="space-y-4 pt-2 border-t border-zinc-200">
          <div className="flex flex-wrap items-center gap-6">
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
      </div>

      {/* OFFERS CONFIGURATION SECTION */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#E50914]" />
            <h3 className="text-base font-bold text-zinc-900">
              Free Product Offer Configuration
            </h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
            <input
              type="checkbox"
              checked={offerEnabled}
              onChange={(e) => setOfferEnabled(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-50 border-zinc-300 text-[#E50914] focus:ring-0"
            />
            <span className={offerEnabled ? 'text-[#E50914] font-black' : 'text-zinc-500'}>
              Enable Offer = {offerEnabled ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>

        {offerEnabled && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Offer Products Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-800">
                Select Free Offer Products from Catalog *
              </label>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOfferProdToAdd}
                  onChange={(e) => setSelectedOfferProdToAdd(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                >
                  <option value="">-- Choose an Offer Product to Add --</option>
                  {availableOfferProducts
                    .filter((item) => item.status === 'active')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        🎁 {item.name} (Stock: {item.stock ?? 100})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddOfferItem}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
                >
                  + Add Item
                </button>
              </div>

              {/* Selected Items List */}
              {offerItems.length === 0 ? (
                <div className="p-4 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl text-center text-xs text-zinc-500">
                  No free items selected yet. Choose an item above and click "+ Add Item".
                </div>
              ) : (
                <div className="space-y-2">
                  {offerItems.map((item, idx) => {
                    const offerProd = availableOfferProducts.find((p) => p.id === item.offerProductId);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={offerProd?.image || '/images/placeholder-iphone.svg'}
                            alt=""
                            className="w-9 h-9 object-contain rounded-lg bg-white p-1 border border-rose-200 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-xs text-zinc-900">
                              {offerProd?.name || item.offerProductId}
                            </div>
                            <div className="text-[10px] text-zinc-500">Free Promotional Accessory</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-white border border-rose-200 rounded-lg px-2 py-1">
                            <span className="text-[11px] font-bold text-zinc-500">Qty:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferItemQty(item.offerProductId, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black"
                            >
                              -
                            </button>
                            <span className="font-black text-xs text-[#E50914] px-1">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferItemQty(item.offerProductId, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveOfferItem(item.offerProductId)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Offer Title, Description & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Offer Title (Optional)</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="e.g. Free Apple Case + 20W Charger"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Offer Description (Optional)</label>
                <input
                  type="text"
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  placeholder="e.g. Get a free case & charger with this iPhone"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Offer Status</label>
                <select
                  value={offerStatus}
                  onChange={(e) => setOfferStatus(e.target.value as 'active' | 'disabled')}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Live Customer Preview */}
            {offerItems.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 via-amber-50/50 to-white border border-rose-200/90 rounded-2xl space-y-2.5 shadow-sm">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Live Customer Storefront Preview</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3 py-1 bg-[#E50914] text-white font-black text-xs rounded-full shadow-xs flex items-center gap-1">
                    🎁 {offerTitle.trim() || 'SPECIAL OFFER INCLUDED'}
                  </span>
                  {offerItems.map((item) => {
                    const prod = availableOfferProducts.find((p) => p.id === item.offerProductId);
                    return (
                      <span key={item.offerProductId} className="px-2.5 py-1 bg-white border border-rose-200/90 text-zinc-900 font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1">
                        <span className="text-emerald-600 font-black">✓</span> Free {prod?.name || 'Promotional Accessory'} × {item.quantity}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
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
            <span className="text-[11px] text-zinc-500 font-medium">Or paste image URL below</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2.5 bg-zinc-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-colors"
            >
              Add URL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 h-28">
                <img src={img} alt="" className="w-full h-full object-contain p-2" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="px-6 py-3 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          Cancel
        </button>
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={submitting}
          className="bg-[#E50914] text-white hover:bg-red-700 font-bold px-8 shadow-md"
        >
          {submitting ? 'Saving Product...' : buttonText}
        </Button>
      </div>
    </form>
  );
};
