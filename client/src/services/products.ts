import type { Product } from '../types/product';
import { fetchFromAPI } from './apiClient';
import { slugify } from '../utils/slug';

const LOCAL_STORAGE_KEY = 'mstore_products_db_v9';

// Helper to load products from LocalStorage or initialize with defaults
function loadProductsFromStorage(): Product[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data !== null) {
      const parsed: Product[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((p) => ({
          ...p,
          storeId: !p.storeId || p.storeId === 'all' ? 'ALL' : p.storeId,
        }));
      }
    }
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
  }
  return [];
}

function sanitizeProductForStorage(p: Product): Product {
  return {
    ...p,
    images: (p.images || []).map((img) =>
      img && img.startsWith('data:image/') && img.length > 2000000
        ? 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'
        : img
    ),
  };
}

function saveProductsToStorage(products: Product[]): void {
  try {
    const sanitized = products.map(sanitizeProductForStorage);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Failed to save products to localStorage:', err);
  }
}

/**
 * Service Abstraction for Products API
 * Integrates directly with Express REST API with local storage fallback
 */
export const ProductService = {
  getProductsSync(): Product[] {
    return loadProductsFromStorage();
  },

  async getProducts(): Promise<Product[]> {
    const remote = await fetchFromAPI<Product[]>('/products');

    if (remote && Array.isArray(remote)) {
      const sanitized = remote.map((p: any) => ({
        ...p,
        id: p.id || p._id || `p_${Date.now()}`,
      }));
      saveProductsToStorage(sanitized);
      return sanitized;
    }
    return loadProductsFromStorage();
  },

  async getProductById(id: string): Promise<Product | null> {
    const remote = await fetchFromAPI<Product>(`/products/${id}`);
    if (remote) return remote;

    const products = loadProductsFromStorage();
    const found = products.find((p) => p.id === id || p.slug === id || (p.name && slugify(p.name) === id));
    return found || null;
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt'> & { initialStock?: number }): Promise<Product> {
    const products = loadProductsFromStorage();
    const newProduct: Product = {
      ...productData,
      storeId: productData.storeId || 'ALL',
      id: 'p_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);

    try {
      // Sync to Express REST API with initialStock
      const remote = await fetchFromAPI<Product>('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          initialStock: productData.initialStock !== undefined ? Number(productData.initialStock) : 10,
        }),
      });

      if (remote && remote.id) {
        // Refresh full product list from remote to ensure sync
        await this.getProducts();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('mstore_products_updated'));
        }
        return remote;
      }
    } catch (err) {
      console.warn('API addProduct failed, product saved locally:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_products_updated'));
    }
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = loadProductsFromStorage();
    const index = products.findIndex((p) => p.id === id);

    let updatedProduct: Product;
    if (index !== -1) {
      updatedProduct = { ...products[index], ...updates };
      products[index] = updatedProduct;
    } else {
      updatedProduct = updates as Product;
      products.push(updatedProduct);
    }

    saveProductsToStorage(products);

    try {
      // Sync update to Express REST API backend
      await fetchFromAPI<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      await this.getProducts();
    } catch (err) {
      console.warn('API updateProduct failed, saved locally:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_products_updated'));
    }
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!id) return false;

    const products = loadProductsFromStorage();
    const target = products.find((p) => p.id === id || (p as any)._id === id);
    const targetId = target?.id || id;
    const targetMongoId = (target as any)?._id;

    const idsToRemove = new Set(
      [id, targetId, targetMongoId ? String(targetMongoId) : ''].filter(Boolean)
    );

    const filtered = products.filter(
      (p) => !idsToRemove.has(p.id) && !idsToRemove.has(String((p as any)._id))
    );

    saveProductsToStorage(filtered);

    try {
      if (targetId) {
        await fetchFromAPI<{ message: string }>(`/products/${targetId}`, {
          method: 'DELETE',
        });
      }
      if (targetMongoId && String(targetMongoId) !== String(targetId)) {
        await fetchFromAPI<{ message: string }>(`/products/${String(targetMongoId)}`, {
          method: 'DELETE',
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('API deleteProduct failed, deleted locally:', err);
    }

    try {
      const remote = await fetchFromAPI<Product[]>('/products');
      if (remote && Array.isArray(remote)) {
        const cleanRemote = remote
          .map((p: any) => ({
            ...p,
            id: p.id || p._id || `p_${Date.now()}`,
          }))
          .filter(
            (p) => !idsToRemove.has(p.id) && !idsToRemove.has(String((p as any)._id))
          );
        saveProductsToStorage(cleanRemote);
      }
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_products_updated'));
    }

    return true;
  },

  async toggleProductAvailability(id: string): Promise<Product | null> {
    const products = loadProductsFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index].available = !products[index].available;
    const updated = products[index];
    saveProductsToStorage(products);

    try {
      // Sync to Express REST API backend
      await fetchFromAPI<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ available: updated.available }),
      });
      await this.getProducts();
    } catch (err) {
      console.warn('API toggleProductAvailability failed, updated locally:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_products_updated'));
    }
    return updated;
  },
};
