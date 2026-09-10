import { useState, useEffect, useMemo } from 'react';
import type { Product, FilterOptions } from '../types/product';
import { ProductService } from '../services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    setLoading(true);
    const data = await ProductService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshProducts();
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
