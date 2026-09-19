export type StockReason =
  | 'Sold'
  | 'New Stock Added'
  | 'Damaged'
  | 'Returned'
  | 'Stock Correction'
  | 'Other';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductStock {
  id: string;
  productId: string;
  storeId: string;
  stock: number;
  itemType?: 'product' | 'offerProduct';
  status?: StockStatus;
  productName?: string;
  productCategory?: string;
  productImage?: string;
  productPrice?: number;
  productStorage?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface StockHistoryItem {
  id: string;
  productId: string;
  storeId: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  reason: StockReason;
  notes?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface StockFilterOptions {
  search?: string;
  storeId?: string;
  status?: 'ALL' | 'In Stock' | 'Low Stock' | 'Out of Stock';
  category?: 'ALL' | 'iphone-new' | 'iphone-used' | 'accessory';
}
