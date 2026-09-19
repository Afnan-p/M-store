import type { ProductStock, StockHistoryItem, StockFilterOptions, StockStatus, StockReason } from '../types/stock';
import { fetchFromAPI } from './apiClient';
import { ProductService } from './products';
import { OfferProductService } from './offerProducts';

const LOCAL_STOCK_KEY = 'mstore_stock_records_v2';
const LOCAL_HISTORY_KEY = 'mstore_stock_history_v1';

const STORES = ['store001', 'store002', 'store003', 'store004'];

export function calculateStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'Out of Stock';
  if (stock >= 1 && stock <= 5) return 'Low Stock';
  return 'In Stock';
}

function getLocalStockRecords(): ProductStock[] {
  let records: ProductStock[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STOCK_KEY);
    if (raw !== null) {
      const parsed: ProductStock[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        records = parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading local stock records:', err);
  }

  // Auto-sync: Ensure all products from ProductService have stock records for all store branches
  const allProds = ProductService.getProductsSync();
  let modified = false;

  for (const prod of allProds) {
    const isSpecificStore = Boolean(prod.storeId && prod.storeId !== 'ALL' && prod.storeId !== 'all');
    const pStoreLower = String(prod.storeId || '').toLowerCase();

    for (const storeId of STORES) {
      const isMatch = !isSpecificStore || (
        prod.storeId === storeId ||
        (storeId === 'store001' && pStoreLower.includes('kootanad')) ||
        (storeId === 'store002' && pStoreLower.includes('kecheri')) ||
        (storeId === 'store003' && pStoreLower.includes('mattom')) ||
        (storeId === 'store004' && pStoreLower.includes('pattambi'))
      );

      if (!isMatch) continue;

      const exists = records.some((r) => r.productId === prod.id && r.storeId === storeId);
      if (!exists) {
        records.unshift({
          id: `stock_${prod.id}_${storeId}`,
          productId: prod.id,
          storeId,
          stock: 10,
          itemType: 'product',
          status: calculateStockStatus(10),
          productName: prod.name,
          productCategory: prod.category,
          productImage: prod.images?.[0] || '/images/placeholder-iphone.svg',
          productPrice: prod.price,
          productStorage: prod.storage || '128GB',
          updatedAt: new Date().toISOString(),
        });
        modified = true;
      }
    }
  }

  // Purge any dummy records created for unassigned stores
  const cleanedRecords = records.filter((r) => {
    const prod = allProds.find((p) => p.id === r.productId);
    if (prod && prod.storeId && prod.storeId !== 'ALL' && prod.storeId !== 'all') {
      const pStoreLower = String(prod.storeId).toLowerCase();
      const isMatch = (
        prod.storeId === r.storeId ||
        (r.storeId === 'store001' && pStoreLower.includes('kootanad')) ||
        (r.storeId === 'store002' && pStoreLower.includes('kecheri')) ||
        (r.storeId === 'store003' && pStoreLower.includes('mattom')) ||
        (r.storeId === 'store004' && pStoreLower.includes('pattambi'))
      );
      if (!isMatch) return false;
    }
    return true;
  });

  if (cleanedRecords.length !== records.length) {
    records = cleanedRecords;
    modified = true;
  }

  if (modified) {
    saveLocalStockRecords(records);
  }

  return records;
}

function sanitizeStockForStorage(s: ProductStock): ProductStock {
  const img = s.productImage;
  return {
    ...s,
    productImage:
      img && img.startsWith('data:image/') && img.length > 300000
        ? 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'
        : img,
  };
}

function saveLocalStockRecords(list: ProductStock[]) {
  try {
    const sanitized = list.map(sanitizeStockForStorage);
    localStorage.setItem(LOCAL_STOCK_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Local stock save error:', err);
  }
}

function getLocalStockHistory(): StockHistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveLocalStockHistory(history: StockHistoryItem[]) {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Local history save error:', err);
  }
}

function enrichStockRecords(records: ProductStock[]): ProductStock[] {
  const allProds = ProductService.getProductsSync();
  const offerProds = OfferProductService.getOfferProductsSync();

  const prodMap = new Map(allProds.map((p) => [p.id, p]));
  const offerMap = new Map(offerProds.map((op) => [op.id, op]));

  return records.map((record) => {
    const p = prodMap.get(record.productId);
    const op = offerMap.get(record.productId);
    const name = p?.name || op?.name || record.productName || record.productId;
    const cat = p?.category || record.productCategory || (op ? 'accessory' : (record.productId.includes('acc') ? 'accessory' : 'iphone-used'));
    
    // Priority for image: 1. Product's actual images[0], 2. OfferProduct's image, 3. record.productImage, 4. fallback placeholder
    const pImg = p?.images && p.images.length > 0 ? p.images[0] : null;
    const image = pImg || op?.image || record.productImage || '/images/placeholder-iphone.svg';

    const price = p?.price || record.productPrice || 0;
    const storage = p?.storage || record.productStorage || (cat === 'accessory' ? 'N/A' : '128GB');
    const currentStock = Math.max(0, record.stock ?? 0);

    return {
      ...record,
      stock: currentStock,
      status: calculateStockStatus(currentStock),
      productName: name,
      productCategory: cat,
      productImage: image,
      productPrice: price,
      productStorage: storage,
    };
  });
}

export const StockService = {
  async getStockList(filters?: StockFilterOptions): Promise<ProductStock[]> {
    let records: ProductStock[] = [];

    try {
      const params = new URLSearchParams();
      if (filters?.storeId && filters.storeId !== 'ALL' && filters.storeId !== 'all') {
        params.append('storeId', filters.storeId);
      }
      if (filters?.status && filters.status !== 'ALL') {
        params.append('status', filters.status);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.category && filters.category !== 'ALL') {
        params.append('category', filters.category);
      }

      const queryStr = params.toString();
      const endpoint = queryStr ? `/stock?${queryStr}` : '/stock';
      const apiResult = await fetchFromAPI<ProductStock[]>(endpoint);
      if (apiResult && Array.isArray(apiResult) && apiResult.length > 0) {
        records = apiResult;
        if (!filters?.storeId || filters.storeId === 'ALL' || filters.storeId === 'all') {
          saveLocalStockRecords(apiResult);
        }
      } else {
        records = getLocalStockRecords();
      }
    } catch (err) {
      console.warn('API getStockList failed, falling back to local database:', err);
      records = getLocalStockRecords();
    }

    // Enrich all records with product metadata
    let enriched = enrichStockRecords(records);

    // Apply filters
    if (filters?.storeId && filters.storeId !== 'ALL' && filters.storeId !== 'all') {
      enriched = enriched.filter((s) => s.storeId === filters.storeId);
    }

    if (filters?.category && filters.category !== 'ALL') {
      enriched = enriched.filter((s) => s.productCategory === filters.category);
    }

    if (filters?.status && filters.status !== 'ALL') {
      enriched = enriched.filter((s) => calculateStockStatus(s.stock) === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      enriched = enriched.filter((s) => s.productName?.toLowerCase().includes(q) || s.productId.toLowerCase().includes(q));
    }

    return enriched;
  },

  async getStockForProduct(productId: string, storeId?: string): Promise<number> {
    const isAll = !storeId || storeId === 'ALL' || storeId === 'all';
    const list = await this.getStockList(isAll ? undefined : { storeId });
    const productRecords = list.filter((s) => s.productId === productId);

    if (isAll) {
      if (productRecords.length > 0) {
        return productRecords.reduce((sum, item) => sum + Math.max(0, item.stock || 0), 0);
      }
      const allLocal = getLocalStockRecords().filter((s) => s.productId === productId);
      return allLocal.reduce((sum, item) => sum + Math.max(0, item.stock || 0), 0);
    }

    const match = productRecords.find((s) => s.storeId === storeId);
    if (match) return match.stock;

    const allList = getLocalStockRecords();
    const fallbackMatch = allList.find((s) => s.productId === productId && s.storeId === storeId);
    return fallbackMatch ? fallbackMatch.stock : 0;
  },

  async getProductStockBreakdown(productId: string): Promise<ProductStock[]> {
    const list = await this.getStockList({ storeId: 'ALL' });
    return list.filter((s) => s.productId === productId);
  },

  async updateStock(params: {
    productId: string;
    storeId: string;
    newStock: number;
    reason: StockReason;
    notes?: string;
    updatedBy?: string;
  }): Promise<{ stock: ProductStock; history: StockHistoryItem }> {
    const newStockNum = Math.max(0, Number(params.newStock));

    try {
      const res = await fetchFromAPI<{ stock: ProductStock; history: StockHistoryItem }>('/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          newStock: newStockNum,
        }),
      });

      if (res && res.stock) {
        const localRecords = getLocalStockRecords();
        const idx = localRecords.findIndex((s) => s.productId === params.productId && s.storeId === params.storeId);
        if (idx !== -1) {
          localRecords[idx] = { ...localRecords[idx], stock: newStockNum, updatedAt: new Date().toISOString() };
        } else {
          localRecords.push(res.stock);
        }
        saveLocalStockRecords(localRecords);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('mstore_stock_updated'));
        }
        return res;
      }
    } catch (err) {
      console.warn('API updateStock failed, completing update locally:', err);
    }

    // Local Fallback Persistence
    const localRecords = getLocalStockRecords();
    let record = localRecords.find((s) => s.productId === params.productId && s.storeId === params.storeId);
    const prevStock = record ? record.stock : 0;
    const changeAmount = newStockNum - prevStock;

    if (record) {
      record.stock = newStockNum;
      record.updatedAt = new Date().toISOString();
      record.status = calculateStockStatus(newStockNum);
    } else {
      record = {
        id: `stock_${params.productId}_${params.storeId}`,
        productId: params.productId,
        storeId: params.storeId,
        stock: newStockNum,
        status: calculateStockStatus(newStockNum),
        updatedAt: new Date().toISOString(),
      };
      localRecords.push(record);
    }

    saveLocalStockRecords(localRecords);

    const historyItem: StockHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: params.productId,
      storeId: params.storeId,
      previousStock: prevStock,
      newStock: newStockNum,
      changeAmount,
      reason: params.reason,
      notes: params.notes || '',
      updatedBy: params.updatedBy || 'M Store Manager',
      createdAt: new Date().toISOString(),
    };

    const historyList = getLocalStockHistory();
    historyList.unshift(historyItem);
    saveLocalStockHistory(historyList);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_stock_updated'));
    }

    return { stock: record, history: historyItem };
  },

  async getStockHistory(productId: string, storeId: string): Promise<StockHistoryItem[]> {
    try {
      const history = await fetchFromAPI<StockHistoryItem[]>(`/stock/history/${productId}/${storeId}`);
      if (Array.isArray(history)) {
        return history;
      }
    } catch (err) {
      console.warn('API getStockHistory failed, returning local history:', err);
    }

    const localHistory = getLocalStockHistory();
    return localHistory.filter((h) => h.productId === productId && h.storeId === storeId);
  },
};

