export type CategoryType = 'iphone-new' | 'iphone-used' | 'accessory';

export type ConditionType = 'Brand New' | 'Like New' | 'Excellent' | 'Good';

export type SegmentCategoryType = 'NEW' | 'USED' | 'BOTH';

export interface IPhoneSegment {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  categoryType: SegmentCategoryType;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  segmentId?: string;
  segmentSlug?: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  storage: string; // e.g. "128GB", "256GB", "512GB", "1TB", "N/A" for accessories
  condition: ConditionType;
  batteryHealth?: number; // e.g., 96, 94, 91 (for pre-owned iPhones)
  replacementStatus?: string; // e.g., "No Replacement", "Display Changed (Original)", "Battery Replaced"
  description: string;
  images: string[];
  available: boolean;
  featured?: boolean;
  color?: string; // e.g. "Natural Titanium", "Deep Purple", "Midnight"
  warranty?: string; // e.g. "Apple Warranty till Nov 2026", "Store 6 Month Warranty"
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: CategoryType | 'all';
  condition: 'all' | 'new' | 'used';
  model: string;
  segmentSlug?: string;
  storage: string;
  minPrice: number;
  maxPrice: number;
  availableOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

