import { useState, useEffect, useMemo } from 'react';
import type { Product, FilterOptions } from '../types/product';
import { ProductService } from '../services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    return ProductService.getProductsSync();
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const initial = ProductService.getProductsSync();
    return initial.length === 0;
  });
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: 'all',
    condition: 'all',
    model: 'all',
    storage: 'all',
    minPrice: 0,
    maxPrice: 200000,
    availableOnly: false,
    sortBy: 'featured',
  });

  const refreshProducts = async () => {
    try {
      const data = await ProductService.getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed refreshing products in useProducts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();

    const handleUpdate = () => {
      refreshProducts();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_products_updated', handleUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_products_updated', handleUpdate);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchModel = p.model.toLowerCase().includes(q);
        const matchStorage = p.storage.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchModel && !matchStorage && !matchDesc) return false;
      }

      // Category
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }

      // Condition filter
      if (filters.condition === 'new' && p.condition !== 'Brand New') {
        return false;
      }
      if (filters.condition === 'used' && p.condition === 'Brand New') {
        return false;
      }

      // Model filter
      if (filters.model !== 'all' && p.model !== filters.model) {
        return false;
      }

      // Storage filter
      if (filters.storage !== 'all' && p.storage !== filters.storage) {
        return false;
      }

      // Price filter
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // Store filter
      if (
        filters.storeId &&
        filters.storeId !== 'all' &&
        filters.storeId !== 'ALL'
      ) {
        const fStore = filters.storeId.toLowerCase();
        const pStore = (p.storeId || '').toLowerCase();
        const pStoreIds = (p.storeIds || []).map((s) => s.toLowerCase());

        const isAll = pStore === 'all' || pStoreIds.includes('all');
        const isMatch =
          isAll ||
          pStore === fStore ||
          pStoreIds.includes(fStore) ||
          (fStore === 'store001' && (pStore.includes('kootanad') || pStoreIds.some((s) => s.includes('kootanad')))) ||
          (fStore === 'store002' && (pStore.includes('kecheri') || pStoreIds.some((s) => s.includes('kecheri')))) ||
          (fStore === 'store003' && (pStore.includes('mattom') || pStoreIds.some((s) => s.includes('mattom')))) ||
          (fStore === 'store004' && (pStore.includes('pattambi') || pStoreIds.some((s) => s.includes('pattambi')))) ||
          (pStore === 'store001' && fStore.includes('kootanad')) ||
          (pStore === 'store002' && fStore.includes('kecheri')) ||
          (pStore === 'store003' && fStore.includes('mattom')) ||
          (pStore === 'store004' && fStore.includes('pattambi'));

        if (!isMatch) return false;
      }

      // Availability filter
      if (filters.availableOnly && !p.available) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Featured sorting default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, filters]);

  return {
    products,
    filteredProducts,
    loading,
    filters,
    setFilters,
    refreshProducts,
  };
}
