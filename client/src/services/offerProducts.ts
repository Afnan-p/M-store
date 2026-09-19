import type { OfferProduct } from '../types/offerProduct';
import { fetchFromAPI } from './apiClient';

const LOCAL_STORAGE_OFFER_PRODUCTS_KEY = 'mstore_offer_products_db_v1';

const INITIAL_SEED_OFFER_PRODUCTS: OfferProduct[] = [
  {
    id: 'offprod_001',
    name: 'Apple Silicone Case (MagSafe)',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 150,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'offprod_002',
    name: 'Apple 20W USB-C Power Adapter',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 200,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'offprod_003',
    name: '9H Tempered Glass Screen Protector',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 300,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'offprod_004',
    name: 'Wireless Bluetooth Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 80,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'offprod_005',
    name: 'MagSafe Wireless Charging Cable (1m)',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop',
    storeId: 'ALL',
    stock: 120,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

function loadOfferProductsFromStorage(): OfferProduct[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_OFFER_PRODUCTS_KEY);
    if (data) {
      const parsed: OfferProduct[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read offer products from localStorage:', err);
  }
  localStorage.setItem(LOCAL_STORAGE_OFFER_PRODUCTS_KEY, JSON.stringify(INITIAL_SEED_OFFER_PRODUCTS));
  return INITIAL_SEED_OFFER_PRODUCTS;
}

function saveOfferProductsToStorage(offerProducts: OfferProduct[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_OFFER_PRODUCTS_KEY, JSON.stringify(offerProducts));
  } catch (err) {
    console.error('Failed to save offer products to localStorage:', err);
  }
}

export const OfferProductService = {
  getOfferProductsSync(): OfferProduct[] {
    return loadOfferProductsFromStorage();
  },

  async getOfferProducts(storeId?: string): Promise<OfferProduct[]> {
    const endpoint = storeId && storeId !== 'ALL' ? `/offer-products?storeId=${storeId}` : '/offer-products';
    const remote = await fetchFromAPI<OfferProduct[]>(endpoint);
    const local = loadOfferProductsFromStorage();

    if (remote && Array.isArray(remote) && remote.length > 0) {
      saveOfferProductsToStorage(remote);
      return remote;
    }
    return local;
  },

  async addOfferProduct(data: Omit<OfferProduct, 'id' | 'createdAt'>): Promise<OfferProduct> {
    const localList = loadOfferProductsFromStorage();
    const newOfferProduct: OfferProduct = {
      ...data,
      id: 'offprod_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newOfferProduct, ...localList];
    saveOfferProductsToStorage(updated);

    await fetchFromAPI<OfferProduct>('/offer-products', {
      method: 'POST',
      body: JSON.stringify(newOfferProduct),
    });

    return newOfferProduct;
  },

  async updateOfferProduct(id: string, updates: Partial<OfferProduct>): Promise<OfferProduct | null> {
    const localList = loadOfferProductsFromStorage();
    const index = localList.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const updatedItem: OfferProduct = {
      ...localList[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localList[index] = updatedItem;
    saveOfferProductsToStorage(localList);

    await fetchFromAPI<OfferProduct>(`/offer-products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedItem),
    });

    return updatedItem;
  },

  async deleteOfferProduct(id: string): Promise<boolean> {
    const localList = loadOfferProductsFromStorage();
    const filtered = localList.filter((item) => item.id !== id);

    if (filtered.length === localList.length) return false;

    saveOfferProductsToStorage(filtered);

    await fetchFromAPI<{ message: string }>(`/offer-products/${id}`, {
      method: 'DELETE',
    });

    return true;
  },
};
