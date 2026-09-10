import { INITIAL_MOCK_PRODUCTS } from '../data/mockProducts';
import type { Product } from '../types/product';

const LOCAL_STORAGE_KEY = 'mstore_products_db_v4';

// Helper to load products from LocalStorage or initialize with defaults
function loadProductsFromStorage(): Product[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed: Product[] = JSON.parse(data);
      // Ensure initial mock items are merged and updated in local storage
      const initialIds = new Set(INITIAL_MOCK_PRODUCTS.map((p) => p.id));
      const customAdded = parsed.filter((p) => !initialIds.has(p.id));
      const updated = [...INITIAL_MOCK_PRODUCTS, ...customAdded];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
  }
  // Initialize with initial mock products
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PRODUCTS));
  return INITIAL_MOCK_PRODUCTS;
}

function saveProductsToStorage(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

/**
 * Service Abstraction for Products API
 * This layer is prepared for seamless transition to Firebase Firestore later.
 */
export const ProductService = {
  async getProducts(): Promise<Product[]> {
    // Simulating slight network latency for realistic feel
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadProductsFromStorage());
      }, 100);
    });
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = loadProductsFromStorage();
    const found = products.find((p) => p.id === id);
    return found || null;
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = loadProductsFromStorage();
    const newProduct: Product = {
      ...productData,
      id: 'p_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = loadProductsFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    saveProductsToStorage(products);
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = loadProductsFromStorage();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    saveProductsToStorage(filtered);
    return true;
  },

  async toggleProductAvailability(id: string): Promise<Product | null> {
    const products = loadProductsFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index].available = !products[index].available;
    saveProductsToStorage(products);
    return products[index];
  },
};
