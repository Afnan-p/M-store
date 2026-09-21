import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, CategoryType, ConditionType } from '../../types/product';
import type { OfferProduct, OfferItem } from '../../types/offerProduct';
import { OfferProductService } from '../../services/offerProducts';
import { StockService } from '../../services/stock';
import { ProductService } from '../../services/products';
import { useSegments } from '../../hooks/useSegments';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { CustomSelect } from '../common/CustomSelect';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Upload, X, Gift, Trash2, Check, Plus, ChevronDown, AlertCircle } from 'lucide-react';

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
  
  const initialStoreIds = initialData?.storeIds && initialData.storeIds.length > 0
    ? initialData.storeIds
    : [initialData?.storeId || 'ALL'];
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(initialStoreIds);

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

  const isAllStoresSelected = selectedStoreIds.includes('ALL') || selectedStoreIds.includes('all');

  const toggleStoreSelection = (targetStoreId: string) => {
    if (targetStoreId === 'ALL') {
      if (isAllStoresSelected) {
        setSelectedStoreIds([stores[0]?.id || 'store001']);
      } else {
        setSelectedStoreIds(['ALL']);
      }
      return;
    }

    let updated: string[];
    if (isAllStoresSelected) {
      updated = [targetStoreId];
    } else if (selectedStoreIds.includes(targetStoreId)) {
      updated = selectedStoreIds.filter((id) => id !== targetStoreId);
      if (updated.length === 0) updated = ['ALL'];
    } else {
      updated = [...selectedStoreIds.filter((id) => id !== 'ALL'), targetStoreId];
      if (updated.length >= stores.length) {
        updated = ['ALL'];
      }
    }
    setSelectedStoreIds(updated);
  };

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
      const primaryStore = selectedStoreIds[0] || 'store001';
      const targetStore = primaryStore === 'ALL' || primaryStore === 'all' ? 'store001' : primaryStore;
      StockService.getStockForProduct(initialData.id, targetStore).then((qty) => {
        setInitialStock(qty);
      });
    }
  }, [initialData, selectedStoreIds]);

  // OFFERS STATE
  const [availableOfferProducts, setAvailableOfferProducts] = useState<OfferProduct[]>([]);
  const [offerEnabled, setOfferEnabled] = useState<boolean>(initialData?.offer?.enabled ?? false);
  const [offerTitle, setOfferTitle] = useState<string>(initialData?.offer?.title || '');
  const [offerDescription, setOfferDescription] = useState<string>(initialData?.offer?.description || '');
  const [offerStatus, setOfferStatus] = useState<'active' | 'disabled'>(initialData?.offer?.status || 'active');
  const [offerItems, setOfferItems] = useState<OfferItem[]>(initialData?.offer?.items || []);
  const [selectedOfferProdToAdd, setSelectedOfferProdToAdd] = useState<string>('');
  const [isOfferPickerOpen, setIsOfferPickerOpen] = useState<boolean>(false);
  const [offerError, setOfferError] = useState<string>('');
  const offerPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (offerPickerRef.current && !offerPickerRef.current.contains(event.target as Node)) {
        setIsOfferPickerOpen(false);
      }
    };
    if (isOfferPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOfferPickerOpen]);

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

  const isDefaultUnsplashImage = (url: string) =>
    url.includes('images.unsplash.com/photo-1695048133142') || url.includes('placeholder');

  const handleAddImageUrl = () => {
    const trimmed = imageInput.trim();
    if (trimmed) {
      if (images.length === 1 && isDefaultUnsplashImage(images[0])) {
        setImages([trimmed]);
      } else {
        setImages((prev) => [...prev, trimmed]);
      }
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
        if (images.length === 1 && isDefaultUnsplashImage(images[0])) {
          setImages([uploadedUrl]);
        } else {
          setImages((prev) => [...prev, uploadedUrl]);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  // Add Free Item to Offer
  const handleAddOfferItem = () => {
    if (!selectedOfferProdToAdd) return;
    setOfferError('');
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
    setOfferError('');

    if (!name.trim() || !price) return;

    if (offerEnabled && offerItems.length === 0) {
      setOfferError('⚠️ Enable Offer is ON! You must choose at least one free offer product from the dropdown and click "+ Add Item" before publishing.');
      const offerElem = document.getElementById('free-offer-config-section');
      if (offerElem) {
        offerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

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

      const primaryStoreId = selectedStoreIds.includes('ALL') || selectedStoreIds.includes('all')
        ? 'ALL'
        : (selectedStoreIds[0] || 'ALL');

      await onSubmit({
        name: name.trim(),
        model: isAccessoryForm ? 'Accessory' : model,
        segmentId: isAccessoryForm ? undefined : finalSegmentId,
        segmentSlug: isAccessoryForm ? undefined : finalSegmentSlug,
        subCategory: isAccessoryForm ? finalSubCategory : undefined,
        storeId: primaryStoreId,
        storeIds: selectedStoreIds,
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
      navigate('/mstore-management-portal/products');
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
          <div className="space-y-2 col-span-1 md:col-span-2">
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

          {/* Showroom Store Multi-Selection Cards */}
          <div className="space-y-3 col-span-1 md:col-span-2 bg-zinc-50/90 p-3.5 sm:p-4 border border-zinc-200/90 rounded-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 flex-wrap">
                <span>Showroom Store Branch Availability *</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#E50914] font-semibold">
                  Multi-Store Selection
                </span>
              </label>
              <span className="text-[11px] text-zinc-500 font-medium">
                {isAllStoresSelected
                  ? 'Available in All Branches'
                  : `${selectedStoreIds.length} Store${selectedStoreIds.length > 1 ? 's' : ''} Ticked`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {/* Option 1: ALL STORES */}
              <button
                type="button"
                onClick={() => toggleStoreSelection('ALL')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  isAllStoresSelected
                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/70'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isAllStoresSelected ? 'bg-white border-white text-[#E50914]' : 'border-zinc-300 bg-white'
                  }`}
                >
                  {isAllStoresSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">All Stores</span>
              </button>

              {/* Option 2..N: Individual Showrooms */}
              {stores.map((s) => {
                const isChecked = isAllStoresSelected || selectedStoreIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStoreSelection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      isChecked
                        ? 'bg-red-50 text-[#E50914] border-red-300 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/70'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-[#E50914] border-[#E50914] text-white' : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="truncate">{s.name}</div>
                      <div className="text-[9.5px] text-zinc-500 font-normal truncate">{s.location}</div>
                    </div>
                  </button>
                );
              })}
            </div>
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
              <CustomSelect
                fullWidth
                value={category === 'accessory' ? 'iphone-used' : category}
                onChange={(val) => setCategory(val as CategoryType)}
                options={[
                  { value: 'iphone-new', label: 'Brand New iPhone' },
                  { value: 'iphone-used', label: 'Pre-Owned / Used iPhone' },
                ]}
                buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
              />
            )}
          </div>

          {/* Sub Category for Accessories */}
          {isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Accessory Sub-Category *</label>
              {!isCustomSubCat ? (
                <div className="flex gap-2 w-full">
                  <CustomSelect
                    fullWidth
                    value={subCategory}
                    onChange={(val) => {
                      if (val === 'CUSTOM') {
                        setIsCustomSubCat(true);
                      } else {
                        setSubCategory(val);
                      }
                    }}
                    options={[
                      { value: 'Apple Original Accessories', label: 'Apple Original Accessories' },
                      { value: 'General Accessories', label: 'General / Universal Accessories' },
                      { value: 'Chargers & Adapters', label: 'Chargers & Adapters' },
                      { value: 'Cases & Covers', label: 'Cases & Covers' },
                      { value: 'Speakers & Audio', label: 'Speakers & Audio' },
                      { value: 'Cables & Protection', label: 'Cables & Protection' },
                      { value: 'CUSTOM', label: '+ Add Custom Sub-Category...' },
                    ]}
                    buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
                  />
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
                <CustomSelect
                  fullWidth
                  value={model}
                  onChange={(val) => {
                    if (val === 'CUSTOM') {
                      setIsCustomModel(true);
                      setModel('');
                    } else {
                      const selectedSeg = segments.find((s) => s.name === val);
                      setModel(val);
                      if (selectedSeg) {
                        setSegmentId(selectedSeg.id);
                        setSegmentSlug(selectedSeg.slug);
                      }
                    }
                  }}
                  options={[
                    { value: '', label: 'Select Apple Model Series...' },
                    ...segments.map((seg) => ({ value: seg.name, label: seg.name })),
                    { value: 'CUSTOM', label: '+ Add / Type Custom Model...' },
                  ]}
                  buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
                />
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
              <CustomSelect
                fullWidth
                value={storage}
                onChange={(val) => setStorage(val)}
                options={[
                  { value: '128GB', label: '128GB' },
                  { value: '256GB', label: '256GB' },
                  { value: '512GB', label: '512GB' },
                  { value: '1TB', label: '1TB' },
                  { value: '2TB', label: '2TB' },
                  { value: '64GB', label: '64GB' },
                ]}
                buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
              />
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
              <CustomSelect
                fullWidth
                value={condition}
                onChange={(val) => setCondition(val as ConditionType)}
                options={[
                  { value: 'Brand New', label: 'Brand New (Sealed)' },
                  { value: 'Like New', label: 'Like New (Mint Condition)' },
                  { value: 'Excellent', label: 'Excellent' },
                  { value: 'Good', label: 'Good' },
                ]}
                buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
              />
            </div>
          )}

          {/* Color Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">{isAccessoryForm ? 'Color / Variant' : 'Color Variant *'}</label>
            {!isCustomColor ? (
              <CustomSelect
                fullWidth
                value={color}
                onChange={(val) => {
                  if (val === 'CUSTOM') {
                    setIsCustomColor(true);
                    setColor('');
                  } else {
                    setColor(val);
                  }
                }}
                options={[
                  { value: '', label: 'Select Color...' },
                  ...Array.from(new Set([...POPULAR_COLORS, ...ProductService.getProductsSync().map((p) => p.color).filter(Boolean)])).map((c) => ({
                    value: c,
                    label: c,
                  })),
                  { value: 'CUSTOM', label: '+ Type Custom Color...' },
                ]}
                buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
              />
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
      <div id="free-offer-config-section" className="bg-white border border-zinc-200 p-4 sm:p-6 rounded-2xl space-y-5 shadow-sm overflow-hidden scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#E50914] shrink-0" />
            <h3 className="text-base font-bold text-zinc-900">
              Free Product Offer Configuration
            </h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs self-start sm:self-auto">
            <input
              type="checkbox"
              checked={offerEnabled}
              onChange={(e) => {
                setOfferEnabled(e.target.checked);
                if (e.target.checked && offerItems.length === 0) {
                  setOfferError('');
                }
              }}
              className="w-4 h-4 rounded bg-zinc-50 border-zinc-300 text-[#E50914] focus:ring-0"
            />
            <span className={offerEnabled ? 'text-[#E50914] font-black' : 'text-zinc-500'}>
              Enable Offer = {offerEnabled ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>

        {offerError && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{offerError}</span>
          </div>
        )}

        {offerEnabled && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Offer Products Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-800">
                Select Free Offer Products from Catalog *
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
                {/* Custom Image-Enabled Offer Product Dropdown */}
                <div ref={offerPickerRef} className="relative w-full sm:flex-1 min-w-0">
                  {(() => {
                    const selectedObj = availableOfferProducts.find((p) => p.id === selectedOfferProdToAdd);
                    return (
                      <button
                        type="button"
                        onClick={() => setIsOfferPickerOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 truncate">
                          {selectedObj ? (
                            <>
                              <img
                                src={selectedObj.image || '/images/placeholder-iphone.svg'}
                                alt=""
                                className="w-6 h-6 object-contain rounded-md bg-white p-0.5 border border-zinc-200 shrink-0"
                              />
                              <span className="truncate text-zinc-900 font-extrabold">{selectedObj.name}</span>
                              <span className="text-[10px] text-zinc-500 font-normal shrink-0">
                                (Stock: {selectedObj.stock ?? 100})
                              </span>
                            </>
                          ) : (
                            <span className="text-zinc-500 font-medium truncate">-- Choose an Offer Product to Add --</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOfferPickerOpen ? 'rotate-180 text-zinc-700' : ''}`} />
                      </button>
                    );
                  })()}

                  {/* Dropdown Options List */}
                  {isOfferPickerOpen && (
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-full bg-white border border-zinc-200 shadow-xl rounded-2xl p-1.5 space-y-1 max-h-64 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOfferProdToAdd('');
                          setIsOfferPickerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                          !selectedOfferProdToAdd ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-500 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="truncate">-- Choose an Offer Product to Add --</span>
                      </button>

                      {availableOfferProducts
                        .filter((item) => item.status === 'active')
                        .map((item) => {
                          const isSelected = selectedOfferProdToAdd === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedOfferProdToAdd(item.id);
                                setIsOfferPickerOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 text-[#E50914] border border-rose-200/80 shadow-2xs'
                                  : 'hover:bg-zinc-100/80 text-zinc-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 truncate">
                                <img
                                  src={item.image || '/images/placeholder-iphone.svg'}
                                  alt=""
                                  className="w-7 h-7 object-contain rounded-md bg-white p-0.5 border border-zinc-200 shrink-0"
                                />
                                <span className="truncate">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-semibold">
                                  Stock: {item.stock ?? 100}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#E50914] stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddOfferItem}
                  className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Selected Items List */}
              {offerItems.length === 0 ? (
                <div className="p-4 bg-amber-50/80 border border-amber-300/80 rounded-xl text-center text-xs font-bold text-amber-900 space-y-1">
                  <div>⚠️ Enable Offer is ON: No free offer items added yet!</div>
                  <div className="font-medium text-amber-800 text-[11px]">
                    Choose an item from the dropdown above and click "+ Add Item" before publishing.
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {offerItems.map((item, idx) => {
                    const offerProd = availableOfferProducts.find((p) => p.id === item.offerProductId);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={offerProd?.image || '/images/placeholder-iphone.svg'}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-rose-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs text-zinc-900 truncate">
                              {offerProd?.name || item.offerProductId}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate">Free Promotional Accessory</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-200/50">
                          <div className="flex items-center gap-1.5 bg-white border border-rose-200 rounded-lg px-2 py-1">
                            <span className="text-[11px] font-bold text-zinc-500">Qty:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferItemQty(item.offerProductId, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-black text-xs text-[#E50914] px-1">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferItemQty(item.offerProductId, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveOfferItem(item.offerProductId)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Remove offer item"
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
      <div className="bg-white border border-zinc-200 p-4 sm:p-6 rounded-2xl space-y-4 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-200 pb-3">
          Device Images
        </h3>

        <div className="space-y-3">
          {/* File Upload / Cloudinary Ready */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="cursor-pointer px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center justify-center sm:justify-start gap-2 transition-colors border border-zinc-200">
              <Upload className="w-4 h-4 shrink-0" />
              <span>Choose Image File (Cloudinary Ready)</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-zinc-500 font-medium text-center sm:text-left">Or paste image URL below</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full sm:flex-1 min-w-0 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0"
            >
              Add URL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 h-28 flex items-center justify-center p-1">
                <img
                  src={img}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                  }}
                  className="max-h-full max-w-full object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
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
