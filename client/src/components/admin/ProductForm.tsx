import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, CategoryType, ConditionType } from '../../types/product';
import type { OfferProduct, OfferItem } from '../../types/offerProduct';
import { OfferProductService } from '../../services/offerProducts';
import { StockService } from '../../services/stock';
import { ProductService } from '../../services/products';
import { useSegments } from '../../hooks/useSegments';
import { useCategories } from '../../hooks/useCategories';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { CustomSelect } from '../common/CustomSelect';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Upload, X, Gift, Trash2, Check, Plus, ChevronDown, AlertCircle, Star, Layers, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { isIPhoneProduct, isAndroidProduct, getAndroidBrandName } from '../../utils/categoryUtils';

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

const STANDARD_ANDROID_BRANDS = [
  'Samsung',
  'Realme',
  'Xiaomi',
  'OnePlus',
  'Oppo',
  'Vivo',
  'Google Pixel',
  'Nothing',
  'POCO',
  'iQOO',
  'Motorola',
  'Nokia',
];

const resolveFormCategory = (initialData?: Product, defaultCat?: CategoryType): CategoryType => {
  if (!initialData) return defaultCat || 'iphone-used';

  const cat = (initialData.category || '').toLowerCase().trim();
  if (cat === 'accessory') return 'accessory';

  if (isAndroidProduct(initialData)) {
    if (cat === 'android-new') return 'android-new';
    if (cat === 'android-used' || cat === 'used-android') return 'android-used';
    return initialData.condition === 'Brand New' ? 'android-new' : 'android-used';
  }

  if (isIPhoneProduct(initialData)) {
    if (cat === 'iphone-new') return 'iphone-new';
    if (cat === 'iphone-used' || cat === 'used-iphones') return 'iphone-used';
    return initialData.condition === 'Brand New' ? 'iphone-new' : 'iphone-used';
  }

  if (['iphone-new', 'iphone-used', 'android-new', 'android-used', 'accessory'].includes(cat)) {
    return cat as CategoryType;
  }

  return defaultCat || 'iphone-used';
};

const resolveInitialModel = (initialData?: Product, category?: CategoryType, isAccessoryForm?: boolean): { model: string; isCustom: boolean } => {
  if (isAccessoryForm) return { model: 'Accessory', isCustom: false };
  if (!initialData) return { model: '', isCustom: false };

  const rawModel = (initialData.model || '').trim();

  if (category === 'android-new' || category === 'android-used') {
    const matchedStd = STANDARD_ANDROID_BRANDS.find((b) => b.toLowerCase() === rawModel.toLowerCase());
    if (matchedStd) return { model: matchedStd, isCustom: false };

    const derivedBrand = getAndroidBrandName(initialData);
    const matchedDerived = STANDARD_ANDROID_BRANDS.find((b) => b.toLowerCase() === derivedBrand.toLowerCase());
    if (matchedDerived) return { model: matchedDerived, isCustom: false };

    if (rawModel && !rawModel.toLowerCase().includes('titanium') && !rawModel.toLowerCase().includes('iphone') && rawModel !== 'Accessory') {
      return { model: rawModel, isCustom: true };
    }

    if (derivedBrand && derivedBrand !== 'Android' && derivedBrand !== 'Other') {
      return { model: derivedBrand, isCustom: false };
    }

    return { model: '', isCustom: false };
  }

  if (rawModel) return { model: rawModel, isCustom: false };
  return { model: 'iPhone 15 Pro', isCustom: false };
};

