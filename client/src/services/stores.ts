import type { Store } from '../types/store';
import { fetchFromAPI } from './apiClient';

const LOCAL_STORAGE_KEY = 'mstore_stores_db_v3';
const LEGACY_STORE_IDS = new Set(['store-1', 'store-2', 'store-3', 'store-4', 'store-5']);

export const INITIAL_STORES: Store[] = [
  {
    id: 'store001',
    name: 'Store 1 - Kootanad',
    code: 'STORE-01',
    location: 'Main Road, Near Bus Stand, Kootanad',
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    maps: 'https://maps.google.com/?q=Kootanad+Kerala',
    status: 'active',
    description: 'Flagship M Store showroom featuring new sealed iPhones and certified pre-owned devices.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'store002',
    name: 'Store 2 - Kecheri',
    code: 'STORE-02',
    location: 'Opposite Calicut Road, Kecheri',
    phone: '+91 98765 43211',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80',
    maps: 'https://maps.google.com/?q=Kecheri+Kerala',
    status: 'active',
    description: 'Kecheri branch with extensive range of pre-owned iPhones and original Apple gear.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'store003',
    name: 'Store 3 - Mattom',
    code: 'STORE-03',
    location: 'Near Church Junction, Mattom',
    phone: '+91 98765 43212',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80',
    maps: 'https://maps.google.com/?q=Mattom+Kerala',
    status: 'active',
    description: 'Mattom showroom providing hands-on testing, fast trade-ins, and accessory bundles.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'store004',
    name: 'Store 4 - Pattambi',
    code: 'STORE-04',
    location: 'Town Centre, Pattambi',
    phone: '+91 98765 43213',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
    maps: 'https://maps.google.com/?q=Pattambi+Kerala',
    status: 'active',
    description: 'Pattambi M Store branch offering premium Apple sales and expert device support.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

function loadStoresFromStorage(): Store[] {
  try {
    localStorage.removeItem('mstore_stores_db_v1');
    localStorage.removeItem('mstore_stores_db_v2');

    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data !== null) {
      const parsed: Store[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read stores from localStorage:', err);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STORES));
  return INITIAL_STORES;
}

function saveStoresToStorage(stores: Store[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stores));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_stores_updated'));
    }
  } catch (err) {
    console.error('Failed to save stores to localStorage:', err);
  }
}

export const StoreService = {
  getStoresSync(): Store[] {
    return loadStoresFromStorage();
  },

  async getStores(): Promise<Store[]> {
    const remote = await fetchFromAPI<Store[]>('/stores');
    if (remote && Array.isArray(remote)) {
      saveStoresToStorage(remote);
      return remote;
    }
    return loadStoresFromStorage();
  },

  async getActiveStores(): Promise<Store[]> {
    const stores = await this.getStores();
    return stores.filter((s) => s.status === 'active');
  },

  async getStoreById(id: string): Promise<Store | null> {
    const remote = await fetchFromAPI<Store>(`/stores/${id}`);
    if (remote) return remote;

    const stores = loadStoresFromStorage();
    return stores.find((s) => s.id === id) || null;
  },

  async addStore(storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<Store> {
    const stores = loadStoresFromStorage();
    const newStore: Store = {
      ...storeData,
      id: 'store_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...stores, newStore];
    saveStoresToStorage(updated);

    await fetchFromAPI<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(newStore),
    });

    return newStore;
  },

  async updateStore(id: string, updates: Partial<Store>): Promise<Store | null> {
    const stores = loadStoresFromStorage();
    const index = stores.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updatedStore: Store = {
      ...stores[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    stores[index] = updatedStore;
    saveStoresToStorage(stores);

    await fetchFromAPI<Store>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    return updatedStore;
  },

  async deleteStore(id: string): Promise<boolean> {
    const stores = loadStoresFromStorage();
    const filtered = stores.filter((s) => s.id !== id);
    saveStoresToStorage(filtered);

    try {
      await fetchFromAPI<{ message: string }>(`/stores/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete store on server API:', err);
    }
    return true;
  },
};
