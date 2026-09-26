import type { CategoryItem } from '../types/category';
import { fetchFromAPI } from './apiClient';

const LOCAL_STORAGE_KEY = 'mstore_categories_db_v1';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_iphones',
    name: 'iPhones',
    slug: 'iphones',
    image: '/images/cat-iphones.png',
    link: '/iphones',
    type: 'iphone-new',
    description: 'Brand new sealed Apple iPhones with official warranty.',
    status: 'active',
    displayOrder: 1,
  },
  {
    id: 'cat_used_iphones',
    name: 'Used iPhones',
    slug: 'used-iphones',
    image: '/images/cat-preowned.png?v=2',
    link: '/used-iphones',
    type: 'iphone-used',
    description: 'Certified pre-owned iPhones tested for battery & performance.',
    status: 'active',
    displayOrder: 2,
  },
  {
    id: 'cat_android',
    name: 'Android',
    slug: 'android',
    image: '/images/cat-iphones.png',
    link: '/category/android',
    type: 'android',
    description: 'Latest & pre-owned Android smartphones.',
    status: 'active',
    displayOrder: 3,
  },
  {
    id: 'cat_accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/cat-accessories.png',
    link: '/accessories',
    type: 'accessory',
    description: 'Original Apple accessories, adapters, cases & audio gear.',
    status: 'active',
    displayOrder: 4,
  },
  {
    id: 'cat_offers',
    name: 'Offers',
    slug: 'offers',
    image: '/images/cat-offers.png',
    link: '/offers',
    type: 'offers',
    description: 'Exclusive combo deals, promotional discounts and gift bundles.',
    status: 'active',
    displayOrder: 5,
  },
];

function loadCategoriesFromStorage(): CategoryItem[] {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
  } catch (err) {
    console.error('Failed to save categories to storage:', err);
  }
  return INITIAL_CATEGORIES;
}

function saveCategoriesToStorage(categories: CategoryItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mstore_categories_updated'));
    }
  } catch (err) {
    console.error('Failed to save categories to storage:', err);
  }
}

export const CategoryService = {
  getCategoriesSync(): CategoryItem[] {
    return loadCategoriesFromStorage();
  },

  async getCategories(): Promise<CategoryItem[]> {
    const remote = await fetchFromAPI<CategoryItem[]>('/categories');
    let list: CategoryItem[] = INITIAL_CATEGORIES;
    if (remote && Array.isArray(remote) && remote.length > 0) {
      // Merge any missing standard categories
      const map = new Map<string, CategoryItem>();
      INITIAL_CATEGORIES.forEach((cat) => map.set(cat.slug, cat));
      remote.forEach((cat) => map.set(cat.slug, { ...map.get(cat.slug), ...cat }));
      list = Array.from(map.values()).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
    saveCategoriesToStorage(list);
    return list;
  },

  async getActiveCategories(): Promise<CategoryItem[]> {
    const categories = await this.getCategories();
    return categories.filter((c) => c.status === 'active');
  },

  async addCategory(data: Partial<CategoryItem>): Promise<CategoryItem> {
    const categories = loadCategoriesFromStorage();
    const name = data.name || 'New Category';
    const slug = data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory: CategoryItem = {
      id: 'cat_' + Date.now(),
      name,
      slug,
      image: data.image || '/images/placeholder-iphone.svg',
      link: data.link || `/products?category=${slug}`,
      type: data.type || 'custom',
      description: data.description || '',
      status: data.status || 'active',
      displayOrder: data.displayOrder || categories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...categories, newCategory];
    saveCategoriesToStorage(updated);

    await fetchFromAPI<CategoryItem>('/categories', {
      method: 'POST',
      body: JSON.stringify(newCategory),
    });

    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const categories = loadCategoriesFromStorage();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCategory: CategoryItem = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    categories[index] = updatedCategory;
    saveCategoriesToStorage(categories);

    await fetchFromAPI<CategoryItem>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    return updatedCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = loadCategoriesFromStorage();
    const filtered = categories.filter((c) => c.id !== id);
    saveCategoriesToStorage(filtered);

    try {
      await fetchFromAPI<{ message: string }>(`/categories/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete category on server API:', err);
    }
    return true;
  },
};