const resolveInitialColor = (initialData?: Product, isAccessoryForm?: boolean): { color: string; isCustom: boolean } => {
  const c = initialData?.color ? initialData.color.trim() : (isAccessoryForm ? 'White / Standard' : 'Natural Titanium');
  const isPopular = POPULAR_COLORS.some((p) => p.toLowerCase() === c.toLowerCase());
  return { color: c, isCustom: Boolean(initialData?.color && !isPopular) };
};

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
  const { activeCategories } = useCategories();
  const { stores, isMultiStoreEnabled } = useStore();

  const isAccessoryForm = defaultCategory === 'accessory' || initialData?.category === 'accessory';

  const initialCat = resolveFormCategory(initialData, defaultCategory);
  const initialModelInfo = resolveInitialModel(initialData, initialCat, isAccessoryForm);
  const initialColorInfo = resolveInitialColor(initialData, isAccessoryForm);

  const [name, setName] = useState(initialData?.name || '');
  const [model, setModel] = useState(initialModelInfo.model);
  
  const initialStoreIds = initialData?.storeIds && initialData.storeIds.length > 0
    ? initialData.storeIds
    : [initialData?.storeId || 'ALL'];
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(initialStoreIds);

  const [category, setCategory] = useState<CategoryType>(initialCat);
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || 'Chargers & Adapters');
  const [customSubCategory, setCustomSubCategory] = useState('');
  const [isCustomSubCat, setIsCustomSubCat] = useState(false);
  const [price, setPrice] = useState<number | string>(initialData?.price || '');
  const [originalPrice, setOriginalPrice] = useState<number | string>(
    initialData?.originalPrice
      ? initialData.originalPrice
      : initialData?.price
      ? Math.round(Number(initialData.price) * 1.15)
      : ''
  );
  const [initialStock, setInitialStock] = useState<number | string>(10);
  const [storage, setStorage] = useState(initialData?.storage || (isAccessoryForm ? 'N/A' : '128GB'));
  const [condition, setCondition] = useState<ConditionType>(initialData?.condition || 'Excellent');
  const [batteryHealth, setBatteryHealth] = useState<number | string>(initialData?.batteryHealth || 92);
  const [color, setColor] = useState(initialColorInfo.color);
  const [description, setDescription] = useState(initialData?.description || '');
  const [available, setAvailable] = useState<boolean>(initialData?.available ?? true);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? false);

  const [segmentId, setSegmentId] = useState(initialData?.segmentId || '');
  const [segmentSlug, setSegmentSlug] = useState(initialData?.segmentSlug || '');
  const [isCustomModel, setIsCustomModel] = useState(initialModelInfo.isCustom);
  const [isCustomColor, setIsCustomColor] = useState(initialColorInfo.isCustom);
  const [replacementStatus, setReplacementStatus] = useState<string>(initialData?.replacementStatus || 'No Replacement');
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

  const DEFAULT_COVER_IMAGE =
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop';

  const [coverImage, setCoverImage] = useState<string>(() => {
    if (initialData?.images && initialData.images.length > 0) return initialData.images[0];
    if (initialData?.image) return initialData.image;
    return DEFAULT_COVER_IMAGE;
  });

  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (initialData?.images && initialData.images.length > 1) {
      return initialData.images.slice(1);
    }
    return [];
  });

  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.images && initialData.images.length > 0) {
        setCoverImage(initialData.images[0]);
        setGalleryImages(initialData.images.slice(1));
      } else if (initialData.image) {
        setCoverImage(initialData.image);
        setGalleryImages([]);
      }
    }
  }, [initialData]);

  useEffect(() => {
    OfferProductService.getOfferProducts().then(setAvailableOfferProducts);
  }, []);

  // Cover Image Handlers
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingCover(true);
        const uploadedUrl = await uploadImageToCloudinary(file);
        if (uploadedUrl) {
          setCoverImage(uploadedUrl);
        }
      } catch (error) {
        console.error('Failed to upload cover image:', error);
      } finally {
        setUploadingCover(false);
        e.target.value = '';
      }
    }
  };

  const handleSetCoverUrl = () => {
    const trimmed = coverUrlInput.trim();
    if (trimmed) {
      setCoverImage(trimmed);
      setCoverUrlInput('');
    }
  };

  // Additional Multi-Angle / Detail Gallery Handlers
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingGallery(true);
        const uploadedUrl = await uploadImageToCloudinary(file);
        if (uploadedUrl) {
          setGalleryImages((prev) => [...prev, uploadedUrl]);
        }
      } catch (error) {
        console.error('Failed to upload gallery image:', error);
      } finally {
        setUploadingGallery(false);
        e.target.value = '';
      }
    }
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (trimmed) {
      setGalleryImages((prev) => [...prev, trimmed]);
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePromoteToCover = (index: number) => {
    const targetImage = galleryImages[index];
    if (!targetImage) return;
    const oldCover = coverImage;
    const updatedGallery = [...galleryImages];
    updatedGallery[index] = oldCover;
    setCoverImage(targetImage);
    setGalleryImages(updatedGallery);
  };

  const handleMoveGallery = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;
    setGalleryImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
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

    if (!name.trim() || !price || !originalPrice) {
      setOfferError('⚠️ Please fill in all required fields including Selling Price (₹) and Regular MRP (₹).');
      return;
    }

    if (Number(originalPrice) < Number(price)) {
      setOfferError('⚠️ Regular MRP (₹) must be greater than or equal to Selling Price (₹).');
      return;
    }

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
      const finalSubCategory = isAccessoryForm ? (isCustomSubCat ? customSubCategory : subCategory) : undefined;
      const finalCategory = isAccessoryForm ? 'accessory' : category;

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

      const isIPhoneCategory = finalCategory === 'iphone-new' || finalCategory === 'iphone-used';
      const finalModel = isAccessoryForm
        ? 'Accessory'
        : isIPhoneCategory
        ? (model || 'iPhone 15 Pro')
        : (model && model !== 'iPhone 15 Pro' && model !== 'Accessory' ? model.trim() : (name.trim() || 'Device'));

      const isBrandNew = finalCategory === 'iphone-new' || finalCategory === 'android-new';
      const isUsed = finalCategory === 'iphone-used' || finalCategory === 'android-used' || (condition !== 'Brand New' && !isBrandNew);
      const finalCondition = isAccessoryForm ? 'Brand New' : (isBrandNew ? 'Brand New' : (condition === 'Brand New' ? 'Excellent' : condition));

      const allImages = [coverImage, ...galleryImages].filter(Boolean);
      const finalImages = allImages.length > 0 ? allImages : [DEFAULT_COVER_IMAGE];

      await onSubmit({
        name: name.trim(),
        model: finalModel,
        segmentId: isIPhoneCategory ? finalSegmentId : undefined,
        segmentSlug: isIPhoneCategory ? finalSegmentSlug : undefined,
        subCategory: isAccessoryForm ? finalSubCategory : undefined,
        storeId: primaryStoreId,
        storeIds: selectedStoreIds,
        category: finalCategory,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : (null as any),
        initialStock: Number(initialStock),
        storage: isAccessoryForm ? 'N/A' : storage,
        condition: finalCondition,
        batteryHealth: !isAccessoryForm && isUsed && batteryHealth ? Number(batteryHealth) : (null as any),
        replacementStatus: !isAccessoryForm && isUsed ? replacementStatus : '',
        color,
        warranty,
        description,
        image: finalImages[0],
        images: finalImages,
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

          {/* Showroom Store Multi-Selection Cards (Rendered only when Multi-Store Mode is enabled) */}
          {isMultiStoreEnabled && (
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
          )}

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
                value={category}
                onChange={(val) => {
                  setCategory(val as CategoryType);
                  if (val === 'iphone-new' || val === 'android-new') {
                    setCondition('Brand New');
                  } else if ((val === 'iphone-used' || val === 'android-used') && condition === 'Brand New') {
                    setCondition('Excellent');
                  }
                }}
                options={[
                  { value: 'iphone-new', label: 'Brand New iPhone' },
                  { value: 'iphone-used', label: 'Pre-Owned / Used iPhone' },
                  { value: 'android-new', label: 'Brand New Android' },
                  { value: 'android-used', label: 'Pre-Owned / Used Android' },
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
                      ...activeCategories
                        .filter((c) => !['iPhones', 'Used iPhones', 'Accessories', 'Offers'].includes(c.name))
                        .map((c) => ({ value: c.name, label: c.name })),
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

          {/* iPhone Model Series vs Custom Brand / Model Field */}
          {!isAccessoryForm && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">
                {(category === 'iphone-new' || category === 'iphone-used')
                  ? 'Apple Model Series (Segment) *'
                  : 'Brand / Model Name (Optional)'}
              </label>
              {(category === 'iphone-new' || category === 'iphone-used') ? (
                !isCustomModel ? (
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
                )
              ) : !isCustomModel ? (
                <CustomSelect
                  fullWidth
                  value={STANDARD_ANDROID_BRANDS.includes(model) ? model : (model === 'iPhone 15 Pro' || model === 'Accessory' ? '' : model)}
                  onChange={(val) => {
                    if (val === 'CUSTOM') {
                      setIsCustomModel(true);
                      setModel('');
                    } else {
                      setModel(val);
                    }
                  }}
                  options={[
                    { value: '', label: 'Select Android Brand...' },
                    ...STANDARD_ANDROID_BRANDS.map((b) => ({ value: b, label: b })),
                    { value: 'CUSTOM', label: '+ Type Custom Brand...' },
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
                    placeholder="e.g. Samsung, Realme, Oppo"
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
            <label className="text-xs font-semibold text-zinc-700">Regular MRP (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 94900"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E50914]"
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

          {/* Condition (Only shown for Used/Pre-Owned devices) */}
          {!isAccessoryForm && (category === 'iphone-used' || category === 'android-used' || (condition !== 'Brand New' && category !== 'iphone-new' && category !== 'android-new')) && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Device Condition *</label>
              <CustomSelect
                fullWidth
                value={condition === 'Brand New' ? 'Excellent' : condition}
                onChange={(val) => setCondition(val as ConditionType)}
                options={[
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

          {/* Pre-Owned Fields: Battery Health & Service Status */}
          {!isAccessoryForm && (category === 'iphone-used' || category === 'android-used' || (condition !== 'Brand New' && category !== 'iphone-new' && category !== 'android-new')) && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Pre-Owned Battery Health %</label>
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

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Service / Replacement Status</label>
                <CustomSelect
                  fullWidth
                  value={replacementStatus}
                  onChange={(val) => setReplacementStatus(val)}
                  options={[
                    { value: 'No Replacement', label: 'No Replacement (100% Original)' },
                    { value: 'Display Changed (Original)', label: 'Display Changed (Original Parts)' },
                    { value: 'Battery Replaced', label: 'Battery Replaced (Brand New)' },
                    { value: 'Back Glass Replaced', label: 'Back Glass Replaced' },
                    { value: 'Quality Inspected & Certified', label: 'Quality Inspected & Certified' },
                  ]}
                  buttonClassName="py-2.5 px-4 text-xs font-bold rounded-xl"
                />
              </div>
            </>
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

      {/* Device Images Section */}
      <div className="bg-white border border-zinc-200 p-4 sm:p-6 rounded-2xl space-y-6 shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#E50914]" />
              <span>Device Showcase & Multi-Angle Images</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Specify your primary showcase cover photo and upload multiple detail angles (back, sides, camera, box).
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
            ☁️ Cloudinary Connected
          </span>
        </div>

        {/* 1. PRIMARY COVER IMAGE */}
        <div className="p-4 bg-gradient-to-br from-amber-50/60 via-orange-50/20 to-white border-2 border-amber-300/80 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-white" /> Primary Cover Image
                </span>
                <span className="text-xs font-black text-zinc-900">Main Product Thumbnail & Showcase</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                This exact image is shown on store listings, search filters, WhatsApp shares, and the main hero banner.
              </p>
            </div>
            {coverImage && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
                1 Cover Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Cover Preview Card */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative group w-full aspect-square max-h-48 rounded-xl bg-white border-2 border-amber-300 shadow-sm overflow-hidden flex items-center justify-center p-2">
                <img
                  src={coverImage || '/images/placeholder-iphone.svg'}
                  alt="Primary Cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                  }}
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
                <div className="absolute top-2 left-2 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" /> COVER
                </div>
              </div>
            </div>

            {/* Cover Upload / URL Controls */}
            <div className="md:col-span-8 lg:col-span-9 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className={`cursor-pointer px-4 py-2.5 ${uploadingCover ? 'bg-amber-100 text-amber-800 cursor-not-allowed' : 'bg-zinc-900 hover:bg-black text-white'} rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs`}>
                  {uploadingCover ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Upload New Cover Image (Device Front/Hero)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">Or paste an external image URL:</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={coverUrlInput}
                  onChange={(e) => setCoverUrlInput(e.target.value)}
                  placeholder="https://... or paste image URL"
                  className="flex-1 min-w-0 px-3.5 py-2 bg-white border border-amber-300/80 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSetCoverUrl}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Set as Cover
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ADDITIONAL MULTI-ANGLE & DETAIL GALLERY VIEWS */}
        <div className="p-4 bg-zinc-50/80 border border-zinc-200 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Multi-Angle Gallery
                </span>
                <span className="text-xs font-black text-zinc-900">Additional Views & Detail Angles (Optional)</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Add back side, side edges, camera glass closeup, bill/box photos, or condition proofs. Customers can swipe these on product page.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-200/80 px-2 py-0.5 rounded-md self-start sm:self-auto">
              {galleryImages.length} {galleryImages.length === 1 ? 'Angle Added' : 'Angles Added'}
            </span>
          </div>

          {/* Add Gallery Angle Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className={`cursor-pointer px-4 py-2.5 ${uploadingGallery ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300'} rounded-xl text-xs font-bold flex items-center justify-center sm:justify-start gap-2 transition-all shadow-xs`}>
              {uploadingGallery ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-700" />
                  <span>Uploading angle...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 shrink-0 text-[#E50914]" />
                  <span>+ Add Different View / Angle (Cloudinary)</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingGallery}
                onChange={handleGalleryFileUpload}
                className="hidden"
              />
            </label>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="url"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="Or paste angle image URL..."
                className="flex-1 min-w-0 px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                + Add View
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails List */}
          {galleryImages.length === 0 ? (
            <div className="p-4 bg-white border border-dashed border-zinc-300 rounded-xl text-center text-xs text-zinc-400">
              No extra angle views added yet. Click "+ Add Different View / Angle" above to add Back View, Side Profile, Box, etc.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all p-2 flex flex-col items-center justify-between gap-1.5 shadow-2xs"
                >
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-50">
                    <img
                      src={img}
                      alt={`View ${idx + 2}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                      }}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between pt-1 border-t border-zinc-100">
                    <span className="text-[10px] font-black text-zinc-500">Angle #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveGallery(idx, 'left')}
                          title="Move Left"
                          className="p-1 hover:bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold"
                        >
                          ◀
                        </button>
                      )}
                      {idx < galleryImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveGallery(idx, 'right')}
                          title="Move Right"
                          className="p-1 hover:bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold"
                        >
                          ▶
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        title="Remove this angle"
                        className="p-1 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Promote to Cover button */}
                  <button
                    type="button"
                    onClick={() => handlePromoteToCover(idx)}
                    className="w-full py-1 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/80 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors"
                    title="Make this the main cover image"
                  >
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                    <span>Set as Cover</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/mstore-management-portal/products')}
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
